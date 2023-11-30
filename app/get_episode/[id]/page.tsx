import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getChat } from '@/app/actions';
import { auth } from '@/auth';
import { ChatProps } from '@/components/chat';
import { ChatList } from '@/components/chat-list-history';
import { Message } from '@/components/chat-message-history';
import { EmptyScreen } from '@/components/empty-screen';
import { cn } from '@/lib/utils';

export const runtime = 'edge';
export const preferredRegion = 'home';

export interface ChatPageProps {
    params: {
        id: string;
    };
}

export default async function ChatPage({ params }: ChatPageProps) {
    redirect(`${process.env.SOTOPIA_SERVER_URL}/get_episode/${  params.id}`);
}
