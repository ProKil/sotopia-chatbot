import { type Message } from 'ai';
import { type UseChatHelpers } from 'ai/react';
import error from 'next/error';
import { Dispatch, SetStateAction,useEffect, useState, useRef  } from 'react';

import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { FooterText } from '@/components/footer';
import { PromptForm } from '@/components/prompt-form';
import { Button } from '@/components/ui/button';
import { IconCheck, IconRefresh, IconStop } from '@/components/ui/icons';

import { ActionSelection } from './action-selection';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ChatRequestOptions } from './use-chat';


export interface ChatPanelProps {
    id?: string;
    isLoading: boolean;
    stop: () => void;
    append: (message: Message, options?: ChatRequestOptions) => Promise<void>;
    reload: () => Promise<string | null>;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
    messages: Message[];
}


export function ChatPanel({
    id,
    isLoading,
    stop,
    append,
    reload,
    input,
    setInput,
    messages,
}: ChatPanelProps) {
    const [actionType, setActionType] = useState('speak');
    const [noneOrLeaveDiaglog, setNoneOrLeaveDialog] = useState(false);
    const [noneOrLeave, setNoneOrLeave] = useState<'none' | 'leave'>('none');
    const appendNoneOrLeaveDirectly =  (actionTypeToSet: string) => {
            if(actionTypeToSet == 'none' || actionTypeToSet == 'leave'){
                setNoneOrLeave(actionTypeToSet);
                setNoneOrLeaveDialog(true);
            } else {
                setActionType(actionTypeToSet);
            }
        };

    const [timeLeft, setTimeLeft] = useState(60);
    let prevIsLoading = useRef<boolean | null>(null); // Using useRef to remember the previous value

    useEffect(() => {
        // Check if the status of isLoading has changed
        if (prevIsLoading.current !== null && prevIsLoading.current !== isLoading) {
            console.log(`isLoading has changed from ${prevIsLoading.current} to ${isLoading}`);
            // Perform any additional actions here
        }

        // Update prevIsLoading with the current value of isLoading
        prevIsLoading.current = isLoading;

        let timer: NodeJS.Timeout;  // declare timer variable

        if (isLoading) { // check the condition you want to start the timer
            timer = setInterval(() => {
                setTimeLeft(prevTimeLeft => prevTimeLeft > 0 ? prevTimeLeft - 1 : 0);
            }, 1000);
        } else {
            setTimeLeft(60); // reset timer when it's not loading
        }

        return () => {
            if (timer) clearInterval(timer); // cleanup timer when component unmounts or condition changes
        };
    }, [isLoading]); // Only isLoading in dependencies to keep it simple



    return (
        <><Dialog
            open={noneOrLeaveDiaglog}
            onOpenChange={setNoneOrLeaveDialog}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{noneOrLeave==='none' ? 'Are you sure not to do anything?' : 'Are you sure to leave?'}</DialogTitle>
                    <DialogDescription>
                        {noneOrLeave==='none' ? 'Press the button if you choose to not do anything this turn.' : 'Press the button if you choose to leave this conversation.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="items-center">
                    <Button
                        onClick={() => {
                            if(!id) throw new Error('id is not defined');
                            append({
                                id,
                                content: `{"action_type": "${ noneOrLeave}", "argument": ""}`,
                                role: 'user',
                            });
                            setInput('');
                            setNoneOrLeaveDialog(false);
                        }}
                    >Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog><div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
                <ButtonScrollToBottom />
                <div className="flex h-10 items-center justify-center">
                    {isLoading ? (
                        <Button
                            variant="outline"
                            className="bg-background"
                        >
                            <IconStop className="mr-2" />
                            Wait for your turn.
                        </Button>
                    ) : (
                        messages?.length > 0 && (
                            <Button
                                variant="outline"
                                className="invisible bg-background"
                            >
                                <IconCheck className="mr-2" />
                                Your turn.
                            </Button>
                        )
                    )}
                </div>

                <div className="mx-auto sm:max-w-2xl sm:px-4">
                    <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
                        <ActionSelection setActionType={appendNoneOrLeaveDirectly} actionType={actionType} />
                        <PromptForm
                            onSubmit={async (value) => {
                                if (id) {
                                    await append({
                                        id,
                                        content: `{"action_type": "${actionType}", "argument": "${value}"}`,
                                        role: 'user',
                                    });
                                }
                            } }
                            input={input}
                            setInput={setInput}
                            isLoading={isLoading}
                            timeLeft={timeLeft} />
                    </div>
                </div>
            </div></>
    );
}
