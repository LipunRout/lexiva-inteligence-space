import { NextResponse } from "next/server";
import { listModels } from "@/server/ai/model-registry";

export const dynamic = "force-dynamic";

export const GET = async () => NextResponse.json({ models: await listModels() });