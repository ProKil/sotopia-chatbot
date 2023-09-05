import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { cn } from '@/lib/utils'
import { ChatProps } from '@/components/chat'
import { EmptyScreen } from '@/components/empty-screen'
import { Message } from '@/components/chat-message-history'
import { ChatList } from '@/components/chat-list-history'
import { Separator } from '@radix-ui/react-dropdown-menu'

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

function parseMessage(message: string): [string, string] {
    const content = message;

    if (content.startsWith('said: "')) {
        return [content.substring(7, content.length - 1), 'speak'];
    } else if (content.startsWith('[non-verbal communication]')) {
        return [content.substring(26), 'non-verbal communication'];
    } else if (content.startsWith('[action]')) {
        return [content.substring(8), 'action'];
    } else if (content === 'left the conversation') {
        return [content, 'leave'];
    }

    return [content, 'unknown'];
}

function parseMessages(messages: any[][]) {
    return messages.map(
        (message: any) => {
            const [sender, receiver, content] = message
            return [sender, receiver].concat(parseMessage(content))
        }
    )
}

function composeMessages(messages: any[][], name2model: { [name: string]: string }): Message[] {
    return messages.map(
        (message: any) => {
            const [id, environment, content, type] = message
            const role = "character"
            return {
                id,
                content,
                role,
                type,
                additional_info: name2model[id]
            };
        })
}

async function getEpisode(episodeId: string) {
    if (process.env.SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined")
    } else {
        console.log(process.env.SOTOPIA_SERVER_URL + "get_episode/" + episodeId)
        const response_json = await fetch(
            process.env.SOTOPIA_SERVER_URL + "get_episode/" + episodeId,
            {method: 'GET'}
        ).then((response)  => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Something went wrong on API server!" + response.status + response.statusText);
                }
            })
            .catch(err => {
                console.log('caught it!',err);
             });
        const messages_list_raw = chooseOnlyMessagesToEnvironment(
            response_json["messages"]
        ) 
        var name2model: { [name: string]: string } = {}
        messages_list_raw[0].slice(0, 2).forEach((message, index) => {
            name2model[message[0]] = response_json["models"][index] // not handling #models < 1
        })
        const filtered_messages_list = filterDidnothingMessages(messages_list_raw)
        const parsed_messages_list = parseMessages(filtered_messages_list)
        const messages_list = composeMessages(parsed_messages_list, name2model)
        return [messages_list, response_json["messages"], response_json["rewards"], response_json["reasoning"]]
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
    const [messages, messages_context, rewards, reasoning] = await getEpisode(params.id)
    console.log(messages_context[0])
    return (
        <div className={cn('pb-[200px] pt-4 md:pt-10')}>
          
            <>
              <ChatList messages={messages} />
            </>

            <div className="mt-20 flex min-h-screen flex-col items-center justify-center">
                <div className="mb-4 w-2/5 whitespace-pre-line bg-gray-200 p-4 shadow-md sm:w-3/5">
                    {messages_context[0][0].slice(1).join("\n")}
                </div>

                <div className="my-4 border-t border-gray-400"></div>

                <div className="w-2/5 whitespace-pre-line bg-gray-200 p-4 shadow-md sm:w-3/5">
                {messages_context[0][1].slice(1).join("\n")}
                </div>

                <div className="my-4 border-t border-gray-400"></div>

                <div className="w-2/5 whitespace-pre-line bg-gray-200 p-4 shadow-md sm:w-3/5">
                    {JSON.stringify(rewards, null, 2)}
                </div>

                <div className="my-4 border-t border-gray-400"></div>

                <div className="w-2/5 whitespace-pre-line bg-gray-200 p-4 shadow-md sm:w-3/5">
                    {reasoning}
                </div>
            </div>

        </div>)
}
