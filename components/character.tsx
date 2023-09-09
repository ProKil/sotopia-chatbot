import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';

import agent1 from '../assets/avatars/female/01H5TNE5P8F9NJ2QK2YP5HPXKH.svg';
import agent2 from '../assets/avatars/male/01H5TNE5P83CZ1TDBVN74NGEEJ.svg';

export type Character = {
    pk: string;
    first_name: string;
    last_name: string;
    age: number;
    occupation: string;
    gender: string;
    gender_pronoun: string;
    public_info: string;
    big_five: string;
    moral_values: string[];
    schwartz_personal_values: string[];
    personality_and_values: string;
    decision_making_style: string;
    secret: string;
    model_id: string;
    mbti: string;
};

type Avatars = {
    [gender: string]: StaticImageData;
};

const avatars: Avatars = {
    'Samuel Anderson': agent1,
    'Zane Bennett': agent1,
    'William Brown': agent1,
    'Rafael Cortez': agent1,
    'Noah Davis': agent1,
    'Eli Dawson': agent1,
    'Miles Hawkins': agent1,
    'Hendrick Heinz': agent1,
    'Benjamin Jackson': agent1,
    'Ethan Johnson': agent1,
    'Liam Johnson': agent1,
    "Finnegan O'Malley": agent1,
    'Jaxon Prentice': agent1,
    'Donovan Reeves': agent1,
    'Micah Stevens': agent1,
    'Oliver Thompson': agent1,
    'Ethan Smith': agent1,
    'Oliver Smith': agent1,
    'Baxter Sterling': agent1,
    'Jasmine Blake': agent2,
    'Sophia Brown': agent2,
    'Mia Davis': agent2,
    'Naomi Fletcher': agent2,
    'Lena Goodwin': agent2,
    'Lily Greenberg': agent2,
    'Emily Harrison': agent2,
    'Amara Hartley': agent2,
    'Sophia James': agent2,
    'Ava Martinez': agent2,
    'Isabelle Martinez': agent2,
    'Gwen Pierce': agent2,
    'Sasha Ramirez': agent2,
    'Giselle Rousseau': agent2,
    'Mia Sanders': agent2,
    'Calista Sinclair': agent2,
    'Esmeralda Solis': agent2,
    'Ava Thompson': agent2,
    'Imelda Thorne': agent2,
    'Isabella White': agent2,
};

export const getAvatar = (agentInfo: string) => (
    <div>
        <Image priority src={avatars[agentInfo]} alt="Follow us on Twitter" />
    </div>
);

export const characterCard = (agent: Character) => (
    <div className="rounded-lg bg-white px-4 pb-4 pt-1 drop-shadow-md dark:bg-black dark:text-white">
        <div className="px-2 pb-2" data-testid="card">
            <div className="flex flex-row pt-2">
                <div className="relative h-[50px] w-[50px] rounded-md border-[1px] border-gray-400 shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {getAvatar(agent.gender)}
                    </div>
                </div>
                <div className="px-2">
                    <p className="text-left text-xl font-bold leading-6 text-gray-900">
                        {agent.first_name} {agent.last_name}
                    </p>
                    <p className="font-lg text-left font-extralight leading-6 text-gray-600">
                        {agent.occupation} · {agent.gender_pronoun} ·{' '}
                        {agent.age}
                    </p>
                </div>
            </div>
            <h3 className="flex pt-2">
                <span className="text-left font-light">
                    {agent.personality_and_values}
                </span>
            </h3>
            <h3 className="flex">
                <span className="text-left font-light">
                    {agent.decision_making_style}
                </span>
            </h3>
            <p className="text-left text-sm leading-6 text-gray-500 hover:text-gray-600">
                {agent.public_info}
            </p>
            <ul className="mt-3 divide-y rounded border-[1px] border-red-900 bg-red-100 py-1 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                <li className="flex px-3 py-2 text-sm">
                    <div className="flex-row flex-wrap">
                        <i className="fa-solid fa-lock fa-sm"></i>
                        <span className="ml-auto">
                            <span className="p-1 text-sm font-medium">
                                {agent.secret}
                            </span>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
);
