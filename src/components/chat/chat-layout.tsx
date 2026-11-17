'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from './use-chat-store';
import { ChatSidebar } from './chat-sidebar';
import { ChatHeader } from './chat-header';
import { ConversationView } from './conversation-view';
import { EmptyChatState } from './empty-chat-state';
import { MessageComposer } from './message-composer';
import { getModel } from './data';
import { useUser } from './use-user';
import { DEFAULT_SIDEBAR_WIDTH, SidebarResizeHandle } from './sidebar-resize-handle';

export function ChatLayout() {
  const chat = useChatStore();
  const { user, loading: userLoading } = useUser();
  const [ready, setReady] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [resizingSidebar, setResizingSidebar] = useState(false);
  const requestedConversationId = useRef<string | null>(null);

  // Sample timestamps depend on "now", so render only after mounting (avoids hydration mismatch)
  useEffect(() => setReady(true), []);

  useEffect(() => {
    requestedConversationId.current = new URLSearchParams(window.location.search).get('conversation');
  }, []);

  useEffect(() => {
    const requestedId = requestedConversationId.current;
    if (!requestedId || !chat.conversations.some((conversation) => conversation.id === requestedId)) return;
    chat.select(requestedId);
    requestedConversationId.current = null;
  }, [chat.conversations]);

  if (!ready) {
    return <div aria-busy="true" className="h-[calc(100dvh-env(safe-area-inset-top))] w-full bg-[#121215]" />;
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
    <div className="relative flex h-[calc(100dvh-env(safe-area-inset-top))] w-full overflow-hidden bg-[#121215] text-[#f4f4f6]">
      <ChatSidebar
        conversations={chat.conversations}
        activeId={chat.activeId}
        open={desktopOpen}
        sidebarWidth={sidebarWidth}
        resizing={resizingSidebar}
        currentPage="chat"
        drawerOpen={drawer}
        onCloseDrawer={() => setDrawer(false)}
        onSelect={chat.select}
        onNew={chat.newChat}
        onRename={chat.rename}
        onDelete={chat.remove}
        user={user}
        userLoading={userLoading}
      />
      {desktopOpen && (
        <SidebarResizeHandle
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
          onResizingChange={setResizingSidebar}
        />
      )}

      <div id="workspace-panel" className="relative flex min-w-0 flex-1 flex-col">
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