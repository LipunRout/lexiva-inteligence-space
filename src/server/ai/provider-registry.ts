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

  createOpenAICompatible({
    id: "nvidia",
    name: "NVIDIA",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    apiKeyEnv: "NVIDIA_API_KEY",
  }),

  createOpenAICompatible({
    id: "kimi",
    name: "Kimi",
    baseUrl: "https://api.moonshot.ai/v1",
    apiKeyEnv: "KIMI_API_KEY",
  }),

  createOpenAICompatible({
    id: "huggingface",
    name: "Hugging Face",
    baseUrl: "https://router.huggingface.co/v1",
    apiKeyEnv: "HUGGINGFACEHUB_API_KEY",
  }),

  createOpenAICompatible({
    id: "cloudflare",
    name: "Cloudflare Workers AI",
    baseUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
    apiKeyEnv: "CLOUDFLARE_API_KEY",
    requiredEnv: ["CLOUDFLARE_ACCOUNT_ID"],
  }),
];

export const getProvider = (id: string) => providers.find((p) => p.id === id);
export const getConfiguredProviders = () => providers.filter((p) => p.isConfigured());