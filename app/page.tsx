import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()

  return redirect(`/chat/${id}`);

  return <Chat id={id} />
}
