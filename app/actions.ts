'use server';

import { kv } from '@vercel/kv';
import { Message } from 'ai';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { type Chat } from '@/lib/types';

export async function getChats(userId?: string | null) {
    if (!userId) {
        return [];
    }

    try {
        const pipeline = kv.pipeline();
        const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
            rev: true,
        });

        chats.forEach((chat) => pipeline.hgetall(chat));

        const results = await pipeline.exec();

        return results as Chat[];
    } catch (error) {
        return [];
    }
}

export async function getChat(id: string, userId: string) {
    const chat = await kv.hgetall<Chat>(`chat:${id}`);

    if (!chat || (userId && chat.userId !== userId)) {
        return null;
    }

    return chat;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
    const session = await auth();

    if (!session) {
        return {
            error: 'Unauthorized',
        };
    }

    const uid = await kv.hget<string>(`chat:${id}`, 'userId');

    if (uid !== session?.user?.id) {
        return {
            error: 'Unauthorized',
        };
    }

    await kv.del(`chat:${id}`);
    await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`);

    revalidatePath('/');
    return revalidatePath(path);
}

export async function clearChats() {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: 'Unauthorized',
        };
    }

    const chats: string[] = await kv.zrange(
        `user:chat:${session.user.id}`,
        0,
        -1,
    );
    if (!chats.length) {
        return redirect('/');
    }
    const pipeline = kv.pipeline();

    chats.forEach((chat) => {
        pipeline.del(chat);
        pipeline.zrem(`user:chat:${session.user.id}`, chat);
    });

    await pipeline.exec();

    revalidatePath('/');
    return redirect('/');
}

export async function getSharedChat(id: string) {
    const chat = await kv.hgetall<Chat>(`chat:${id}`);

    if (!chat || !chat.sharePath) {
        return null;
    }

    return chat;
}

export async function shareChat(chat: Chat) {
    const session = await auth();

    if (!session?.user?.id || session.user.id !== chat.userId) {
        return {
            error: 'Unauthorized',
        };
    }

    const payload = {
        ...chat,
        sharePath: `/share/${chat.id}`,
    };

    await kv.hmset(`chat:${chat.id}`, payload);

    return payload;
}

declare type UpdateChatOptions = {
    id: string;
    messages: Message[];
    response_string: string;
};

export async function updateChat({
    id,
    messages,
    response_string,
}: UpdateChatOptions) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: 'Unauthorized',
        };
    }
    const userId = session.user.id;
    const createdAt = Date.now();
    const payload = {
        id,
        title: messages[0].content.substring(0, 100),
        userId,
        createdAt,
        path: `/chat/${id}`,
        messages: [
            ...messages,
            {
                content: response_string,
                role: 'assistant',
            },
        ],
    };
    await kv.hmset(`chat:${id}`, payload);
    await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`,
    });
    return {};
}
