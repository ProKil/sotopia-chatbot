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
        <div className={cn('pb-[200px] pt-4 md:pt-10 grid grid-cols-12 gap-4')}>
                
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
            <script src="https://cdn.tailwindcss.com"></script>

            <div className="col-span-12 m-10 mx-auto p-10 dark:bg-black dark:text-white">
                <div className="col-span-12 w-full border-2 border-gray-900 bg-gray-200 p-10 dark:bg-black dark:text-white">
                    <h1 className="text-center text-xl">Social Scenario: episode.social_scenario</h1>
                </div>

                <div className="col-span-6 m-10 max-w-sm">
                    <div className="rounded-lg border-2 border-gray-900 bg-white px-4 pb-4 pt-1 dark:bg-black dark:text-white">
                    <div className="pb-2 pl-2 pr-2" data-testid="card">
                        <div className="flex flex-row pt-2">
                        <div className="relative h-[50px] w-[50px] rounded-md border-[1px] border-gray-400 shadow-lg">
                            <div className="absolute inset-0 flex items-center justify-center">
                            <svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 358.898 358.898" xmlSpace="preserve" fill="#000000">
                                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                                <g id="SVGRepo_iconCarrier">
                                <g id="XMLID_972_">
                                    <g id="XMLID_973_">
                                    <path id="XMLID_1002_" fill="#682234" d="M290.089,141.269C290.089,59.796,247.343,0,179.449,0 C111.932,0,69.293,59.135,68.82,139.914c-2.475-0.56-5.046-0.865-7.689-0.865c-19.179,0-34.727,15.548-34.727,34.727 c0,15.758,10.499,29.056,24.88,33.302c0.335,18.89,15.742,34.102,34.711,34.102c5.798,0,11.259-1.428,16.063-3.941 c4.993,13.055,17.63,22.329,32.439,22.329c19.179,0,34.727-15.548,34.727-34.727c0-2.803-0.341-5.524-0.968-8.135 c44.084,1.686,90.604-6.62,110.677-24.92C305.325,167.728,290.089,163.207,290.089,141.269z" />
                                    <path id="XMLID_1004_" fill="#581a2b" d="M332.494,173.776c0-19.179-15.548-34.727-34.727-34.727 c-2.644,0-5.215,0.305-7.689,0.865C289.605,59.135,246.965,0,179.449,0c-0.032,0-0.063,0.001-0.094,0.001v216.92 c3.768,0.001,7.536-0.071,11.286-0.214c-0.627,2.611-0.968,5.332-0.968,8.135c0,19.179,15.548,34.727,34.727,34.727 c14.81,0,27.447-9.274,32.439-22.329c4.805,2.512,10.266,3.941,16.063,3.941c18.97,0,34.376-15.212,34.711-34.102 C321.995,202.832,332.494,189.534,332.494,173.776z" />
                                    </g>
                                    <g id="XMLID_1005_">
                                    <path id="XMLID_1006_" fill="#5bcefa" d="M207.778,180.756h-26.884h-1.256h-0.379h-1.256h-26.884 c0,74.552-36.43,67.808-36.43,67.808c0,47.368,51.162,62.392,63.313,66.806v1.537c0,0,0.533-0.11,1.446-0.359 c0.912,0.249,1.446,0.359,1.446,0.359v-1.537c12.151-4.414,63.313-19.439,63.313-66.806 C244.208,248.564,207.778,255.308,207.778,180.756z" />
                                    <path id="XMLID_1007_" fill="#48a4c8" d="M207.778,180.756h-26.884h-1.256h-0.189v135.792 c0.912,0.249,1.446,0.359,1.446,0.359v-1.537c12.151-4.414,63.313-19.439,63.313-66.806 C244.208,248.564,207.778,255.308,207.778,180.756z" />
                                    </g>
                                    <g id="XMLID_1008_">
                                    <path id="XMLID_1009_" fill="#5bcefa" d="M296.43,318.004v40.681H62.467v-40.681c0-30.431,14.377-56.963,37.605-70.913 c6.043-3.641,12.69-6.43,19.844-8.196c5.953-1.488,12.254-2.272,18.842-2.272l40.691,24.002l40.691-24.002 c6.588,0,12.889,0.784,18.842,2.272c7.154,1.766,13.802,4.554,19.844,8.196C282.053,261.041,296.43,287.573,296.43,318.004z" />
                                    <path id="XMLID_1010_" fill="#48a4c8" d="M296.429,318.005v40.68h-116.98v-98.06l36-21.23l4.69-2.77 c6.59,0,12.89,0.78,18.84,2.27c7.16,1.77,13.8,4.55,19.85,8.2C282.049,261.045,296.429,287.575,296.429,318.005z" />
                                    </g>
                                    <g id="XMLID_1011_">
                                    <path id="XMLID_1012_" fill="#5bcefa" d="M180.354,120.925h-64.988c0.84,22.166,4.35,42.212,8.428,49.74 c9.042,16.694,29.221,38.957,55.657,38.957c26.431,0,46.607-22.262,55.652-38.957c4.077-7.528,7.588-27.574,8.429-49.74H180.354z" />
                                    <path id="XMLID_1013_" fill="#48a4c8" d="M180.354,120.925h-1v88.694c0.032,0,0.064,0.002,0.096,0.002 c26.431,0,46.607-22.263,55.652-38.957c4.077-7.528,7.588-27.573,8.429-49.74h-63.177V120.925z" />
                                    </g>
                                    <g id="XMLID_1014_">
                                    <path id="XMLID_1015_" fill="#aec7ea" d="M224.933,267.897h-2.955c-7.109,15.907-23.023,26.993-41.529,26.993 c-25.129,0-45.5-20.43-45.5-45.632c0-4.463,0.65-8.772,1.841-12.849c-5.881,0.139-11.524,0.899-16.882,2.241 c-7.16,1.77-13.8,4.55-19.85,8.2c-23.22,13.95-37.6,40.48-37.6,70.91v5.97h37.306l-0.306,0.5v34.667h160V324.23L224.933,267.897z" />
                                    <path id="XMLID_1016_" fill="#96b3d4" d="M296.439,317.761c0-30.43-14.38-56.96-37.6-70.91 c-6.05-3.65-12.69-6.43-19.85-8.2c-4.74-1.187-9.706-1.915-14.86-2.165c1.177,4.055,1.82,8.338,1.82,12.773 c0,25.202-20.371,45.632-45.5,45.632c-0.332,0-0.66-0.018-0.99-0.025v64.032h80v-34.667l-0.306-0.5h37.286V317.761z" />
                                    </g>
                                </g>
                                </g>
                            </svg>
                            </div>
                        </div>
                        <div className="px-2">
                            <p className="text-left text-xl font-bold leading-6 text-gray-900">  agent.name  </p>
                            <p className="font-lg text-left font-extralight leading-6 text-gray-600">  agent.occupation   ·   agent.gender_pronouns   ·   agent.age  </p>
                        </div>
                        </div>
                        <h3 className="flex pt-2">
                        <span className="text-left font-light">  agent.personality  </span>
                        </h3>

                        <h3 className="flex">
                        <span className="text-left font-light">  agent.decision_making_style  </span>
                        </h3>
                        <p className="text-left text-sm leading-6 text-gray-500 hover:text-gray-600">  agent.public_info  </p>
                        <ul className="mt-3 divide-y rounded border-[1px] border-red-900 bg-red-100 py-1 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                        <li className="flex px-3 py-2 text-sm">
                            <div className="flex-row flex-wrap">
                            <i className="fa-solid fa-lock fa-sm"></i>
                            <span className="ml-auto"><span className="px-1 py-1 text-sm font-medium">  agent.secret  </span></span>
                            </div>
                        </li>
                        </ul>
                    </div>
                    </div>
                </div>

                <div className="col-span-6 m-10 max-w-sm">
                    <div className="rounded-lg border-2 border-gray-900 bg-white px-4 pb-4 pt-1 dark:bg-black dark:text-white">
                    <div className="pb-2 pl-2 pr-2" data-testid="card">
                        <div className="flex flex-row pt-2">
                        <div className="relative h-[50px] w-[50px] rounded-md border-[1px] border-gray-400 shadow-lg">
                            <div className="absolute inset-0 flex items-center justify-center">
                            <svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 358.898 358.898" xmlSpace="preserve" fill="#000000">
                                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                                <g id="SVGRepo_iconCarrier">
                                <g id="XMLID_972_">
                                    <g id="XMLID_973_">
                                    <path id="XMLID_1002_" fill="#682234" d="M290.089,141.269C290.089,59.796,247.343,0,179.449,0 C111.932,0,69.293,59.135,68.82,139.914c-2.475-0.56-5.046-0.865-7.689-0.865c-19.179,0-34.727,15.548-34.727,34.727 c0,15.758,10.499,29.056,24.88,33.302c0.335,18.89,15.742,34.102,34.711,34.102c5.798,0,11.259-1.428,16.063-3.941 c4.993,13.055,17.63,22.329,32.439,22.329c19.179,0,34.727-15.548,34.727-34.727c0-2.803-0.341-5.524-0.968-8.135 c44.084,1.686,90.604-6.62,110.677-24.92C305.325,167.728,290.089,163.207,290.089,141.269z" />
                                    <path id="XMLID_1004_" fill="#581a2b" d="M332.494,173.776c0-19.179-15.548-34.727-34.727-34.727 c-2.644,0-5.215,0.305-7.689,0.865C289.605,59.135,246.965,0,179.449,0c-0.032,0-0.063,0.001-0.094,0.001v216.92 c3.768,0.001,7.536-0.071,11.286-0.214c-0.627,2.611-0.968,5.332-0.968,8.135c0,19.179,15.548,34.727,34.727,34.727 c14.81,0,27.447-9.274,32.439-22.329c4.805,2.512,10.266,3.941,16.063,3.941c18.97,0,34.376-15.212,34.711-34.102 C321.995,202.832,332.494,189.534,332.494,173.776z" />
                                    </g>
                                    <g id="XMLID_1005_">
                                    <path id="XMLID_1006_" fill="#5bcefa" d="M207.778,180.756h-26.884h-1.256h-0.379h-1.256h-26.884 c0,74.552-36.43,67.808-36.43,67.808c0,47.368,51.162,62.392,63.313,66.806v1.537c0,0,0.533-0.11,1.446-0.359 c0.912,0.249,1.446,0.359,1.446,0.359v-1.537c12.151-4.414,63.313-19.439,63.313-66.806 C244.208,248.564,207.778,255.308,207.778,180.756z" />
                                    <path id="XMLID_1007_" fill="#48a4c8" d="M207.778,180.756h-26.884h-1.256h-0.189v135.792 c0.912,0.249,1.446,0.359,1.446,0.359v-1.537c12.151-4.414,63.313-19.439,63.313-66.806 C244.208,248.564,207.778,255.308,207.778,180.756z" />
                                    </g>
                                    <g id="XMLID_1008_">
                                    <path id="XMLID_1009_" fill="#5bcefa" d="M296.43,318.004v40.681H62.467v-40.681c0-30.431,14.377-56.963,37.605-70.913 c6.043-3.641,12.69-6.43,19.844-8.196c5.953-1.488,12.254-2.272,18.842-2.272l40.691,24.002l40.691-24.002 c6.588,0,12.889,0.784,18.842,2.272c7.154,1.766,13.802,4.554,19.844,8.196C282.053,261.041,296.43,287.573,296.43,318.004z" />
                                    <path id="XMLID_1010_" fill="#48a4c8" d="M296.429,318.005v40.68h-116.98v-98.06l36-21.23l4.69-2.77 c6.59,0,12.89,0.78,18.84,2.27c7.16,1.77,13.8,4.55,19.85,8.2C282.049,261.045,296.429,287.575,296.429,318.005z" />
                                    </g>
                                    <g id="XMLID_1011_">
                                    <path id="XMLID_1012_" fill="#5bcefa" d="M180.354,120.925h-64.988c0.84,22.166,4.35,42.212,8.428,49.74 c9.042,16.694,29.221,38.957,55.657,38.957c26.431,0,46.607-22.262,55.652-38.957c4.077-7.528,7.588-27.574,8.429-49.74H180.354z" />
                                    <path id="XMLID_1013_" fill="#48a4c8" d="M180.354,120.925h-1v88.694c0.032,0,0.064,0.002,0.096,0.002 c26.431,0,46.607-22.263,55.652-38.957c4.077-7.528,7.588-27.573,8.429-49.74h-63.177V120.925z" />
                                    </g>
                                    <g id="XMLID_1014_">
                                    <path id="XMLID_1015_" fill="#aec7ea" d="M224.933,267.897h-2.955c-7.109,15.907-23.023,26.993-41.529,26.993 c-25.129,0-45.5-20.43-45.5-45.632c0-4.463,0.65-8.772,1.841-12.849c-5.881,0.139-11.524,0.899-16.882,2.241 c-7.16,1.77-13.8,4.55-19.85,8.2c-23.22,13.95-37.6,40.48-37.6,70.91v5.97h37.306l-0.306,0.5v34.667h160V324.23L224.933,267.897z" />
                                    <path id="XMLID_1016_" fill="#96b3d4" d="M296.439,317.761c0-30.43-14.38-56.96-37.6-70.91 c-6.05-3.65-12.69-6.43-19.85-8.2c-4.74-1.187-9.706-1.915-14.86-2.165c1.177,4.055,1.82,8.338,1.82,12.773 c0,25.202-20.371,45.632-45.5,45.632c-0.332,0-0.66-0.018-0.99-0.025v64.032h80v-34.667l-0.306-0.5h37.286V317.761z" />
                                    </g>
                                </g>
                                </g>
                            </svg>
                            </div>
                        </div>
                        <div className="px-2">
                            <p className="text-left text-xl font-bold leading-6 text-gray-900">  agent.name  </p>
                            <p className="font-lg text-left font-extralight leading-6 text-gray-600">  agent.occupation   ·   agent.gender_pronouns   ·   agent.age  </p>
                        </div>
                        </div>
                        <h3 className="flex pt-2">
                        <span className="text-left font-light">  agent.personality  </span>
                        </h3>

                        <h3 className="flex">
                        <span className="text-left font-light">  agent.decision_making_style  </span>
                        </h3>
                        <p className="text-left text-sm leading-6 text-gray-500 hover:text-gray-600">  agent.public_info  </p>
                        <ul className="mt-3 divide-y rounded border-[1px] border-red-900 bg-red-100 py-1 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                        <li className="flex px-3 py-2 text-sm">
                            <div className="flex-row flex-wrap">
                            <i className="fa-solid fa-lock fa-sm"></i>
                            <span className="ml-auto"><span className="px-1 py-1 text-sm font-medium">  agent.secret  </span></span>
                            </div>
                        </li>
                        </ul>
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

                    <div className="rounded-lg border-2 border-gray-900 bg-white px-4 pb-4 pt-1 dark:bg-black dark:text-white">
                    <div className="flex-col">
                        <p className="font-trajan">Believability</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">0</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-white to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[2500%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">4</div>
                            </div>
                            </div>

                            <div className="ml-1 w-[30%] px-2">10</div>
                        </div>
                        </div>
                        <p className="small-caps">Relationship</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-5</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[1500%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">2</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">5</div>
                        </div>
                        </div>
                        <p className="small-caps">Knowledge</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">0</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-white to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[1000%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">8</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">10</div>
                        </div>
                        </div>
                        <p className="small-caps">Secret</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-10</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-white"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[0%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">0</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">0</div>
                        </div>
                        </div>
                        <p className="small-caps">Social Rules</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-10</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-white"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[500%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">-1</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">0</div>
                        </div>
                        </div>
                        <p className="small-caps">Financial and Material Benefits</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-5</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[3000%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">-3</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">5</div>
                        </div>
                        </div>
                        <p className="small-caps">Goal Completion</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">0</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-white to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[4000%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">1</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">10</div>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">  Reasoning for Agent1  </h1>
                    </div>
                    </div>
                </div>

                <div className="col-span-6 m-10 mx-auto flex-row">
                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">Scores for Agent2</h1>
                    </div>
                    </div>

                    <div className="rounded-lg border-2 border-gray-900 bg-white px-4 pb-4 pt-1 dark:bg-black dark:text-white">
                    <div className="flex-col">
                        <p className="font-trajan">Believability</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">0</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-white to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[2500%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">4</div>
                            </div>
                            </div>

                            <div className="ml-1 w-[30%] px-2">10</div>
                        </div>
                        </div>
                        <p className="small-caps">Relationship</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-5</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[1500%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">2</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">5</div>
                        </div>
                        </div>
                        <p className="small-caps">Knowledge</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">0</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-white to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[1000%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">8</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">10</div>
                        </div>
                        </div>
                        <p className="small-caps">Secret</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-10</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-white"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>
                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[0%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">0</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">0</div>
                        </div>
                        </div>
                        <p className="small-caps">Social Rules</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-10</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-white"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[500%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">-1</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">0</div>
                        </div>
                        </div>
                        <p className="small-caps">Financial and Material Benefits</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">-5</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-blue-500 to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[3000%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">-3</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">5</div>
                        </div>
                        </div>
                        <p className="small-caps">Goal Completion</p>
                        <div className="h-5 w-full p-1">
                        <div className="flex h-full items-center">
                            <div className="mr-1 w-[30%] px-2 text-right">0</div>
                            <div className="h-full w-[180%] border-2 border-gray-200 bg-gradient-to-r from-white to-red-500"></div>
                            <div className="group relative">
                            <div className="h-10 w-full bg-gradient-to-r from-blue-500 to-red-500"></div>

                            <div className="absolute left-1/2 top-1/2 h-4 w-1 -translate-x-[4000%] -translate-y-1/2 transform bg-black">
                                <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">1</div>
                            </div>
                            </div>
                            <div className="ml-1 w-[30%] px-2">10</div>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="m-10 max-w-sm">
                    <div className="w-full rounded-2xl border-2 border-gray-900 bg-gray-200 p-4 dark:bg-black dark:text-white">
                        <h1 className="text-center text-xl">Reasoning for Agent2  </h1>
                    </div>
                    </div>
                </div>
            </div>



            <div className="col-span-12 mt-20 flex min-h-screen flex-col items-center justify-center">
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
