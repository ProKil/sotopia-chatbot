import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { cn } from '@/lib/utils'
import { ChatProps } from '@/components/chat'
import { EmptyScreen } from '@/components/empty-screen'
import { Message } from '@/components/chat-message-history'
import { ChatList } from '@/components/chat-list-history'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  redirect(process.env.SOTOPIA_SERVER_URL + 'get_episode/' + params.id)
}
