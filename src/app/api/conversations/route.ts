import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("conversations")
    .select("id, title, updated_at, messages(id, role, content, model, created_at, attachments)")
    .order("updated_at", { ascending: false })
    .order("created_at", { referencedTable: "messages", ascending: true })
    .limit(50);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ conversations: data });
}