export type Role = "system" | "user" | "assistant";
export interface ChatMessage { role: Role; content: string }

export interface ModelInfo {
  id: string;        // "groq:llama-3.3-70b-versatile"
  provider: string;  // "groq"
  apiModel: string;  // "llama-3.3-70b-versatile"
  label: string;
}

export interface StreamParams {
  apiModel: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface AIProvider {
  id: string;
  name: string;
  isConfigured(): boolean;
  listModels(): Promise<ModelInfo[]>;
  stream(p: StreamParams): AsyncGenerator<string>;
}

export class ProviderError extends Error {
  constructor(public provider: string, public status: number, message: string) {
    super(message);
  }
}

// A key counts as configured only if it is set and not a placeholder.
export function hasKey(envName: string): boolean {
  const v = process.env[envName]?.trim();
  return !!v && v !== "your_key" && !v.startsWith("your_");
}