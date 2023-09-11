import { type Message } from 'ai';
import exp from 'constants';
import { parse } from 'path';
import { useEffect, useState } from 'react';

import { parseMessage } from '@/app/render/[id]/page';
import { ChatMessage } from '@/components/chat-message';
import { Separator } from '@/components/ui/separator';

import { parseScenarioData,ScenarioData } from './scenario';

export interface ChatList {
    messages: Message[];
}

function decideClientSideAgent(data: ScenarioData): string {
    // Check if agent1's goal is not "Unknown" and return agent1 if true
    if (data.agent1Goal !== 'Unknown') {
      return data.agent1;
    }
    
    // Check if agent2's goal is not "Unknown" and return agent2 if true
    if (data.agent2Goal !== 'Unknown') {
      return data.agent2;
    }
  
    // If both agent1 and agent2 have "Unknown" goals or if the data is incomplete, return null
    return '';
  }

export let clientSideAgent = '';
export let serverSideAgent = '';

function ChatParseInitialMessage(message: Message): Message[] {
    const Scenario = parseScenarioData(message.content);
    clientSideAgent = decideClientSideAgent(Scenario);
    serverSideAgent = clientSideAgent === Scenario.agent1 ? Scenario.agent2 : Scenario.agent1;
    return (
        Scenario.agent1 === clientSideAgent ?
            [{
                id: message.id,
                role: 'system',
                content: 'Scenario: ' + Scenario.scenario,
            },
            {
                id: message.id,
                role: 'system',
                content: 'You are playing as ' + Scenario.agent1,
            },
            {
                id: message.id,
                role: 'system',
                content: Scenario.agent1Background,
            },
            {
                id: message.id,
                role: 'system',
                content: Scenario.agent1Goal,
            },
            {
                id: message.id,
                role: 'system',
                content: 'You are talking to ' + Scenario.agent2+ '. ' + Scenario.agent2Background,
            },
            ]:

    [{
        id: message.id,
        role: 'system',
        content: 'Scenario: ' + Scenario.scenario,
    },
        {
            id: message.id,
            role: 'system',
            content: 'You are playing as ' + Scenario.agent1,
        },
        {
            id: message.id,
            role: 'system',
            content: Scenario.agent2Background,
        },
        {
            id: message.id,
            role: 'system',
            content: Scenario.agent2Goal,
        },
        {
            id: message.id,
            role: 'system',
            content: 'You are talking to ' + Scenario.agent1+ '. ' + Scenario.agent1Background,
        },]
    );
}

function ChatParseNormalMessage(message: Message): Message {
    const renderedMessage = message;
    renderedMessage.content = parseMessage(message.content)[0];
    return renderedMessage;
}

function parseMessages(messages: Message[]): Message[] {
    const renderedMessages_list: Message[][] = messages.map((message, index) => {
        return (index === 0 ? ChatParseInitialMessage(message) : [ChatParseNormalMessage(message),]);
    });
    const renderedMessages = renderedMessages_list.flat();
    return renderedMessages;
}

export function ChatList({ messages }: ChatList) {
    // if (!messages.length) {
    //   return null
    // }
    const [renderedMessages, setRenderedMessages] = useState<Message[]>([]);
    useEffect(() => {
        const _renderedMessages = parseMessages(messages);
        setRenderedMessages(_renderedMessages);
    }, [messages]);
    
    return (
        <div className="relative mx-auto max-w-2xl px-4">
            {renderedMessages.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message} />
                    {/* {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )} */}
                </div>
            ))}
        </div>
    );
}

