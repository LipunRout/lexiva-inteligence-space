import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { compareModels } from "@/server/ai/ai-router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Body = z.object({
  models: z.array(z.string()).min(2).max(4),
  prompt: z.string().min(1).max(20000),
});

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

  const results = await compareModels(parsed.data.models, [
    { role: "user", content: parsed.data.prompt },
  ]);
  return Response.json({ results });
}