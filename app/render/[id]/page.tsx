'use client'

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
import { useEffect, useState } from 'react'

import '@fortawesome/react-fontawesome'
import { Character, characterCard } from '@/components/character'
import { ScoresCommentsData, parseReasoning, rewardDiagram, rewards } from '@/components/rewards'
import { ScenarioData, parseScenarioData } from '@/components/scenario'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RawScoresReasoning from '@/components/raw_scores_reasoning'
import { IconOpenAI } from '@/components/ui/icons'
import { get } from 'https'

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
    const SOTOPIA_SERVER_URL = "https://tiger.lti.cs.cmu.edu:8002/"
    if (SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined");
    } else {
        console.log(SOTOPIA_SERVER_URL + "get_agent/" + agentId);

        try {
            const response = await fetch(
                SOTOPIA_SERVER_URL + "get_agent/" + agentId,
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

declare type GetEpisodeHelper = {
    messages: Message[],
    messages_context: any,
    rewards: any,
    reasoning: any,
    agent1: Character,
    agent2: Character,
    scenario: ScenarioData
}

async function getEpisode(episodeId: string): Promise<GetEpisodeHelper> {
    const SOTOPIA_SERVER_URL = "https://tiger.lti.cs.cmu.edu:8002/"
    if (SOTOPIA_SERVER_URL === undefined) {
        throw new Error("SOTOPIA_SERVER_URL is undefined")
    } else {
        console.log(SOTOPIA_SERVER_URL + "get_episode/" + episodeId)
        const response_json = await fetch(
            SOTOPIA_SERVER_URL + "get_episode/" + episodeId,
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
        return {
            messages: messages_list,
            messages_context: response_json["messages"],
            rewards: response_json["rewards"],
            reasoning: response_json["reasoning"],
            agent1: agent1,
            agent2: agent2,
            scenario: scenario
        }
    }
}

function getEmptyCharacter(): Character {
    return {
        pk: "",
        first_name: "",
        last_name: "",
        age: 0,
        occupation: "",
        gender: "",
        gender_pronoun: "",
        public_info: "",
        big_five: "",
        moral_values: [],
        schwartz_personal_values: [],
        personality_and_values: "",
        decision_making_style: "",
        secret: "",
        model_id: "",
        mbti: "",
      };
}

function getEmptyScenarioData(): ScenarioData {
    return {
        scenario: "",
        agent1: "",
        agent2: "",
        agent1Goal: "",
        agent2Goal: "",
    };
}

function getEmptyRewards(): rewards {
    return {
        believability: 0,
        relationship: 0,
        knowledge: 0,
        secret: 0,
        social_rules: 0,
        financial_and_material_benefits: 0,
        goal: 0,
        overall_score: 0
    }
}

function getAgentOneRewards(rewards: any): rewards {
    if (rewards === null) {
        return getEmptyRewards()
    }
    return rewards[0][1]
}

function getAgentTwoRewards(rewards: any): rewards {
    if (rewards === null) {
        return getEmptyRewards()
    }
    return rewards[1][1]
}

export default function ChatPage({ params }: ChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messages_context, setMessagesContext] = useState<any>(null);
    const [rewards, setRewards] = useState<any>(null);
    const [reasoning, setReasoning] = useState<any>(null);
    const [agent1, setAgent1] = useState<Character>(getEmptyCharacter());;
    const [agent2, setAgent2] = useState<Character>(getEmptyCharacter());;
    const [scenario, setScenario] = useState<ScenarioData>(getEmptyScenarioData());;

    useEffect(
        () => {
            const fetchData = async () => {
                const { messages, messages_context, rewards, reasoning, agent1, agent2, scenario } = await getEpisode(params.id);
                setMessages(messages);
                setMessagesContext(messages_context);
                setRewards(rewards);
                setReasoning(reasoning);
                setAgent1(agent1);
                setAgent2(agent2);
                setScenario(scenario);
            };
            fetchData().catch(console.error);
        },
        []
    );
    console.log(messages)
    const reasoning_data = parseReasoning(reasoning)
    return (
        <div className={cn('grid grid-cols-12 gap-6 pb-[200px] px-60 pt-4 md:pt-10')}>
                
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
                <div className="col-start-3 col-span-8 rounded-md bg-gray-200 p-3 drop-shadow-sm hover:drop-shadow-md dark:bg-black dark:text-white">
                    <h1 className="text-center font-sans text-xl italic">{scenario.scenario}</h1>
                </div>
                <div className="col-span-4 col-start-3">
                    {characterCard(agent1)}
                    <div className="p-5">
                    <div className="p-3 rounded-md bg-gray-200 drop-shadow-sm hover:drop-shadow-md dark:bg-black dark:text-white">
                        <h1 className="text-center font-sans text-md">Goal <i className="fa-solid fa-bullseye"></i>: {scenario.agent1Goal}</h1>
                </div>
                </div>
                </div>
                <div className="col-span-4 col-start-7">
                    {characterCard(agent2)}
                    <div className="p-5">
                    <div className="p-3 rounded-md bg-gray-200 drop-shadow-sm hover:drop-shadow-md dark:bg-black dark:text-white">
                        <h1 className="text-center font-sans text-md">Goal <i className="fa-solid fa-bullseye"></i>: {scenario.agent2Goal}</h1>
                    </div>
                    </div>
                </div>

            <div className='col-span-12'>
            <ChatList  messages={messages} />
            </div>

            <div className='col-span-10 col-start-2 justify-items-center pt-20'>
            <div className="text-center rounded-md bg-lime-400 drop-shadow-md p-3">
                <h1 className="text-4xl">Automatic Evaluation</h1>
                <IconOpenAI className="w-16 h-16 mx-auto mt-4" />
            </div>
            </div>

            <div className="col-span-5 col-start-2 pt-8">
                <div className="rounded-2xl p-4 dark:bg-black dark:text-white">
                    <h1 className="text-center text-xl font-sans">Scores for Agent1</h1>
                </div>
                {rewardDiagram(getAgentOneRewards(rewards))}
                {RawScoresReasoning(getAgentOneRewards(rewards), reasoning_data.agent1_comment)}
            </div>

            <div className="col-span-5 pt-8">
                <div className="rounded-2xl p-4 dark:bg-black dark:text-white">
                    <h1 className="text-center text-xl font-sans">Scores for Agent2</h1>
                </div>
                {rewardDiagram(getAgentTwoRewards(rewards))}
                {RawScoresReasoning(getAgentTwoRewards(rewards), reasoning_data.agent2_comment)}
            </div>
        </div>)
}