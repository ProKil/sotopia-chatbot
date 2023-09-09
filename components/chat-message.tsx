// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'

export interface ChatMessageProps {
  message: Message
}

export function getInitials(fullName: string) {
  // Check if the input is a non-empty string
  if (typeof fullName === 'string' && fullName.trim() !== '') {
    // Split the full name into first and last names
    const names = fullName.trim().split(' ')

    if (names.length >= 2) {
      // Get the first character of the first name and the last character of the last name
      const firstInitial = names[0][0].toUpperCase()
      const lastInitial =
        names[names.length - 1][
          names[names.length - 1].length - 1
        ].toUpperCase()

      // Return both initials together
      return `${firstInitial}${lastInitial}`
    }
  }

  // Handle invalid input or single names
  return null // You can also return an empty string or another value as needed.
}

export function getMessageClass(messageType: string | undefined) {
  switch (messageType) {
    case 'action':
      return 'bg-blue-200'
    case 'non-verbal communication':
      return 'bg-green-200'
    case 'leave':
      return 'rounded-md shadow-sm bg-yellow-200'
    default:
      return ''
  }
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const msgStyles = [
    'ml-4 flex-1 space-y-2 overflow-hidden px-1',
    getMessageClass(message.id)
  ]
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className={msgStyles.join(' ')}>
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
