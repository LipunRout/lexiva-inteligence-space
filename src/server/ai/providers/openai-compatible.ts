import { AIProvider, ModelInfo, ProviderError, hasKey } from "../ai-types";
import { cached } from "../cache";
import { sseData } from "../sse";

const HOUR = 60 * 60 * 1000;

interface Cfg {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  extraHeaders?: Record<string, string>;
  /** Fixed list, for providers without a usable /models endpoint. */
  staticModels?: { apiModel: string; label: string }[];
  /** Live listing filters. */
  include?: RegExp;
  exclude?: RegExp;
  limit?: number;
}

export function createOpenAICompatible(cfg: Cfg): AIProvider {
  const toInfo = (apiModel: string, label = apiModel): ModelInfo => ({
    id: `${cfg.id}:${apiModel}`,
    provider: cfg.id,
    apiModel,
    label,
  });

  const loadModels = cached<ModelInfo[]>(
    HOUR,
    async () => {
      if (cfg.staticModels) return cfg.staticModels.map((m) => toInfo(m.apiModel, m.label));

      const res = await fetch(`${cfg.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${process.env[cfg.apiKeyEnv]}`, ...cfg.extraHeaders },
      });
      if (!res.ok) throw new Error(`${cfg.name} model list failed (${res.status})`);

      const json = await res.json();
      const rows: { id?: string }[] = json.data ?? json.models ?? [];

      return rows
        .map((r) => r.id)
        .filter(
          (id): id is string =>
            !!id && (!cfg.include || cfg.include.test(id)) && !cfg.exclude?.test(id)
        )
        .sort()
        .slice(0, cfg.limit ?? 12)
        .map((id) => toInfo(id));
    },
    []
  );

  return {
    id: cfg.id,
    name: cfg.name,
    isConfigured: () => hasKey(cfg.apiKeyEnv),
    listModels: loadModels,

    async *stream({ apiModel, messages, temperature, maxTokens, signal }) {
      const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env[cfg.apiKeyEnv]}`,
          ...cfg.extraHeaders,
        },
        body: JSON.stringify({
          model: apiModel,
          messages,
          stream: true,
          temperature,
          max_tokens: maxTokens,
        }),
      });
      if (!res.ok) throw new ProviderError(cfg.id, res.status, (await res.text()).slice(0, 300));

      for await (const data of sseData(res)) {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) yield delta;
      }
    },
  };
}