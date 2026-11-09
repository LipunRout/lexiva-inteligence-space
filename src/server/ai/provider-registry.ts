import { AIProvider } from "./ai-types";
import { createOpenAICompatible } from "./providers/openai-compatible";
import { geminiProvider } from "./providers/gemini-provider";

const providers: AIProvider[] = [
  geminiProvider,

  // Live model lists (always current)
  createOpenAICompatible({
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    exclude: /whisper|tts|guard|playai|safeguard|orpheus/i,
    limit: 20,
  }),

  createOpenAICompatible({
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    apiKeyEnv: "MISTRAL_API_KEY",
    include: /latest$/,
    exclude: /embed|moderation|ocr|transcri/i,
    limit: 10,
  }),

  createOpenAICompatible({
    id: "cerebras",
    name: "Cerebras",
    baseUrl: "https://api.cerebras.ai/v1",
    apiKeyEnv: "CEREBRAS_API_KEY",
    limit: 10,
  }),

  // Fixed lists (these work today)
  createOpenAICompatible({
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    extraHeaders: { "X-Title": "Lexiva" },
    staticModels: [
      { apiModel: "deepseek/deepseek-chat", label: "DeepSeek V3" },
      { apiModel: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B (OR)" },
    ],
  }),

  createOpenAICompatible({
    id: "cohere",
    name: "Cohere",
    baseUrl: "https://api.cohere.ai/compatibility/v1",
    apiKeyEnv: "COHERE_API_KEY",
    staticModels: [
      { apiModel: "command-a-03-2025", label: "Command A" },
      { apiModel: "command-r-plus-08-2024", label: "Command R+" },
    ],
  }),
];

export const getProvider = (id: string) => providers.find((p) => p.id === id);
export const getConfiguredProviders = () => providers.filter((p) => p.isConfigured());