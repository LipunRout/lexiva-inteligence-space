export type Role = 'user' | 'assistant';

export interface Attachment {
  name: string;
  size: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  /** Model that produced this reply (assistant only). */
  modelId?: string;
  /** Selected model when this reply had to use a fallback. */
  fallbackFromModelId?: string;
  /** sample = hand-written demo content; notice = Lexiva system notice or error (not model output). */
  kind?: 'sample' | 'notice';
  feedback?: 'up' | 'down';
  /** Files attached to a user message (names only; the text lives on the server). */
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  updatedAt: number;
  sample?: boolean;
  messages: Message[];
}

export type ModelGroup = 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'Other';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  group: ModelGroup;
  description: string;
  color: string;
  /** connected = provider key is configured; planned = roadmap only; unavailable = unknown or removed. */
  status: 'connected' | 'planned' | 'unavailable';
}