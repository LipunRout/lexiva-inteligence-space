import { ChatMessage, ProviderError } from "./ai-types";
import { findModel } from "./model-registry";
import { getProvider } from "./provider-registry";

interface Opts {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export async function* streamChat(modelId: string, messages: ChatMessage[], opts: Opts = {}) {
  const model = await findModel(modelId);
  if (!model) throw new ProviderError("router", 400, "Model not available or provider not configured");

  const provider = getProvider(model.provider);
  if (!provider) throw new ProviderError("router", 500, "Provider not found");

  yield* provider.stream({ apiModel: model.apiModel, messages, ...opts });
}

export async function completeChat(modelId: string, messages: ChatMessage[], opts: Opts = {}) {
  let text = "";
  for await (const chunk of streamChat(modelId, messages, opts)) text += chunk;
  return text;
}

export async function compareModels(modelIds: string[], messages: ChatMessage[]) {
  return Promise.all(
    modelIds.map(async (modelId) => {
      const t0 = Date.now();
      try {
        const text = await completeChat(modelId, messages);
        return { modelId, ok: true as const, text, ms: Date.now() - t0 };
      } catch (e: any) {
        return { modelId, ok: false as const, error: e?.message ?? "Failed", ms: Date.now() - t0 };
      }
    })
  );
}