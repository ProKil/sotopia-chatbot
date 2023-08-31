import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Message } from 'ai'
import { cn } from '@/lib/utils'
import { ChatProps } from '@/components/chat'
import { ChatList } from '@/components/chat-list'
import { EmptyScreen } from '@/components/empty-screen'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

// environment: str = Field(index=True)
// agents: list[str] = Field(index=True)
// tag: str | None = Field(index=True)
// models: list[str] | None = Field(index=True)
// messages: list[list[tuple[str, str, str]]]  # Messages arranged by turn
// reasoning: str
// rewards: list[
//     tuple[float, dict[str, float]] | float
// ]  # Rewards arranged by turn
// rewards_prompt: str

function chooseOnlyMessagesToEnvironment(messages: any[][]) {
    return messages.map(
        messages_in_turn => messages_in_turn.filter((message: any) => message[1] === "Environment")
    );
}

function filterDidnothingMessages(messages: any[][]) {
    return messages.map(
        messages_in_turn => messages_in_turn.filter((message: any) => message[2] !== 'did nothing')
    ).flat()
}

function composeMessages(messages: any[][]): Message[] {
    return messages.map(
        (message: any) => {
            const [id, environment, content] = message
            // console.log(message_text)
            const createdAt = "2021-10-10T10:10:10.000Z"
            const role = "user"
            console.log(message)
            return {
                id,
                createdAt: createdAt ? new Date(createdAt) : undefined,
                content,
                role
            };
        })
}

async function getEpisode(episodeId: string) {
    if (process.env.SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined")
    } else {
        console.log(process.env.SOTOPIA_SERVER_URL + "get_episode/" + episodeId)
        const request = new Request(
            process.env.SOTOPIA_SERVER_URL + "get_episode/" + episodeId, {
            method: 'GET',
        })
        const response_json = await fetch(request)
            .then(response  => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Something went wrong on API server!");
                }
            });
        const messages_list_raw = chooseOnlyMessagesToEnvironment(
            response_json["messages"]
        ) 
        const filtered_messages_list = filterDidnothingMessages(messages_list_raw)
        const messages_list = composeMessages(filtered_messages_list)
        

        return messages_list
    }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}


export default async function ChatPage({ params }: ChatPageProps) {
  
//   if (chat?.userId !== session?.user?.id) {
//     notFound()
//   }

//   return <Chat id={chat.id} initialMessages={chat.messages} />
    const messages = await getEpisode(params.id)
    console.log(messages[0])
    return (
        <div className={cn('pb-[200px] pt-4 md:pt-10')}>
          
            <>
              <ChatList messages={messages} />
            </>
        </div>)
}
