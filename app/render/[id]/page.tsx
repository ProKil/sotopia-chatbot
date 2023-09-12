'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { get } from 'https';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getChat } from '@/app/actions';
import { auth } from '@/auth';
import CharacterCard, { Character, } from '@/components/character';
import { ChatProps } from '@/components/chat';
import { ChatList } from '@/components/chat-list-history';
import { Message, parseMessage } from '@/components/chat-message-history';
import { EmptyScreen } from '@/components/empty-screen';
import RawScoresReasoning from '@/components/raw_scores_reasoning';
import {
    parseReasoning,
    rewardDiagram,
    rewards,
    ScoresCommentsData,
} from '@/components/rewards';
import { parseScenarioData, ScenarioData } from '@/components/scenario';
import { IconOpenAI } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export const runtime = 'edge';
export const preferredRegion = 'home';

export interface ChatPageProps {
    params: {
        id: string;
    };
}

export interface AgentCardProps {
    params: {
        id: string;
    };
}

function chooseOnlyMessagesToEnvironment(messages: any[][]) {
    return messages.map((messages_in_turn) =>
        messages_in_turn.filter((message: any) => message[1] === 'Environment'),
    );
}

function filterDidnothingMessages(messages: any[][]) {
    return messages
        .map((messages_in_turn) =>
            messages_in_turn.filter(
                (message: any) => message[2] !== 'did nothing',
            ),
        )
        .flat();
}



function parseMessages(messages: any[][]) {
    return messages.map((message: any) => {
        const [sender, receiver, content] = message;
        return [sender, receiver].concat(parseMessage(content));
    });
}

function composeMessages(
    messages: any[][],
    name2model: { [name: string]: string },
): Message[] {
    return messages.map((message: any) => {
        const [id, environment, content, type] = message;
        const role = 'character';
        return {
            id,
            content,
            role,
            type,
            additional_info: name2model[id],
        };
    });
}
async function getAgent(agentId: string): Promise<Character> {
    const SOTOPIA_SERVER_URL = 'https://tiger.lti.cs.cmu.edu:8002/';
    if (SOTOPIA_SERVER_URL === undefined) {
        throw new Error('SOTOPIA_SERVER_URL is undefined');
    } else {
        console.log(`${SOTOPIA_SERVER_URL  }get_agent/${  agentId}`);

        try {
            const response = await fetch(
                `${SOTOPIA_SERVER_URL  }get_agent/${  agentId}`,
                { method: 'GET', cache: 'no-store' },
            );

            if (response.status === 200) {
                const response_json = await response.json();
                // console.log(response_json);
                return response_json as Character; // Type-casting the response_json
            } 
                throw new Error(
                    `Something went wrong on the API server!${ 
                        response.status 
                        }${response.statusText}`,
                );
            
        } catch (err) {
            console.error('caught it!', err);
            throw err; // Rethrow the error to handle it elsewhere if needed
        }
    }
}

declare type GetEpisodeHelper = {
    messages: Message[];
    messages_context: any;
    rewards: any;
    reasoning: any;
    agent1: Character;
    agent2: Character;
    scenario: ScenarioData;
};

async function getEpisode(episodeId: string): Promise<GetEpisodeHelper> {
    const SOTOPIA_SERVER_URL = 'https://tiger.lti.cs.cmu.edu:8002/';
    if (SOTOPIA_SERVER_URL === undefined) {
        throw new Error('SOTOPIA_SERVER_URL is undefined');
    } else {
        console.log(`${SOTOPIA_SERVER_URL  }get_episode/${  episodeId}`);
        const response_json = await fetch(
            `${SOTOPIA_SERVER_URL  }get_episode/${  episodeId}`,
            { method: 'GET', cache: 'no-store' },
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } 
                    throw new Error(
                        `Something went wrong on API server!${ 
                            response.status 
                            }${response.statusText}`,
                    );
                
            })
            .catch((err) => {
                console.log('caught it!', err);
            });
        const scenario: ScenarioData = parseScenarioData(
            `${response_json.messages[0][0][2] 
                }\n\n${ 
                response_json.messages[0][1][2]}`,
        );
        const messages_list_raw = chooseOnlyMessagesToEnvironment(
            response_json.messages,
        );
        const agent_id1 = response_json.agents[0];
        const agent_id2 = response_json.agents[1];
        console.log('agent ids: ', agent_id1, agent_id2);
        const agent1 = await getAgent(agent_id1);
        const agent2 = await getAgent(agent_id2);

        const name2model: { [name: string]: string } = {};
        messages_list_raw[0].slice(0, 2).forEach((message, index) => {
            name2model[message[0]] = response_json.models[index]; // not handling #models < 1
        });
        const filtered_messages_list =
            filterDidnothingMessages(messages_list_raw);
        const parsed_messages_list = parseMessages(filtered_messages_list);
        const messages_list = composeMessages(parsed_messages_list, name2model);
        return {
            messages: messages_list,
            messages_context: response_json.messages,
            rewards: response_json.rewards,
            reasoning: response_json.reasoning,
            agent1,
            agent2,
            scenario,
        };
    }
}

