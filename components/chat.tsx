'use client';

import { type Message } from 'ai/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { EmptyScreen } from '@/components/empty-screen';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { connectSession,useChat  } from '@/components/use-chat';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
// import { useChat } from 'ai/react'
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Input } from './ui/input';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[];
    id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
    const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
        'ai-token',
        null,
    );
    const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
    const [previewTokenInput, setPreviewTokenInput] = useState(
        previewToken ?? '',
    );
    const [sessionIdDialog, setSessionIdDialog] = useState(false);
    const [sessionIdInput, setSessionIdInput] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>(id || '');
    const [hiddenOrNot, setHiddenOrNot] = useState<string>('hidden');  
    const [trackVisibility, setTrackVisibility] = useState<boolean>(false);

    useEffect(() => {
        if (sessionId !== '') {
            const _connectSession = async () => {
                console.log('connecting to session ' + sessionId);
                await connectSession(sessionId, 'client user');
                console.log('connected to session ' + sessionId);
                setHiddenOrNot('block');
            };
            _connectSession().catch(console.error);
        }
    }, [sessionId]);

    const { messages, append, reload, stop, isLoading, input, setInput } =
        useChat({
            initialMessages,
            id: sessionId,
        });

    const turnOffTrackVisibility = () => {
        if(window.innerHeight + window.scrollY <=
            document.body.offsetHeight - 10){
            setTrackVisibility(false);
        }
    };

    window.addEventListener('scroll', turnOffTrackVisibility, { passive: true });

    useEffect(() => {
        if(isLoading) {
            setTrackVisibility(true);
        }
    }, [isLoading]);

    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
                {hiddenOrNot=== 'block' ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={trackVisibility}/>
          </>
        ) : (
          <EmptyScreen setSessionIdDialog={setSessionIdDialog} />
        )}
            </div>
            <div className={hiddenOrNot}>
            <ChatPanel
                id={sessionId}
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
            />
            </div>

            <Dialog
                open={sessionIdDialog}
                onOpenChange={setSessionIdDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter your Session ID</DialogTitle>
                        <DialogDescription>
                            Please check with your experimenter to acquire session ID.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={sessionIdInput}
                        placeholder="Open Session ID"
                        onChange={(e) => setSessionIdInput(e.target.value)}
                    />
                    <DialogFooter className="items-center">
                        <Button
                            onClick={() => {
                                setSessionId(sessionIdInput);
                                setSessionIdDialog(false);
                            }}
                        >Enter Session</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

                

            <Dialog
                open={previewTokenDialog}
                onOpenChange={setPreviewTokenDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter your OpenAI Key</DialogTitle>
                        <DialogDescription>
                            If you have not obtained your OpenAI API key, you
                            can do so by{' '}
                            <a
                                href="https://platform.openai.com/signup/"
                                className="underline"
                            >
                                signing up
                            </a>{' '}
                            on the OpenAI website. This is only necessary for
                            preview environments so that the open source
                            community can test the app. The token will be saved
                            to your browser&apos;s local storage under the name{' '}
                            <code className="font-mono">ai-token</code>.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={previewTokenInput}
                        placeholder="OpenAI API key"
                        onChange={(e) => setPreviewTokenInput(e.target.value)}
                    />
                    <DialogFooter className="items-center">
                        <Button
                            onClick={() => {
                                setPreviewToken(previewTokenInput);
                                setPreviewTokenDialog(false);
                            }}
                        >
                            Save Token
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
