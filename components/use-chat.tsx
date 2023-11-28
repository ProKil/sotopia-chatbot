import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { getSession as getAuthSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useCallback, useEffect, useId, useRef, useState } from 'react';
import useSWR, { KeyedMutator } from 'swr';

import { updateChat } from '@/app/actions';

import { getClientLock, getSession, sendMessageToSession } from './chat-api';
import { MessageTransaction, SessionTransaction } from './sotopia-types';

export type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface UseChatOptions {
    api?: string,
    id?: string;
    initialMessages?: Message[];
};

export type RequestOptions = {
    headers?: Record<string, string> | Headers;
    body?: object;
};

export type ChatRequest = {
    messages: Message[];
    options?: RequestOptions;
};

export type ChatRequestOptions = {
    options?: RequestOptions;
};

export interface SotopiaChatProps {
    id?: string;
    append: (message: Message, options?: ChatRequestOptions) => Promise<void>;
    reload: () => Promise<string | null>;
    stop: () => void;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
    isLoading: boolean;
    messages: Message[];
}

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<()=>void>(()=>{});
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
            function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function useChat({
    api = '/api/chat',
    id,
    initialMessages = [],
}: UseChatOptions = {}): SotopiaChatProps {
    // Generate a unique id for the chat if not provided.
    const chatId: string = id || '';

    // Store the chat state in SWR, using the chatId as the key to share states.
    const { data: messages, mutate } = useSWR<Message[]>([api, chatId], null, {
        fallbackData: initialMessages,
    });

    // We store loading state in another hook to sync loading states across hook invocations
    const { data: isLoading = false, mutate: mutateLoading } = useSWR<boolean>(
        [chatId, 'loading'],
        null,
    );

    const { data: streamData, mutate: mutateStreamData } = useSWR<any>(
        [chatId, 'streamData'],
        null,
    );

    // Keep the latest messages in a ref.
    const messagesRef = useRef<Message[]>(messages || []);
    useEffect(() => {
        messagesRef.current = messages || [];
    }, [messages]);

    // Abort controller to cancel the current API call.
    const abortControllerRef = useRef<AbortController | null>(null);

    // Actual mutation hook to send messages to the API endpoint and update the
    // chat state.
    const [error, setError] = useState<undefined | Error>();

    useInterval(
        () => {
            const _getSession = async () => {
                const session = await getSession(chatId);
                const messages = session.map((message) => {
                    return message.sender === 'server' ? {
                            id: chatId,
                            role: 'assistant',
                            content: message.message,
                        } : {
                            id: chatId,
                            role: 'user',
                            content: message.message,
                        };
                    }
                );
                mutate(messages, false);
            };
            _getSession().catch(console.error);
        }, 100
    );

    useInterval(
        () => {
            const _getClientLock = async () => {
                const lock = await getClientLock(chatId);
                if (lock === 'no action') {
                    mutateLoading(true, false);
                } else {
                    mutateLoading(false, false);
                }
            };
            _getClientLock().catch(console.error);
        }, 100
    );

    const triggerRequest = useCallback(
        async (chatRequest: ChatRequest) => {
            try {
                mutateLoading(true);
                const abortController = new AbortController();
                abortControllerRef.current = abortController;

                const command =
                    chatRequest.messages[chatRequest.messages?.length - 1]
                        .content;

                const previousMessages = messagesRef.current;
                mutate(chatRequest.messages, false);

                const session = await getAuthSession();

                if (session?.user?.email === null || session?.user?.email === undefined) {
                    redirect('/api/auth/signin');
                }

                await sendMessageToSession(chatId, session?.user?.email, command).catch(console.error);
            } catch (err) {
                // Ignore abort errors as they are expected.
                if ((err as any).name === 'AbortError') {
                    abortControllerRef.current = null;
                    return;
                }

                console.log(err);

                setError(err as Error);
            } finally {
                mutateLoading(false);
                return;
            }
        },
        [mutate, chatId, mutateLoading, setError],
    );

    const append = useCallback(
        async (
            message: Message,
            { options }: ChatRequestOptions = {},
        ) => {
            console.log(message);
            if (!message.id) {
                message.id = nanoid();
            }

            const chatRequest: ChatRequest = {
                messages: messagesRef.current.concat(message as Message),
                options,
            };

            triggerRequest(chatRequest);
            return;
        },
        [triggerRequest],
    );

    const reload = useCallback(
        // dummy reload
        async () => '',
        [],
    );

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    // Input state and handlers.
    const [input, setInput] = useState('');

    return {
        messages: messages || [],
        append,
        reload,
        stop,
        input,
        setInput,
        isLoading,
    };
}