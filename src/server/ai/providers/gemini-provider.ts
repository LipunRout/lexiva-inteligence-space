import { AIProvider, ModelInfo, ProviderError, hasKey } from "../ai-types";
import { cached } from "../cache";
import { sseData } from "../sse";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

// Skip non-chat models, experimental ones, and all Pro models (no free quota).
const SKIP = /embedding|tts|image|audio|live|native|robotics|computer-use|aqa|exp|argon|omni|nano[- ]?banana|preview|(^|[-/])pro([-/]|$)/i;

interface GeminiModel {
  name: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
}

const loadModels = cached<ModelInfo[]>(
  60 * 60 * 1000,
  async () => {
    const res = await fetch(`${BASE}/models?pageSize=200`, {
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY! },
    });
    if (!res.ok) throw new Error(`Gemini model list failed (${res.status})`);

    const data: { models?: GeminiModel[] } = await res.json();
    return (data.models ?? [])
      .filter(
        (m) =>
          m.name.startsWith("models/gemini-") &&
          m.supportedGenerationMethods?.includes("generateContent") &&
          !SKIP.test(m.name)
      )
      .map((m) => {
        const apiModel = m.name.replace("models/", "");
        return {
          id: `gemini:${apiModel}`,
          provider: "gemini",
          apiModel,
          label: m.displayName ?? apiModel,
        };
      })
      .sort((a, b) => b.apiModel.localeCompare(a.apiModel))
      .slice(0, 8);
  },
  []
);

export const geminiProvider: AIProvider = {
  id: "gemini",
  name: "Google Gemini",
  isConfigured: () => hasKey("GEMINI_API_KEY"),
  listModels: loadModels,

  async *stream({ apiModel, messages, temperature, maxTokens, signal }) {
    const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const res = await fetch(`${BASE}/models/${apiModel}:streamGenerateContent?alt=sse`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents,
        ...(system && { systemInstruction: { parts: [{ text: system }] } }),
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    });
    if (!res.ok) throw new ProviderError("gemini", res.status, (await res.text()).slice(0, 300));

    for await (const data of sseData(res)) {
      const parts = JSON.parse(data).candidates?.[0]?.content?.parts ?? [];
      for (const p of parts) if (p.text) yield p.text;
    }
  },
};