function getEmptyCharacter(): Character {
    return {
        pk: '',
        first_name: '',
        last_name: '',
        age: 0,
        occupation: '',
        gender: '',
        gender_pronoun: '',
        public_info: '',
        big_five: '',
        moral_values: [],
        schwartz_personal_values: [],
        personality_and_values: '',
        decision_making_style: '',
        secret: '',
        model_id: '',
        mbti: '',
    };
}

function getEmptyScenarioData(): ScenarioData {
    return {
        scenario: '',
        agent1: '',
        agent2: '',
        agent1Goal: '',
        agent2Goal: '',
        agent1Background: '',
        agent2Background: '',
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
        overall_score: 0,
    };
}

function getAgentOneRewards(rewards: any): rewards {
    if (rewards === null) {
        return getEmptyRewards();
    }
    return rewards[0][1];
}

function getAgentTwoRewards(rewards: any): rewards {
    if (rewards === null) {
        return getEmptyRewards();
    }
    return rewards[1][1];
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
    console.log(messages);
    const reasoning_data = parseReasoning(reasoning);
    return (
        <div className={cn('xl:px-30 grid grid-cols-12 gap-6 px-0 pb-[200px] pt-4 md:px-3 md:pt-10 lg:px-10 2xl:px-60')}>
                
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
                <div className="col-span-10 col-start-2 rounded-md bg-lime-200 p-3 drop-shadow-sm hover:drop-shadow-md dark:bg-black dark:text-white sm:col-span-8 sm:col-start-3">
                    <h1 className="text-center font-sans text-xl italic">{scenario.scenario}</h1>
                </div>
                <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 xl:col-span-4 xl:col-start-3 xl:px-5">
                    {CharacterCard(agent1)}
                    <div className="p-5">
                    <div className="rounded-md bg-slate-200 p-3 drop-shadow-sm hover:drop-shadow-md dark:bg-black dark:text-white">
                        <h1 className="text-md text-center font-sans">Goal <i className="fa-solid fa-bullseye"></i>: {scenario.agent1Goal}</h1>
                </div>
                </div>
                </div>
                <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 xl:col-span-4 xl:col-start-7 xl:px-5">
                    {CharacterCard(agent2)}
                    <div className="p-5">
                    <div className="rounded-md bg-slate-200 p-3 drop-shadow-sm hover:drop-shadow-md dark:bg-black dark:text-white">
                        <h1 className="text-md text-center font-sans">Goal <i className="fa-solid fa-bullseye"></i>: {scenario.agent2Goal}</h1>
                    </div>
                    </div>
                </div>

            <div className='col-span-12'>
            <ChatList  messages={messages} />
            </div>

            <div className='col-span-10 col-start-2 justify-items-center pt-20'>
            <div className="rounded-md bg-lime-400 p-3 text-center drop-shadow-md">
                <h1 className="text-4xl">Automatic Evaluation</h1>
                <IconOpenAI className="mx-auto mt-4 h-16 w-16" />
            </div>
            </div>

            <div className="col-span-10 col-start-2 pt-8 sm:col-span-8 sm:col-start-3 xl:col-span-5 xl:col-start-2">
                <div className="rounded-2xl p-4 dark:bg-black dark:text-white">
                {/* <div className="flex items-center justify-between">
                        <h1 className="text-center text-xl font-sans">Scores for Agent1</h1>
                        {getAvatar(agent1.first_name + " " + agent1.last_name, 40, 40)}
                </div> */}
                    <h1 className="text-center font-sans text-xl">Scores for Agent1</h1>
                    <p className="text-center font-sans text-sm italic">Role-played character: {agent1.first_name} {agent1.last_name}</p>
                </div>
                {rewardDiagram(getAgentOneRewards(rewards))}
                {RawScoresReasoning(getAgentOneRewards(rewards), reasoning_data.agent1_comment)}
            </div>

            <div className="col-span-10 col-start-2 pt-8 sm:col-span-8 sm:col-start-3 xl:col-span-5">
                <div className="rounded-2xl p-4 dark:bg-black dark:text-white">
                    <h1 className="text-center font-sans text-xl">Scores for Agent2</h1>
                    <p className="text-center font-sans text-sm italic">Role-played character: {agent2.first_name} {agent2.last_name}</p>
                </div>
                {rewardDiagram(getAgentTwoRewards(rewards))}
                {RawScoresReasoning(getAgentTwoRewards(rewards), reasoning_data.agent2_comment)}
            </div>
        </div>);
}
