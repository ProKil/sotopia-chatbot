'use client';
import { type Message } from 'ai';
import exp from 'constants';
import { parse } from 'path';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';

import { ChatMessage } from '@/components/chat-message';
import { Separator } from '@/components/ui/separator';

import { parseMessage } from './chat-message-history';
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
const backgroundToMarkdown = (text: string) => {
    // Split the text into paragraphs
    text = text.replace('secrets:', '*secrets* 🔒:');
    text = text.replace('Personality and values description:', '*Personality and values* 🧠:');
    return text;
};
      
export let clientSideAgent = '';
export let serverSideAgent = '';

function ChatParseInitialMessage(message: Message): Message[] {
    const Scenario = parseScenarioData(message.content);
    clientSideAgent = decideClientSideAgent(Scenario);
    serverSideAgent = clientSideAgent === Scenario.agent1 ? Scenario.agent2 : Scenario.agent1;
    return (
        [{
            id: message.id,
            role: 'system',
            content: "Hi, welcome to Sotopia! 👋 I am the 'stage director'. I will give you some instructions and hints during the interaction. See [here](https://docs.google.com/document/d/1qKVsQwIHByrxSW2FSkIE-V6pnmKKbrjnk0A3ne1dDUY/edit?usp=sharing) for the interface instruction. *Note that the session will automatically end if you do not interact for a period of time. We encourage you to finsh each turn in 2 mins.* ",
        },
            {
                id: message.id,
                role: 'system',
                content: 'Scenario 🎬: ' + Scenario.scenario,
            },
            {
                id: message.id,
                role: 'system',
                content: 'You are **playing** as ' + clientSideAgent+ '. '+ backgroundToMarkdown(Scenario.agent1 === clientSideAgent ? Scenario.agent1Background: Scenario.agent2Background),
            },
            {
                id: message.id,
                role: 'user',
                content: '👈 Hey! This is ' + clientSideAgent + "👋 (Yes, it's you now)",
            },
            {
                id: message.id,
                role: 'system',
                content: 'You are **interacting** with ' + serverSideAgent+ '. ' + backgroundToMarkdown(Scenario.agent1 === clientSideAgent ? Scenario.agent2Background: Scenario.agent1Background),
            },
            {
                id: message.id,
                role: 'assistant',
                content: '👈 Hey! This is ' + serverSideAgent + '👋',
            },
            {
            id: message.id,
            role: 'system',
            content: 'Your ('+ clientSideAgent +"'s) social goal 🎯: "+ (Scenario.agent1 === clientSideAgent ? Scenario.agent1Goal: Scenario.agent2Goal) + "  \n*Note that the other agent can't see your goal.*",
            },
            {
                id: message.id,
                role: 'system',
                content: '-------------------Start your interaction now! *Have fun!* 🎉--------------------------',
            },
            ]
    );
}

function ChatParseNormalMessage(message: Message): Message {
    const renderedMessage = message;
    renderedMessage.content = parseMessage(message.content);
    return renderedMessage;
}

function ChatParseLastMessage(message: Message): Message {
    const renderedMessage = message;
    renderedMessage.content = '🚪🏃‍♀️💨 ' + parseMessage(message.content);
    renderedMessage.content = renderedMessage.content + '\n\n' + '-------------------------------End of the interaction-------------------------------';
    renderedMessage.role = 'system';
    return renderedMessage;
}

function parseMessages(messages: Message[]): Message[] {
    const renderedMessages_list: Message[][] = messages.map((message, index) => {
        return (index === 0 ? ChatParseInitialMessage(message) : 'Someone has left or the conversation is too long.' === message.content ? [ChatParseLastMessage(message), ] : [ChatParseNormalMessage(message),]);
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
        <><div className="relative mx-auto max-w-2xl px-4">
            {renderedMessages.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message} />
                    {/* {index < messages.length - 1 && (
    <Separator className="my-4 md:my-8" />
  )} */}
                </div>
            ))}
        </div><div className='h-[80px] w-full'> </div></>
    );
}

