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

import '@fortawesome/react-fontawesome'
import { Character, characterCard } from '@/components/character'
import { ScoresCommentsData, parseReasoning, rewardDiagram } from '@/components/rewards'
import { ScenarioData, parseScenarioData } from '@/components/scenario'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export interface AgentCardProps {
  params: {
    id: string
  }
}

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
async function getAgent(agentId: string): Promise<Character> {
    if (process.env.SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined");
    } else {
        console.log(process.env.SOTOPIA_SERVER_URL + "get_agent/" + agentId);

        try {
            const response = await fetch(
                process.env.SOTOPIA_SERVER_URL + "get_agent/" + agentId,
                { method: 'GET', cache: 'no-store' }
            );

            if (response.status === 200) {
                const response_json = await response.json();
                // console.log(response_json);
                return response_json as Character; // Type-casting the response_json
            } else {
                throw new Error("Something went wrong on the API server!" + response.status + response.statusText);
            }
        } catch (err) {
            console.error('caught it!', err);
            throw err; // Rethrow the error to handle it elsewhere if needed
        }
    }
}

async function getEpisode(episodeId: string) {
    if (process.env.SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined")
    } else {
        console.log(process.env.SOTOPIA_SERVER_URL + "get_episode/" + episodeId)
        const response_json = await fetch(
            process.env.SOTOPIA_SERVER_URL + "get_episode/" + episodeId,
            {method: 'GET', cache: 'no-store' }
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
        const scenario: ScenarioData = parseScenarioData(response_json["messages"][0][0][2]+"\n\n"+response_json["messages"][0][1][2])
        const messages_list_raw = chooseOnlyMessagesToEnvironment(
            response_json["messages"]
        )
        const agent_id1 = response_json["agents"][0]
        const agent_id2 = response_json["agents"][1]
        console.log("agent ids: ", agent_id1, agent_id2)
        var agent1 = await getAgent(agent_id1)
        var agent2 = await getAgent(agent_id2)

        var name2model: { [name: string]: string } = {}
        messages_list_raw[0].slice(0, 2).forEach((message, index) => {
            name2model[message[0]] = response_json["models"][index] // not handling #models < 1
        })
        const filtered_messages_list = filterDidnothingMessages(messages_list_raw)
        const parsed_messages_list = parseMessages(filtered_messages_list)
        const messages_list = composeMessages(parsed_messages_list, name2model)
        return [messages_list, response_json["messages"], response_json["rewards"], response_json["reasoning"], agent1, agent2, scenario]
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
    const [messages, messages_context, rewards, reasoning, agent1, agent2, scenario] = await getEpisode(params.id)
    console.log(scenario)
    const reasoning_data = parseReasoning(reasoning)
    return (
        <div className={cn('pb-[200px] pt-4 md:pt-10 grid grid-cols-12 gap-4')}>
                
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />

            <div className="col-span-12 w-full m-10 mx-auto p-10 dark:bg-black dark:text-white">
                <div className="col-span-12 w-full border-2 border-gray-900 bg-gray-200 p-10 dark:bg-black dark:text-white">
                    <h1 className="text-center text-xl">{scenario.scenario}</h1>
                </div>
                <div className='flex flex-row'>
                <div className="col-span-6 m-10 max-w-sm">
                    {characterCard(agent1)}
                    <div className="border-2 border-gray-900 bg-gray-200 p-10 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">{scenario.agent1Goal}</h1>
                    </div>
                </div>
                <div className="col-span-6 m-10 max-w-sm">
                    {characterCard(agent2)}
                    <div className="border-2 border-gray-900 bg-gray-200 p-10 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">{scenario.agent2Goal}</h1>
                    </div>
                </div>
                </div>
            </div>

            <div className='col-span-12'>
            <ChatList  messages={messages} />
            </div>


            <div className="col-span-12 dark:bg-black dark:text-white">
                <div className="col-span-6 m-10 mx-auto flex-row">
                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">Scores for Agent1</h1>
                    </div>
                    </div>
                    {rewardDiagram(rewards[0][1])}

                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                            <h1 className="text-center text-xl">{reasoning_data.agent1_comment}</h1>
                    </div>
                    </div>
                </div>

                <div className="col-span-6 m-10 mx-auto flex-row">
                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">Scores for Agent2</h1>
                    </div>
                    </div>
                    {rewardDiagram(rewards[1][1])}
                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">{reasoning_data.agent2_comment} </h1>
                    </div>
                    </div>
                </div>
            </div>
        </div>)
}