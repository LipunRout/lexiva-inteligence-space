'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore } from './use-chat-store';
import { ChatSidebar } from './chat-sidebar';
import { ChatHeader } from './chat-header';
import { ConversationView } from './conversation-view';
import { EmptyChatState } from './empty-chat-state';
import { MessageComposer } from './message-composer';
import { getModel } from './data';
import { useUser } from './use-user';

export function ChatLayout() {
  const chat = useChatStore();
  const { user, loading: userLoading } = useUser();
  const [ready, setReady] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [drawer, setDrawer] = useState(false);

  // Sample timestamps depend on "now", so render only after mounting (avoids hydration mismatch)
  useEffect(() => setReady(true), []);

  if (!ready) {
    return <div aria-busy="true" className="h-dvh w-full bg-[#121215]" />;
  }

  const convo = chat.active;
  const modelId = convo ? convo.modelId : chat.draftModelId;
  const model = getModel(modelId);
  const pending = !!convo && chat.pending === convo.id;

  const composer = (
    <MessageComposer
      modelId={modelId}
      onModelChange={chat.setModel}
      onSend={chat.send}
      disabled={!!chat.pending}
    />
  );

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-[#121215] text-[#f4f4f6]">
      <ChatSidebar
        conversations={chat.conversations}
        activeId={chat.activeId}
        open={desktopOpen}
        drawerOpen={drawer}
        onCloseDrawer={() => setDrawer(false)}
        onSelect={chat.select}
        onNew={chat.newChat}
        onRename={chat.rename}
        onDelete={chat.remove}
        user={user}
        userLoading={userLoading}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={convo ? convo.title : 'New chat'}
          model={model}
          sidebarOpen={desktopOpen}
          onToggleSidebar={() => setDesktopOpen((o) => !o)}
          onOpenDrawer={() => setDrawer(true)}
          onNewChat={chat.newChat}
        />

        {convo ? (
          <>
            <main className="min-h-0 flex-1">
              <ConversationView
                conversation={convo}
                pending={pending}
                onRegenerate={chat.regenerate}
                onFeedback={chat.setFeedback}
                onDeleteMessage={chat.removeMessage}
              />
            </main>
            <div className="shrink-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
              <div className="mx-auto max-w-3xl">{composer}</div>
            </div>
          </>
        ) : (
          <main className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <EmptyChatState onPick={chat.send}>{composer}</EmptyChatState>
          </main>
        )}
      </div>
    </div>
  );
}