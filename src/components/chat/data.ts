import type { Conversation, ModelGroup, ModelInfo } from './types';

export const MODELS: ModelInfo[] = [
  { id: 'gpt', name: 'GPT', provider: 'OpenAI', group: 'OpenAI', description: 'General-purpose writing and reasoning.', color: '#34d399', status: 'planned' },
  { id: 'claude', name: 'Claude', provider: 'Anthropic', group: 'Anthropic', description: 'Long-form writing, analysis and code.', color: '#fb923c', status: 'planned' },
  { id: 'gemini', name: 'Gemini', provider: 'Google', group: 'Google', description: 'Multimodal and long-context work.', color: '#6F73F7', status: 'planned' },
  { id: 'llama', name: 'Llama', provider: 'Meta', group: 'Meta', description: 'Open-weight models you can host yourself.', color: '#38bdf8', status: 'planned' },
  { id: 'mistral', name: 'Mistral', provider: 'Mistral AI', group: 'Other', description: 'Fast, efficient general models.', color: '#facc15', status: 'planned' },
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', group: 'Other', description: 'Reasoning and coding focused models.', color: '#60a5fa', status: 'planned' },
];

export const GROUP_ORDER: ModelGroup[] = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Other'];

export const getModel = (id: string): ModelInfo => MODELS.find((m) => m.id === id) ?? MODELS[0];

export const DEFAULT_MODEL = 'claude';

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
    '**No AI model is connected yet.**',
    '',
    'Your message stayed in this browser and was not sent anywhere.',
    '',
    `- Selected model: **${m.name}** (${m.provider}), planned`,
    '- Once a provider is connected, replies will appear here with the real model name',
    '- Conversations reset when you refresh this page',
  ].join('\n');
}

const DAY = 86_400_000;

export function seedConversations(): Conversation[] {
  const now = Date.now();
  const code = [
    '```ts',
    '// Sample code block with a copy button',
    'async function ask(prompt: string) {',
    '  const res = await fetch("/api/chat", {',
    '    method: "POST",',
    '    body: JSON.stringify({ prompt }),',
    '  });',
    '  return res.json();',
    '}',
    '```',
  ].join('\n');

  return [
    {
      id: 'sample-1',
      title: 'Sample: formatting preview',
      modelId: 'claude',
      updatedAt: now - 20 * 60_000,
      sample: true,
      messages: [
        { id: 's1a', role: 'user', content: 'Show me how lists and code look in this workspace.', createdAt: now - 21 * 60_000 },
        {
          id: 's1b',
          role: 'assistant',
          kind: 'sample',
          modelId: 'claude',
          createdAt: now - 20 * 60_000,
          content: [
            '## Formatting preview',
            '',
            'Replies support **bold text**, `inline code`, lists and code blocks:',
            '',
            '- Clear attribution above every reply',
            '- Copy, regenerate and feedback actions',
            '- Code blocks with a copy button',
            '',
            code,
            '',
            'This text was written by hand to show the layout.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'sample-2',
      title: 'Sample: comparing two ideas',
      modelId: 'gpt',
      updatedAt: now - DAY - 3 * 3_600_000,
      sample: true,
      messages: [
        { id: 's2a', role: 'user', content: 'How would I compare answers from two models?', createdAt: now - DAY - 3 * 3_600_000 },
        {
          id: 's2b',
          role: 'assistant',
          kind: 'sample',
          modelId: 'gpt',
          createdAt: now - DAY - 3 * 3_600_000,
          content: ['Side-by-side comparison is planned:', '', '1. Send one prompt to several models', '2. See each answer labelled with its model', '3. Keep the one you prefer', '', 'The compare page is disabled until providers are connected.'].join('\n'),
        },
      ],
    },
    {
      id: 'sample-3',
      title: 'Sample: planning a launch',
      modelId: 'llama',
      updatedAt: now - 4 * DAY,
      sample: true,
      messages: [
        { id: 's3a', role: 'user', content: 'Help me plan a small product launch.', createdAt: now - 4 * DAY },
        {
          id: 's3b',
          role: 'assistant',
          kind: 'sample',
          modelId: 'llama',
          createdAt: now - 4 * DAY,
          content: ['### Launch checklist (sample)', '', '- Define one clear audience', '- Write the headline and short pitch', '- Prepare a simple landing page', '- Choose a launch date and share it'].join('\n'),
        },
      ],
    },
  ];
}

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