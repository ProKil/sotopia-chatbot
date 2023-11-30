'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconExternalLink } from '@/components/ui/icons';


export type ChatFeatureOptions = {
    scenarioList: string[];
    agentList: string[];
    agentList2: string[];
};

export const chatFeatureOptionsExamples: ChatFeatureOptions = {
    scenarioList: ['Scenario 1', 'Scenario 2', 'Scenario 3', 'Scenario 4', 
    'Scenario 5', 'Scenario 6', 'Scenario 7', 'Scenario 8', 'Scenario 9'], 
    // need to change to get all scenarios

    agentList: ['GPT-4', 'GPT-3.5', 'LLaMa-2', 'Human'],
    agentList2: ['GPT-4', 'GPT-3.5', 'LLaMa-2', 'Human'],
};

export interface ChatFeatureMenuProps {
    chatFeatureOptions?: ChatFeatureOptions;
}

interface FeatureDropdownListProps {
    buttonLabels: {
        scenarioButtonLabel: string;
        agentButtonLabel: string;
        agentButtonLabel2: string;
    };
    chatFeatureOptions: {
        scenarioList: string[];
        agentList: string[];
        agentList2: string[];
    };
    handleChoiceClick: (choice: string, labelType: string) => void;
}

const FeatureDropdownList: React.FC<FeatureDropdownListProps> = ({ buttonLabels, chatFeatureOptions, handleChoiceClick }) => {
    return (
        <div className="flex justify-between space-x-8 px-10"> {/* Flex container for dropdowns */}
            <div>
                <label className="block text-sm font-medium leading-6">Select a scenario</label>
                <div className="relative mt-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="relative flex h-[35px] w-[200px] items-center gap-x-1.5 rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 hover:bg-accent hover:text-accent-foreground dark:text-white dark:ring-white">
                                <div className="grow text-left">
                                    {buttonLabels.scenarioButtonLabel}
                                </div>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            sideOffset={8}
                            align="start"
                            className="focus:outline-none] absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                            <div className="max-h-40 overflow-y-auto"> 
                            {chatFeatureOptions.scenarioList.map((choice, index) => (
                                <DropdownMenuItem key={index} className="flex-col items-start" onClick={() => handleChoiceClick(choice, 'scenarioButtonLabel')}>
                                    <div className="text-sm font-medium">{choice}</div>
                                </DropdownMenuItem>
                            ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium leading-6">Select the 1st agent</label>
                <div className="relative mt-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="relative flex h-[35px] w-[200px] items-center gap-x-1.5 rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 hover:bg-accent hover:text-accent-foreground dark:text-white dark:ring-white">
                                <div className="grow text-left">
                                    {buttonLabels.agentButtonLabel}
                                </div>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            sideOffset={8}
                            align="start"
                            className="focus:outline-none] absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                            {chatFeatureOptions.agentList.map((choice, index) => (
                                <DropdownMenuItem key={index} className="flex-col items-start" onClick={() => handleChoiceClick(choice, 'agentButtonLabel')}>
                                    <div className="text-sm font-medium">{choice}</div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium leading-6">Select the 2nd agent</label>
                <div className="relative mt-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="relative flex h-[35px] w-[200px] items-center gap-x-1.5 rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 hover:bg-accent hover:text-accent-foreground dark:text-white dark:ring-white">
                                <div className="grow text-left">
                                    {buttonLabels.agentButtonLabel2}
                                </div>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            sideOffset={8}
                            align="start"
                            className="focus:outline-none] absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                            {chatFeatureOptions.agentList2.map((choice, index) => (
                                <DropdownMenuItem key={index} className="flex-col items-start" onClick={() => handleChoiceClick(choice, 'agentButtonLabel2')}>
                                    <div className="text-sm font-medium">{choice}</div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};


export function ChatFeatureMenu({ chatFeatureOptions }: ChatFeatureMenuProps) {
    chatFeatureOptions = chatFeatureOptionsExamples;

    const [buttonLabels, setButtonLabels] = useState<{
        scenarioButtonLabel: string;
        agentButtonLabel: string;
        agentButtonLabel2: string;
    }>({
        scenarioButtonLabel: chatFeatureOptionsExamples.scenarioList[0],
        agentButtonLabel: chatFeatureOptionsExamples.agentList[0],
        agentButtonLabel2: chatFeatureOptionsExamples.agentList2[0],
    });

    const handleChoiceClick = (choice: string, optionType: string) => {
        setButtonLabels((prevLabels) => ({
            ...prevLabels,
            [optionType]: choice,
        }));
    };

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitClick = () => {
        
        const redirectURL = 'http://localhost:3000/render/01H99V82GR0V38B08K794D0JJ6';
        console.log(`Selected scenario: ${buttonLabels.scenarioButtonLabel}. Selected 1st agent: ${buttonLabels.agentButtonLabel}.Selected 2nd agent: ${buttonLabels.agentButtonLabel2}.`);
        // TODO: submit
        setIsSubmitted(true);

        window.location.href = redirectURL;

    };

    return (
        <div className="flex items-center justify-between">
            <div className="mx-auto max-w-6xl px-4">
                <div className="rounded-lg border bg-background p-8"> {/* Outer container */}
                    {isSubmitted ? (
                        <div>
                            <p>Your selected scenario is {buttonLabels.scenarioButtonLabel}</p>
                            <p>Your selected 1st agent is {buttonLabels.agentButtonLabel}</p>
                            <p>Your selected 2nd agent is {buttonLabels.agentButtonLabel2}</p>
                        </div>
                    ) : (
                        <FeatureDropdownList
                            buttonLabels={buttonLabels}
                            chatFeatureOptions={chatFeatureOptions}
                            handleChoiceClick={handleChoiceClick}
                        />
                    )}

                    {/* New container div for centering the submit button */}
                    <div className="mt-4 flex justify-center">
                        {/* Submit button right below the dropdowns */}
                        {!isSubmitted && (<button
                            onClick={handleSubmitClick}
                            className="mx-auto mt-4 h-[35px] w-[100px] rounded-md bg-blue-500 text-sm font-semibold text-white"
                        >
                            Submit
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};