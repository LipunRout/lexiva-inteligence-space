'use client';

import { useEffect, useRef, useState } from 'react';
import type { Attachment, Conversation, Message } from './types';
import { DEFAULT_MODEL, titleFrom } from './data';
import { useModels } from './use-models';
import type { PickedFile } from './attachments';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

interface ApiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: string | null;
  created_at: string;
  attachments: Attachment[] | null;
}
interface ApiConversation {
  id: string;
  title: string;
  updated_at: string;
  messages: ApiMessage[];
}

function fromApi(c: ApiConversation): Conversation {
  const messages: Message[] = c.messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      modelId: m.model ?? undefined,
      createdAt: Date.parse(m.created_at),
      attachments: m.attachments?.length ? m.attachments : undefined,
    }));
  const lastModel = [...messages].reverse().find((m) => m.modelId)?.modelId;
  return {
    id: c.id,
    title: c.title,
    modelId: lastModel ?? DEFAULT_MODEL,
    updatedAt: Date.parse(c.updated_at),
    messages,
  };
}

export function useChatStore() {
  const { models } = useModels();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftModelId, setDraftModelId] = useState(DEFAULT_MODEL);
  const [pending, setPending] = useState<string | null>(null);

  const busy = useRef(false);
  const streamingId = useRef<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  // Load saved conversations
  useEffect(() => {
    fetch('/api/conversations')
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = '/login?next=/chat';
          return;
        }
        if (!r.ok) return;
        const data: { conversations: ApiConversation[] } = await r.json();
        const server = data.conversations.map(fromApi);
        const ids = new Set(server.map((c) => c.id));
        setConversations((cur) => [...cur.filter((c) => !ids.has(c.id)), ...server]);
      })
      .catch(() => {});
  }, []);

  // Pick the first available model by default
  useEffect(() => {
    if (models.length && !models.some((m) => m.id === draftModelId)) {
      setDraftModelId(models[0].id);
    }
  }, [models, draftModelId]);

  // Stop any running stream on unmount
  useEffect(() => () => abort.current?.abort(), []);

  async function run(
    convoId: string,
    modelId: string,
    body: { content?: string; regenerate?: boolean; attachments?: PickedFile[] }
  ) {
    busy.current = true;
    streamingId.current = convoId;
    setPending(convoId);

    const ctrl = new AbortController();
    abort.current = ctrl;
    const assistantId = uid();
    let started = false;

    const patch = (fn: (m: Message[]) => Message[]) =>
      setConversations((p) =>
        p.map((c) => (c.id === convoId ? { ...c, updatedAt: Date.now(), messages: fn(c.messages) } : c))
      );

    const fail = (message: string) =>
      patch((ms) =>
        started
          ? ms.map((m) => (m.id === assistantId ? { ...m, content: m.content + `\n\n_Stopped: ${message}_` } : m))
          : [
              ...ms,
              {
                id: assistantId,
                role: 'assistant',
                kind: 'notice',
                modelId,
                content: `**Couldn't get a reply.**\n\n${message}`,
                createdAt: Date.now(),
              },
            ]
      );

    try {
      if (!modelId) {
        fail('No model is available. Add a provider API key to .env.local and restart the server.');
        return;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({ conversationId: convoId, model: modelId, ...body }),
      });

      if (res.status === 401) {
        window.location.href = '/login?next=/chat';
        return;
      }
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        fail(err?.error ?? `Request failed (${res.status})`);
        return;
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });

        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const evt = JSON.parse(line.slice(5));

          if (evt.type === 'delta') {
            if (!started) {
              started = true;
              patch((ms) => [
                ...ms,
                { id: assistantId, role: 'assistant', modelId, content: evt.text, createdAt: Date.now() },
              ]);
            } else {
              patch((ms) => ms.map((m) => (m.id === assistantId ? { ...m, content: m.content + evt.text } : m)));
            }
          } else if (evt.type === 'error') {
            fail(evt.message);
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') fail('Network error. Check your connection and try again.');
    } finally {
      busy.current = false;
      streamingId.current = null;
      if (abort.current === ctrl) abort.current = null;
      setPending(null);
    }
  }

  function send(text: string, files: PickedFile[] = []) {
    const t = text.trim() || (files.length ? 'Please review the attached file.' : '');
    if (!t || pending || busy.current) return;

    const now = Date.now();
    const userMsg: Message = {
      id: uid(),
      role: 'user',
      content: t,
      createdAt: now,
      attachments: files.length ? files.map(({ name, size }) => ({ name, size })) : undefined,
    };

    let convoId: string;
    let modelId = draftModelId;

    if (activeId) {
      const id = activeId;
      convoId = id;
      modelId = conversations.find((c) => c.id === id)?.modelId || draftModelId;
      setConversations((p) =>
        p.map((c) => (c.id === id ? { ...c, updatedAt: now, messages: [...c.messages, userMsg] } : c))
      );
    } else {
      const id = crypto.randomUUID();
      convoId = id;
      const created: Conversation = { id, title: titleFrom(t), modelId, updatedAt: now, messages: [userMsg] };
      setConversations((p) => [created, ...p]);
      setActiveId(id);
    }

    void run(convoId, modelId, { content: t, attachments: files.length ? files : undefined });
  }

  function regenerate() {
    if (!active || pending || busy.current) return;
    const last = active.messages[active.messages.length - 1];
    if (!last || last.role !== 'assistant' || last.kind === 'sample') return;

    const id = active.id;
    setConversations((p) => p.map((c) => (c.id === id ? { ...c, messages: c.messages.slice(0, -1) } : c)));
    void run(id, active.modelId || draftModelId, { regenerate: true });
  }

  function setModel(modelId: string) {
    if (active) {
      setConversations((p) => p.map((c) => (c.id === active.id ? { ...c, modelId } : c)));
    } else {
      setDraftModelId(modelId);
    }
  }

  function rename(id: string, title: string) {
    const t = title.trim();
    if (!t) return;
    setConversations((p) => p.map((c) => (c.id === id ? { ...c, title: t } : c)));
    fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t }),
    }).catch(() => {});
  }

  function remove(id: string) {
    setConversations((p) => p.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    if (busy.current && streamingId.current === id) abort.current?.abort();
    fetch(`/api/conversations/${id}`, { method: 'DELETE' }).catch(() => {});
  }

  // Feedback and single-message delete are still local to this page session
  function setFeedback(messageId: string, value: 'up' | 'down') {
    setConversations((p) =>
      p.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, feedback: m.feedback === value ? undefined : value } : m
        ),
      }))
    );
  }

  function removeMessage(messageId: string) {
    setConversations((p) =>
      p.map((c) => ({ ...c, messages: c.messages.filter((m) => m.id !== messageId) }))
    );
  }

  return {
    conversations,
    active,
    activeId,
    draftModelId,
    pending,
    models,
    select: setActiveId,
    newChat: () => setActiveId(null),
    send,
    regenerate,
    setModel,
    rename,
    remove,
    setFeedback,
    removeMessage,
  };
}