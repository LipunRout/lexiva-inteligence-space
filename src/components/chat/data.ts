import type { Conversation, ModelGroup, ModelInfo } from './types';

// Static "planned" list, kept only so older imports keep working.
export const MODELS: ModelInfo[] = [
  { id: 'gpt', name: 'GPT', provider: 'OpenAI', group: 'OpenAI', description: 'General-purpose writing and reasoning.', color: '#34d399', status: 'planned' },
  { id: 'claude', name: 'Claude', provider: 'Anthropic', group: 'Anthropic', description: 'Long-form writing, analysis and code.', color: '#fb923c', status: 'planned' },
  { id: 'gemini', name: 'Gemini', provider: 'Google', group: 'Google', description: 'Multimodal and long-context work.', color: '#6F73F7', status: 'planned' },
  { id: 'llama', name: 'Llama', provider: 'Meta', group: 'Meta', description: 'Open-weight models you can host yourself.', color: '#38bdf8', status: 'planned' },
  { id: 'mistral', name: 'Mistral', provider: 'Mistral AI', group: 'Other', description: 'Fast, efficient general models.', color: '#facc15', status: 'planned' },
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', group: 'Other', description: 'Reasoning and coding focused models.', color: '#60a5fa', status: 'planned' },
];

export const GROUP_ORDER: ModelGroup[] = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Other'];

// ---- Live models (loaded from /api/models) ----

export interface ApiModel {
  id: string;
  provider: string;
  apiModel: string;
  label: string;
}

const PROVIDERS: Record<string, { name: string; color: string }> = {
  gemini: { name: 'Google', color: '#6F73F7' },
  groq: { name: 'Groq', color: '#f97316' },
  openrouter: { name: 'OpenRouter', color: '#a78bfa' },
  mistral: { name: 'Mistral AI', color: '#facc15' },
  cohere: { name: 'Cohere', color: '#34d399' },
  cerebras: { name: 'Cerebras', color: '#38bdf8' },
};

let live: ModelInfo[] = [];
export const setLiveModels = (list: ModelInfo[]) => {
  live = list;
};

export function liveModelFrom(m: ApiModel): ModelInfo {
  const meta = PROVIDERS[m.provider];
  return {
    id: m.id,
    name: m.label,
    provider: meta?.name ?? m.provider,
    group: 'Other',
    description: `${m.apiModel} via ${meta?.name ?? m.provider}`,
    color: meta?.color ?? '#8e8d95',
    status: 'connected',
  };
}

function fallbackModel(id: string): ModelInfo {
  const [provider, ...rest] = id.split(':');
  const hasProvider = rest.length > 0;
  return {
    id,
    name: (hasProvider ? rest.join(':') : provider) || 'No model',
    provider: hasProvider ? PROVIDERS[provider]?.name ?? provider : '',
    group: 'Other',
    description: '',
    color: PROVIDERS[provider]?.color ?? '#8e8d95',
    status: 'unavailable',
  };
}

export const getModel = (id: string): ModelInfo =>
  live.find((m) => m.id === id) ?? MODELS.find((m) => m.id === id) ?? fallbackModel(id);

export const DEFAULT_MODEL = '';

export const SUGGESTIONS = [
  { icon: '✦', title: 'Explain a complex concept', text: 'Explain how neural networks learn, in simple terms.' },
  { icon: '</>', title: 'Help me write better code', text: 'Review this approach for handling API errors in React.' },
  { icon: '◎', title: 'Analyze an idea', text: 'Analyze the strengths and risks of a multi-model AI workspace.' },
  { icon: '✧', title: 'Brainstorm something creative', text: 'Brainstorm ten names for a calm, focused AI chat app.' },
];

export function titleFrom(text: string) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > 42 ? t.slice(0, 42).trimEnd() + '…' : t;
}

export function noticeFor(modelId: string) {
  const m = getModel(modelId);
  return [
    '**No model is available.**',
    '',
    `- Selected: **${m.name}**`,
    '- Add at least one provider API key to `.env.local`, then restart the server',
  ].join('\n');
}

// Samples were removed: conversations now load from your account.
export const seedConversations = (): Conversation[] => [];

const DAY = 86_400_000;

export function groupConversations(list: Conversation[]) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = start.getTime();
  const groups: { label: string; items: Conversation[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Previous 7 Days', items: [] },
    { label: 'Older', items: [] },
  ];
  [...list]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((c) => {
      if (c.updatedAt >= today) groups[0].items.push(c);
      else if (c.updatedAt >= today - DAY) groups[1].items.push(c);
      else if (c.updatedAt >= today - 7 * DAY) groups[2].items.push(c);
      else groups[3].items.push(c);
    });
  return groups.filter((g) => g.items.length);
}