import { getConfiguredProviders } from "./provider-registry";
import { ModelInfo } from "./ai-types";

const unavailableModelPatterns = [
  /allam-2-7b/i,
  /01-ai\/yi-large/i,
  /adept\/fuyu-8b/i,
  /ai21labs\/jamba-1\.5-large-instruct/i,
  /bigcode\/starcoder2-15b/i,
  /databricks\/dbrx-instruct/i,
  /deepseek-ai\/deepseek-coder-6\.7b-instruct/i,
  /google\/codegemma-1\.1-7b/i,
];

function isAvailableModel(model: ModelInfo) {
  const identifier = `${model.id} ${model.apiModel} ${model.label}`;
  const unsupportedGeminiModel =
    model.provider === "gemini" && /argon|omni|nano[- ]?banana/i.test(identifier);
  return !unsupportedGeminiModel && !unavailableModelPatterns.some((pattern) => pattern.test(identifier));
}

export async function listModels(): Promise<ModelInfo[]> {
  const lists = await Promise.all(
    getConfiguredProviders().map((p) => p.listModels().catch(() => [] as ModelInfo[]))
  );
  return lists.flat().filter(isAvailableModel);
}

export async function findModel(id: string) {
  return (await listModels()).find((m) => m.id === id);
}