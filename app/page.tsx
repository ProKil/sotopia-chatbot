import { redirect } from 'next/navigation';

import { Chat } from '@/components/chat';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge';

export default function IndexPage() {
    const id = nanoid();

    // return redirect(`/chat/${id}`);

    return <Chat/>;
}
