'use client';

import { useEffect, useRef, useState } from 'react';
import type { Conversation, Message } from './types';
import { DEFAULT_MODEL, noticeFor, seedConversations, titleFrom } from './data';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function useChatStore() {
  const [conversations, setConversations] = useState<Conversation[]>(() => seedConversations());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftModelId, setDraftModelId] = useState(DEFAULT_MODEL);
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const active = conversations.find((c) => c.id === activeId) ?? null;

  function reply(convoId: string, modelId: string) {
    setPending(convoId);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const msg: Message = {
        id: uid(),
        role: 'assistant',
        kind: 'notice',
        modelId,
        content: noticeFor(modelId),
        createdAt: Date.now(),
      };
      setConversations((p) =>
        p.map((c) => (c.id === convoId ? { ...c, updatedAt: Date.now(), messages: [...c.messages, msg] } : c))
      );
      setPending(null);
    }, 650);
  }

  function send(text: string) {
    const t = text.trim();
    if (!t || pending) return;
    const now = Date.now();
    const userMsg: Message = { id: uid(), role: 'user', content: t, createdAt: now };
    let convoId = activeId;
    let modelId = draftModelId;

    if (convoId) {
      modelId = conversations.find((c) => c.id === convoId)?.modelId ?? draftModelId;
      const id = convoId;
      setConversations((p) =>
        p.map((c) => (c.id === id ? { ...c, updatedAt: now, messages: [...c.messages, userMsg] } : c))
      );
    } else {
      convoId = uid();
      const created: Conversation = { id: convoId, title: titleFrom(t), modelId, updatedAt: now, messages: [userMsg] };
      setConversations((p) => [created, ...p]);
      setActiveId(convoId);
    }
    reply(convoId, modelId);
  }

  function regenerate() {
    if (!active || pending) return;
    const last = active.messages[active.messages.length - 1];
    if (!last || last.role !== 'assistant' || last.kind !== 'notice') return;
    setConversations((p) =>
      p.map((c) => (c.id === active.id ? { ...c, messages: c.messages.slice(0, -1) } : c))
    );
    reply(active.id, active.modelId);
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
  }

  function remove(id: string) {
    setConversations((p) => p.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    if (pending === id) {
      if (timer.current) window.clearTimeout(timer.current);
      setPending(null);
    }
  }

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