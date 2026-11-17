const PROMPT_PREFIX =
  /^(?:(?:please|can you|could you|would you|i want to know|i need to know|i want you to|i need you to|tell me about|help me understand|how do i|how can i|how to|what is|what are|why does|why is|help me|tell me|show me|understand|explain|write|create|generate|summarize|summarise|analyze|analyse|plan|draft|compare|give me|fix|debug|review|translate|brainstorm|design|build|implement)\b[\s,.:;!?-]*)+/i;

export function conversationTitleFromPrompt(prompt: string): string {
  const normalized = prompt.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'New chat';

  const withoutPrefix = normalized.replace(PROMPT_PREFIX, '').trim();
  const subject = (withoutPrefix || normalized)
    .replace(/^(?:a|an|the|my|our|some)\s+/i, '')
    .split(/[?.!;\n]/, 1)[0]
    .trim();
  const words = subject.split(/\s+/).slice(0, 7);
  const title = words.join(' ').slice(0, 56).replace(/[\s,.:;!?-]+$/, '');

  if (!title) return 'New chat';
  return title.charAt(0).toUpperCase() + title.slice(1);
}
