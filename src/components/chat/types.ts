export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  /** Model that was selected when this reply was produced (assistant only). */
  modelId?: string;
  /** sample = hand-written demo content; notice = local "no model connected" reply. */
  kind?: 'sample' | 'notice';
  feedback?: 'up' | 'down';
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
  /** Nothing is connected in this prototype, so every model is planned. */
  status: 'planned' | 'unavailable';
}