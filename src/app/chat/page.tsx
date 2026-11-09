import type { Metadata } from 'next';
import { ChatLayout } from '@/components/chat/chat-layout';

export const metadata: Metadata = {
  title: 'Chat · Lexiva Intelligence Space',
  description: 'A multi-model chat workspace prototype. No AI provider is connected yet.',
};

export default function ChatPage() {
  return <ChatLayout />;
}