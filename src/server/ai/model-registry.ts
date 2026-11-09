import { getConfiguredProviders } from "./provider-registry";
import { ModelInfo } from "./ai-types";

export async function listModels(): Promise<ModelInfo[]> {
  const lists = await Promise.all(
    getConfiguredProviders().map((p) => p.listModels().catch(() => [] as ModelInfo[]))
  );
  return lists.flat();
}

export async function findModel(id: string) {
  return (await listModels()).find((m) => m.id === id);
}