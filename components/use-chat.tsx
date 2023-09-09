import { UseChatOptions, type UseChatHelpers } from 'ai/react'
import { type Message, CreateMessage } from 'ai/react'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import useSWR, { KeyedMutator } from 'swr'
import { updateChat } from '@/app/actions'
import { on } from 'events'

export type RequestOptions = {
  headers?: Record<string, string> | Headers
  body?: object
}

export type ChatRequest = {
  messages: Message[]
  options?: RequestOptions
}

export type ChatRequestOptions = {
  options?: RequestOptions
}

export interface SotopiaChatProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function useChat({
  api = '/api/chat',
  id,
  initialMessages = [],
  onResponse,
  body
}: UseChatOptions = {}): SotopiaChatProps {
  // Generate a unique id for the chat if not provided.
  const hookId = useId()
  const chatId = id || hookId

  // Store the chat state in SWR, using the chatId as the key to share states.
  const { data: messages, mutate } = useSWR<Message[]>([api, chatId], null, {
    fallbackData: initialMessages
  })

  // We store loading state in another hook to sync loading states across hook invocations
  const { data: isLoading = false, mutate: mutateLoading } = useSWR<boolean>(
    [chatId, 'loading'],
    null
  )

  const { data: streamData, mutate: mutateStreamData } = useSWR<any>(
    [chatId, 'streamData'],
    null
  )

  // Keep the latest messages in a ref.
  const messagesRef = useRef<Message[]>(messages || [])
  useEffect(() => {
    messagesRef.current = messages || []
  }, [messages])

  // Abort controller to cancel the current API call.
  const abortControllerRef = useRef<AbortController | null>(null)

  // Actual mutation hook to send messages to the API endpoint and update the
  // chat state.
  const [error, setError] = useState<undefined | Error>()

  const triggerRequest = useCallback(
    async (chatRequest: ChatRequest) => {
      try {
        mutateLoading(true)
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        const command =
          chatRequest.messages[chatRequest.messages?.length - 1].content

        const previousMessages = messagesRef.current;
        mutate(chatRequest.messages, false)
        const response = await fetch(
          'https://tiger.lti.cs.cmu.edu:8002/' + command,
          { method: 'GET', cache: 'no-store' }
        )
          .then(response => {
            if (response.status === 200) {
              return response.json()
            } else {
              throw new Error(
                'Something went wrong on API server!' +
                  response.status +
                  response.statusText
              )
            }
          })
          .catch(err => {
            console.log('caught it!', err)
            mutate(previousMessages, false);
            throw err;
          })

        const response_str = JSON.stringify(response)

        const err = await updateChat({
          id: chatId,
          messages: chatRequest.messages,
          response_string: response_str
        })

        if (err) {
          throw err
        }

        abortControllerRef.current = null
        const responseMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: response_str
        }

        mutate([...messagesRef.current, responseMessage], false)
        return chatRequest.messages[chatRequest.messages?.length - 1].content
      } catch (err) {
        // Ignore abort errors as they are expected.
        if ((err as any).name === 'AbortError') {
          abortControllerRef.current = null
          return null
        }

        console.log(err)

        setError(err as Error)
      } finally {
        mutateLoading(false)
      }
    },
    [mutate, chatId, mutateLoading, setError, messagesRef.current]
  )

  const append = useCallback(
    async (
      message: Message | CreateMessage,
      { options }: ChatRequestOptions = {}
    ) => {
      if (!message.id) {
        message.id = nanoid()
      }

      const chatRequest: ChatRequest = {
        messages: messagesRef.current.concat(message as Message),
        options
      }

      return triggerRequest(chatRequest)
    },
    [triggerRequest]
  )

  const reload = useCallback(
    // dummy reload
    async () => {
      return ''
    },
    []
  )

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Input state and handlers.
  const [input, setInput] = useState('')

  return {
    messages: messages || [],
    append,
    reload,
    stop,
    input,
    setInput,
    isLoading
  }
}
