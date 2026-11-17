import { ChatMessage, ModelInfo, ProviderError } from "./ai-types";
import { findModel, listModels } from "./model-registry";
import { getProvider } from "./provider-registry";

interface Opts {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export async function* streamChat(modelId: string, messages: ChatMessage[], opts: Opts = {}) {
  const model = await findModel(modelId);
  if (!model) throw new ProviderError("router", 400, "Model not available or provider not configured");

  yield* streamModel(model, messages, opts);
}

async function* streamModel(model: ModelInfo, messages: ChatMessage[], opts: Opts = {}) {
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
  const availableModels = await listModels();

  return Promise.all(
    modelIds.map(async (modelId) => {
      const t0 = Date.now();
      try {
        const model = availableModels.find((item) => item.id === modelId);
        if (!model) throw new ProviderError("router", 400, "Model not available or provider not configured");

        let text = "";
        for await (const chunk of streamModel(model, messages)) text += chunk;
        return { modelId, ok: true as const, text, ms: Date.now() - t0 };
      } catch (error: unknown) {
        return {
          modelId,
          ok: false as const,
          error: error instanceof Error ? error.message : "Failed",
          ms: Date.now() - t0,
        };
      }
    })
  );
}