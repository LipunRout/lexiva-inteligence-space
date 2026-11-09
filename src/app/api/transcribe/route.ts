import { supabaseServer } from "@/lib/supabase-server";
import { hasKey } from "@/server/ai/ai-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!hasKey("GROQ_API_KEY")) {
    return Response.json({ error: "Voice input needs a Groq API key (GROQ_API_KEY)." }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const audio = form?.get("audio");
  if (!audio || typeof audio === "string" || audio.size === 0) {
    return Response.json({ error: "No audio received." }, { status: 400 });
  }
  if (audio.size > MAX_BYTES) {
    return Response.json({ error: "Recording is too large. Keep it under about 2 minutes." }, { status: 413 });
  }

  const out = new FormData();
  out.append("file", audio, (audio as File).name || "voice.webm");
  out.append("model", "whisper-large-v3-turbo");
  out.append("response_format", "json");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: out,
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    return Response.json({ error: `Transcription failed (${res.status}). ${detail}` }, { status: 502 });
  }

  const data = await res.json();
  return Response.json({ text: String(data.text ?? "").trim() });
}