'use client';

import { type Message } from 'ai/react';
import { set } from 'husky';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { use, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { auth } from '@/auth';
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
const API_URL = 'https://sotopia.xuhuiz.com';


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
    const [sessionId, setSessionId] = useState<string>(id || '');
    const [hiddenOrNot, setHiddenOrNot] = useState<string>('hidden');  
    const [trackVisibility, setTrackVisibility] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const fetchSessionId = async () => {
        const session = await getSession();

        while (1) {
            if (session?.user?.email === undefined || session?.user?.email === null) {
                redirect('/sign-in');
            }
            setUserId(session?.user?.email);
            const response: Response = await fetch(
                `${ API_URL}/enter_waiting_room/${ session?.user?.email}`,
                { method: 'GET', cache: 'no-store' },
            );
            const id: string = await response.json();
            await new Promise(f => setTimeout(f, 500));
            if (id !== '') {
                return id;
            }   
        }
    };

    useEffect(() => {
        if (sessionId !== '') {
            const _connectSession = async () => {
                console.log('connecting to session ' + sessionId);
                const session = await getSession();
                if (session?.user?.email === undefined || session?.user?.email === null) {
                    redirect('/sign-in');
                }
                setHiddenOrNot('block'); // optimistic rendering
                try {
                    await connectSession(sessionId, session?.user?.email);
                } catch (err) {
                    console.error(err);
                    toast.error('Failed to connect to session');
                    setHiddenOrNot('hidden');
                }
                console.log('connected to session ' + sessionId);
            };
            _connectSession().catch(console.error);
        }
    }, [sessionId]);

    const { messages, append, reload, stop, isLoading, input, setInput } =
        useChat({
            initialMessages,
            id: sessionId,
        });

    useEffect(function mount() {
        const turnOffTrackVisibility = () => {
            if(window.innerHeight + window.scrollY <=
                document.body.offsetHeight - 10){
                setTrackVisibility(false);
            }
        };
        window.addEventListener('scroll', turnOffTrackVisibility, { passive: true });
    
        return function unMount() {
          window.removeEventListener('scroll', turnOffTrackVisibility);
        };
      });

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
                        <DialogTitle>Click Enter Session to Start</DialogTitle>
                        <DialogDescription>
                            Please check with your experimenter if you have not been matched in 2 minutes after you click the button.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="items-center">
                        <Button 
                            onClick={async () => {
                                try {
                                    // Set loading to true when starting the fetch
                                    setLoading(true);
                        
                                    const _sessionId = await fetchSessionId();
                                    console.log(_sessionId);
                        
                                    if (typeof _sessionId === 'string') {
                                        setSessionId(_sessionId);
                                        setSessionIdDialog(false);
                                    } else {
                                        throw new Error('Session ID is not a string');
                                    }
                                } catch (err) {
                                    console.error(err);
                                    toast.error('Failed to enter session');
                                } finally {
                                    // Set loading to false when the fetch is complete (whether it succeeded or failed)
                                    setLoading(false);
                                }
                            }}
                            // Disable the button when loading is true
                            disabled={loading}
                        >
                            {/* <div className="flex h-5 w-5 mr-3 animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500">
                            <div className="h-3 w-3 rounded-full bg-white"></div>
                            </div> */}
                            {loading ? 'Matching...' : 'Enter Session'}
                        </Button>
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
