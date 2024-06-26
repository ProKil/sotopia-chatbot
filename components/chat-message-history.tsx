// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx
import { error } from 'console';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { MemoizedReactMarkdown } from '@/components/markdown';
import { CodeBlock } from '@/components/ui/codeblock';
import { IconOpenAI, IconUser } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

import { AgentAvator } from './character';
import { ChatMessageActions } from './chat-message-actions-history';

export declare type Message = {
    id: string;
    createdAt?: Date;
    content: string;
    role: 'system' | 'user' | 'assistant' | 'character';
    additional_info?: string; // a footnote for the message
};
export declare type CreateMessage = {
    id?: string;
    createdAt?: Date;
    content: string;
    role: 'system' | 'user' | 'assistant' | 'character';
};

export interface ChatMessageProps {
    message: Message;
}

export function getInitials(fullName: string) {
    // Check if the input is a non-empty string
    if (typeof fullName === 'string' && fullName.trim() !== '') {
        // Split the full name into first and last names
        const names = fullName.trim().split(' ');

        if (names.length >= 2) {
            // Get the first character of the first name and the last character of the last name
            const firstInitial = names[0][0].toUpperCase();
            const lastInitial = names[names.length - 1][0].toUpperCase();

            // Return both initials together
            return `${firstInitial}${lastInitial}`;
        }
    }

    // Handle invalid input or single names
    return null; // You can also return an empty string or another value as needed.
}

export function getMessageClass(messageType: string | undefined) {
    if (messageType?.startsWith('[action]')) {
      return 'rounded-md shadow-sm bg-blue-200 dark:bg-blue-800';
    } else if (messageType?.startsWith('[non-verbal communication]')) {
      return 'rounded-md shadow-sm bg-green-200 dark:bg-green-800';
    } else if (messageType?.startsWith('[leave]')) {
      return 'rounded-md shadow-sm bg-yellow-200 dark:bg-yellow-800';
    } else {
      return '';
    }
  }

function showAdditionalInfo(message: Message) {
    if (message.additional_info) {
        return (
            <div className="text-left text-xs text-gray-400">
                {message.additional_info}
            </div>
        );
    } return '';
}

export function parseMessage(message: string): string {
    try {
        console.log(message);
        const parsed = JSON.parse(message);
        if (parsed.action_type === 'speak') {
            return parsed.argument;
        }
        else {
            return '['+parsed.action_type+'] '+parsed.argument;; 
        }
    }
    catch (e) {
        const content = message.replace(/.*said:/, 'said:').replace(/.*?\[non-verbal communication\]/, '[non-verbal communication]').replace(/.*?\[action\]/, '[action]').trim();
        if (content.startsWith('said: "')) {
            return content.substring(7, content.length - 1);
        }
        else {
            return content;
        }
    }
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
    const msgStyles = [
        'ml-4 flex-1 space-y-2 overflow-hidden px-1',
        getMessageClass(message.content),
    ];
    return (
        <>
        <div
            className={cn('group relative mb-4 flex items-start md:-ml-12')}
            {...props}
        >
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                    message.role === 'user'
                        ? 'bg-background'
                        : 'bg-slate-300 dark:bg-gray-800',
                )}
            >
                {message.role === 'user' ? (
                    <IconUser />
                ) : message.role === 'character' ? (
                    <><AgentAvator agentName={message.id} /> </>
                ) : (
                    <IconOpenAI />
                )}
            </div>
            <div className={msgStyles.join(' ')}>
                <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            return <p className="mb-2 last:mb-0">{children}</p>;
                        },
                        code({ node, inline, className, children, ...props }) {
                            if (children.length) {
                                if (children[0] == '▍') {
                                    return (
                                        <span className="mt-1 animate-pulse cursor-default">
                                            ▍
                                        </span>
                                    );
                                }

                                children[0] = (children[0] as string).replace(
                                    '`▍`',
                                    '▍',
                                );
                            }

                            const match = /language-(\w+)/.exec(
                                className || '',
                            );

                            if (inline) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }

                            return (
                                <CodeBlock
                                    key={Math.random()}
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            );
                        },
                    }}
                >
                    {message.content}
                </MemoizedReactMarkdown>
                {showAdditionalInfo(message)}
                <ChatMessageActions message={message} />
            </div>
        </div></>
    );
}
