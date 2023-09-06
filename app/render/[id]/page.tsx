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
// export interface AgentCardProps {
//   params: {
//     pk: string;
//     first_name: string;
//     last_name: string;
//     age: number;
//     occupation: string;
//     gender: string;
//     gender_pronoun: string;
//     public_info: string;
//     big_five: string;
//     moral_values: string[];
//     schwartz_personal_values: string[];
//     personality_and_values: string;
//     decision_making_style: string;
//     secret: string;
//     model_id: string;
//     mbti: string;
//   };
// }
// function parseAgentData(jsonData: any): AgentCardProps {
//   const agentProps: AgentCardProps = {
//     agent: {
//       pk: jsonData.pk,
//       first_name: jsonData.first_name,
//       last_name: jsonData.last_name,
//       age: jsonData.age,
//       occupation: jsonData.occupation,
//       gender: jsonData.gender,
//       gender_pronoun: jsonData.gender_pronoun,
//       public_info: jsonData.public_info,
//       big_five: jsonData.big_five,
//       moral_values: jsonData.moral_values,
//       schwartz_personal_values: jsonData.schwartz_personal_values,
//       personality_and_values: jsonData.personality_and_values,
//       decision_making_style: jsonData.decision_making_style,
//       secret: jsonData.secret,
//       model_id: jsonData.model_id,
//       mbti: jsonData.mbti,
//     },
//   };
//
//   return agentProps;
// }
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
async function getAgent(agentId: string) {
    if (process.env.SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined")
    } else {
        console.log(process.env.SOTOPIA_SERVER_URL + "get_agent/" + agentId)
        const response_json = await fetch(
            process.env.SOTOPIA_SERVER_URL + "get_agent/" + agentId,
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

        console.log(`agent_data_model: ${agentId}`)
        console.log(response_json)
        return response_json
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
        const messages_list_raw = chooseOnlyMessagesToEnvironment(
            response_json["messages"]
        )
        console.log("response_json")
        console.log(response_json)
        const agent_id1 = response_json["agents"][0]
        const agent_id2 = response_json["agents"][1]
        console.log("agent ids: ", agent_id1, agent_id2)
        var agent1 = getAgent(agent_id1)
        var agent2 = getAgent(agent_id2)
        var name2model: { [name: string]: string } = {}
        messages_list_raw[0].slice(0, 2).forEach((message, index) => {
            name2model[message[0]] = response_json["models"][index] // not handling #models < 1
        })
        const filtered_messages_list = filterDidnothingMessages(messages_list_raw)
        const parsed_messages_list = parseMessages(filtered_messages_list)
        const messages_list = composeMessages(parsed_messages_list, name2model)
        return [messages_list, response_json["messages"], response_json["rewards"], response_json["reasoning"], response_json["agents"]]
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
    const [messages, messages_context, rewards, reasoning, agents] = await getEpisode(params.id)
    console.log(messages_context[0])
    return (
        <div className={cn('pb-[200px] pt-4 md:pt-10')}>

            <div className="mt-20 flex min-h-screen flex-col items-center justify-center">
                <div className="mb-4 w-2/5 whitespace-pre-line bg-gray-200 p-4 shadow-md sm:w-3/5">
                    {messages_context[0][0].slice(1).join("\n")}
                </div>

                <div className="my-4 border-t border-gray-400"></div>

                <div className="w-2/5 whitespace-pre-line bg-gray-200 p-4 shadow-md sm:w-3/5">
                {messages_context[0][1].slice(1).join("\n")}
                </div>

                <div className="my-4 border-t border-gray-400"></div>

                {agentCard(agents[0])}
                {agentCard(agents[1])}
                <>
                  <ChatList messages={messages} />
                </>

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

export async function agentCard(agentId: string) {
    const agent = await getAgent(agentId)

    return (<div className="m-10 max-w-sm">
              <div className="rounded-lg border-2 border-gray-900 bg-white px-4 pb-4 pt-1">
                <div className="pb-2 px-2" data-testid="card">
                  <div className="flex flex-row pt-2">
                    <div
                      className="border-[1px] border-gray-400 h-[50px] w-[50px] relative shadow-lg rounded-md"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/*{ agent.avatar }*/ "I'm an Avatar"}
                      </div>
                    </div>
                    <div className="px-2">
                      <p className="text-left text-xl font-bold leading-6 text-gray-900">
                          { agent.first_name + agent.last_name }
                      </p>
                      <p className="font-lg text-left font-extralight leading-6 text-gray-600">
                        { agent.occupation } · {agent.gender_pronoun } · { agent.age }
                      </p>
                    </div>
                  </div>
                  <h3 className="flex pt-2">
                    <span className="text-left font-light">{ agent.personality_and_values }</span>
                  </h3>

                  <h3 className="flex">
                    <span className="text-left font-light">{ agent.decision_making_style }</span>
                  </h3>
                  <p className="text-left text-sm leading-6 text-gray-500 hover:text-gray-600">
                      { agent.public_info }
                  </p>
                  <ul
                    className="mt-3 divide-y border-[1px] border-red-900 rounded bg-red-100 py-1 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow"
                  >
                      <li className="flex py-2 px-3 text-sm">
                      <div className="flex-row flex-wrap">
                        <i className="fa-solid fa-lock fa-sm"></i>
                          <span className="ml-auto"
                          ><span className="p-1 text-sm font-medium"
                            >{ agent.secret }</span
                          ></span
                        >
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>);
}
