import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { streamChat } from "@/server/ai/ai-router";
import { listModels } from "@/server/ai/model-registry";
import type { ChatMessage } from "@/server/ai/ai-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Attachment = z.object({
  name: z.string().min(1).max(200),
  size: z.number().int().nonnegative(),
  text: z.string().min(1).max(100_000),
});

const Body = z
  .object({
    conversationId: z.string().uuid(),
    model: z.string().min(1),
    content: z.string().min(1).max(20000).optional(),
    regenerate: z.boolean().optional(),
    attachments: z.array(Attachment).max(3).optional(),
  })
  .refine((b) => b.regenerate || b.content, { message: "content required" });

const makeTitle = (t: string) => t.replace(/\s+/g, " ").trim().slice(0, 60);

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { conversationId, model, content, regenerate, attachments } = parsed.data;

  const totalChars = (attachments ?? []).reduce((n, a) => n + a.text.length, 0);
  if (totalChars > 150_000) {
    return Response.json({ error: "Attached files are too large. Try fewer or smaller files." }, { status: 400 });
  }

  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const availableModels = await listModels();
  const selectedModel = availableModels.find((item) => item.id === model);
  if (!selectedModel) {
    return Response.json({ error: "That model isn't available. Pick another one." }, { status: 400 });
  }
  const seenProviders = new Set([selectedModel.provider]);
  const otherProviderModels = availableModels.filter((item) => {
    if (seenProviders.has(item.provider)) return false;
    seenProviders.add(item.provider);
    return true;
  });
  const sameProviderModels = availableModels.filter(
    (item) => item.provider === selectedModel.provider && item.id !== selectedModel.id
  );
  const candidates = [selectedModel, ...otherProviderModels, ...sameProviderModels].slice(0, 3);

  const { data: existing } = await sb
    .from("conversations").select("id").eq("id", conversationId).maybeSingle();

  if (!existing) {
    if (regenerate || !content) {
      return Response.json({ error: "Conversation not found. Send your message again." }, { status: 404 });
    }
    const { error } = await sb.from("conversations")
      .insert({ id: conversationId, user_id: user.id, title: makeTitle(content) });
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  if (regenerate) {
    const { data: last } = await sb.from("messages").select("id, role")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (last?.role === "assistant") await sb.from("messages").delete().eq("id", last.id);
  } else {
    const attachmentText = attachments?.length
      ? attachments
          .map((a) => `<file name="${a.name.replace(/"/g, "'")}">\n${a.text}\n</file>`)
          .join("\n\n")
      : null;

    const { error } = await sb.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: content!,
      attachments: attachments?.length ? attachments.map(({ name, size }) => ({ name, size })) : null,
      attachment_text: attachmentText,
    });
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  // Last 30 messages, oldest first. Consecutive messages with the same role are merged.
  const { data: rows } = await sb.from("messages").select("role, content, attachment_text")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false }).limit(30);

  const history: ChatMessage[] = [];
  for (const r of ((rows ?? []) as any[]).reverse()) {
    const text = r.attachment_text ? `${r.content}\n\n${r.attachment_text}` : r.content;
    const prev = history[history.length - 1];
    if (prev && prev.role === r.role) prev.content += `\n\n${text}`;
    else history.push({ role: r.role, content: text });
  }

  const enc = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, obj: unknown) => {
    try { c.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`)); } catch {}
  };

  const stream = new ReadableStream({
    async start(controller) {
      let full = "";
      let responseModel = selectedModel;

      // Saves whatever has been generated so far (also used when the user presses Stop)
      const save = async () => {
        if (full) {
          await sb.from("messages").insert({
            conversation_id: conversationId, role: "assistant", content: full,
            provider: responseModel.provider, model: responseModel.id,
          });
        }
        await sb.from("conversations")
          .update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
      };

      try {
        const failures: string[] = [];

        for (const candidate of candidates) {
          let candidateText = "";
          try {
            for await (const chunk of streamChat(candidate.id, history, { signal: req.signal })) {
              if (!candidateText) {
                responseModel = candidate;
                send(controller, {
                  type: "meta",
                  conversationId,
                  model: candidate.id,
                  fallbackFrom: candidate.id === selectedModel.id ? undefined : selectedModel.id,
                });
              }
              candidateText += chunk;
              full = candidateText;
              send(controller, { type: "delta", text: chunk });
            }

            responseModel = candidate;
            full = candidateText;
            if (!candidateText) {
              send(controller, {
                type: "meta",
                conversationId,
                model: candidate.id,
                fallbackFrom: candidate.id === selectedModel.id ? undefined : selectedModel.id,
              });
            }
            break;
          } catch (error) {
            if (candidateText || req.signal.aborted) throw error;
            failures.push(error instanceof Error ? error.message : "Provider error");
            if (candidate === candidates[candidates.length - 1]) {
              const fallbackCount = failures.length - 1;
              const summary = fallbackCount
                ? `The selected model and ${fallbackCount} fallback model(s) could not respond.`
                : "The selected model could not respond.";
              throw new Error(`${summary} ${failures[failures.length - 1]}`);
            }
          }
        }

        await save();
        send(controller, { type: "done" });
      } catch (e: any) {
        await save().catch(() => {});
        if (!req.signal.aborted) send(controller, { type: "error", message: e?.message ?? "Provider error" });
      } finally {
        try { controller.close(); } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}