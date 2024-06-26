import CardHeader from '@mui/material/CardHeader';
import Image, { StaticImageData } from 'next/image';

import CollapsibleCard from './ui/collapsible-card';


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
}

import agent21 from '../assets/avatars/female/avatar-svgrepo-com_1_blue.svg';
import agent31 from '../assets/avatars/female/avatar-svgrepo-com_1_green.svg';
import agent22 from '../assets/avatars/female/avatar-svgrepo-com_2_blue.svg';
import agent32 from '../assets/avatars/female/avatar-svgrepo-com_2_green.svg';
import agent23 from '../assets/avatars/female/avatar-svgrepo-com_3_blue.svg';
import agent33 from '../assets/avatars/female/avatar-svgrepo-com_3_green.svg';
import agent24 from '../assets/avatars/female/avatar-svgrepo-com_4_blue.svg';
import agent34 from '../assets/avatars/female/avatar-svgrepo-com_4_green.svg';
import agent25 from '../assets/avatars/female/avatar-svgrepo-com_5_blue.svg';
import agent35 from '../assets/avatars/female/avatar-svgrepo-com_5_green.svg';
import agent26 from '../assets/avatars/female/avatar-svgrepo-com_6_blue.svg';
import agent36 from '../assets/avatars/female/avatar-svgrepo-com_6_green.svg';
import agent27 from '../assets/avatars/female/avatar-svgrepo-com_7_blue.svg';
import agent37 from '../assets/avatars/female/avatar-svgrepo-com_7_green.svg';
import agent28 from '../assets/avatars/female/avatar-svgrepo-com_8_blue.svg';
import agent38 from '../assets/avatars/female/avatar-svgrepo-com_8_green.svg';
import agent29 from '../assets/avatars/female/avatar-svgrepo-com_9_blue.svg';
import agent39 from '../assets/avatars/female/avatar-svgrepo-com_9_green.svg';
import agent30 from '../assets/avatars/female/avatar-svgrepo-com_10_blue.svg';
import agent40 from '../assets/avatars/female/avatar-svgrepo-com_10_green.svg';
import agent1 from '../assets/avatars/male/avatar-svgrepo-com_1_blue.svg';
import agent9 from '../assets/avatars/male/avatar-svgrepo-com_1_green.svg';
import agent17 from '../assets/avatars/male/avatar-svgrepo-com_1_purple.svg';
import agent2 from '../assets/avatars/male/avatar-svgrepo-com_2_blue.svg';
import agent10 from '../assets/avatars/male/avatar-svgrepo-com_2_green.svg';
import agent18 from '../assets/avatars/male/avatar-svgrepo-com_2_purple.svg';
import agent3 from '../assets/avatars/male/avatar-svgrepo-com_3_blue.svg';
import agent11 from '../assets/avatars/male/avatar-svgrepo-com_3_green.svg';
import agent19 from '../assets/avatars/male/avatar-svgrepo-com_3_purple.svg';
import agent4 from '../assets/avatars/male/avatar-svgrepo-com_4_blue.svg';
import agent12 from '../assets/avatars/male/avatar-svgrepo-com_4_green.svg';
import agent20 from '../assets/avatars/male/avatar-svgrepo-com_4_purple.svg';
import agent5 from '../assets/avatars/male/avatar-svgrepo-com_5_blue.svg';
import agent13 from '../assets/avatars/male/avatar-svgrepo-com_5_green.svg';
import agent6 from '../assets/avatars/male/avatar-svgrepo-com_6_blue.svg';
import agent14 from '../assets/avatars/male/avatar-svgrepo-com_6_green.svg';
import agent7 from '../assets/avatars/male/avatar-svgrepo-com_7_blue.svg';
import agent15 from '../assets/avatars/male/avatar-svgrepo-com_7_green.svg';
import agent8 from '../assets/avatars/male/avatar-svgrepo-com_8_blue.svg';
import agent16 from '../assets/avatars/male/avatar-svgrepo-com_8_green.svg';

type Avatars = {
  [gender: string]: StaticImageData;
};

const avatars: Avatars = {
  'Samuel Anderson': agent1,
  'Zane Bennett': agent2,
  'William Brown': agent3,
  'Rafael Cortez': agent4,
  'Noah Davis': agent5,
  'Eli Dawson': agent6,
  'Miles Hawkins': agent7,
  'Hendrick Heinz': agent8,
  'Benjamin Jackson': agent9,
  'Ethan Johnson': agent10,
  'Liam Johnson': agent11,
  'Leo Williams': agent12,
  "Finnegan O'Malley": agent20,
  'Jaxon Prentice': agent13,
  'Donovan Reeves': agent14,
  'Micah Stevens': agent15,
  'Oliver Thompson': agent16,
  'Ethan Smith': agent17,
  'Oliver Smith': agent18,
  'Baxter Sterling': agent19,
  'Jasmine Blake': agent40,
  'Sophia Brown': agent21,
  'Mia Davis': agent22,
  'Naomi Fletcher': agent23,
  'Lena Goodwin': agent24,
  'Lily Greenberg': agent25,
  'Emily Harrison': agent26,
  'Amara Hartley': agent27,
  'Sophia James': agent28,
  'Ava Martinez': agent29,
  'Isabelle Martinez': agent30,
  'Gwen Pierce': agent31,
  'Sasha Ramirez': agent32,
  'Giselle Rousseau': agent33,
  'Mia Sanders': agent34,
  'Calista Sinclair': agent35,
  'Esmeralda Solis': agent36,
  'Ava Thompson': agent37,
  'Imelda Thorne': agent38,
  'Isabella White': agent39,
};

// export const getAvatar = (agentInfo: string) => (
//   <div>
//     <Image
//       priority
//       src={avatars[agentInfo]}
//       alt="Follow us on Twitter"
//     />
//   </div>
// );

interface AgentAvatorProps {
  agentName: string;
  width?: number;
  height?: number;
}

export function AgentAvator({ agentName, width = 100, height = 100 }: AgentAvatorProps) {
  // Your logic to generate the SVG based on agentName
  // Example return statement with Next.js Image component:
  return (
    agentName === '' ?
      <Image
        src={avatars['Samuel Anderson']}
        alt="Agent Avatar"
        width={width} // Set the desired width (default: 100)
        height={height} // Set the desired height (default: 100)
      /> :
    <Image
      src={avatars[agentName]}
      alt="Agent Avatar"
      width={width} // Set the desired width (default: 100)
      height={height} // Set the desired height (default: 100)
    />
  );
}


interface CharacterCardProps {
  agent: Character;
}

export default function CharacterCard({ agent }: CharacterCardProps) {
  return (
    <>
    <CollapsibleCard
      cardHeader={<>
        <CardHeader sx={{ pb: 0 }}
        avatar={<div className="relative h-[50px] w-[50px] rounded-md border-[1px] border-gray-400 shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <AgentAvator agentName={agent.first_name + ' ' + agent.last_name} />
          </div>
        </div>}
        title={<p className="text-left text-xl font-bold leading-6 text-gray-900">{agent.first_name} {agent.last_name}</p>}
        subheader={<p className="font-lg text-left text-lg font-extralight leading-6 text-gray-600">
          {agent.occupation} · {agent.gender_pronoun} · {agent.age}
        </p>}/></>}
        cardContent={
          <><h3 className="flex pt-0">
            <span className="text-left font-light">{agent.personality_and_values}</span>
          </h3><h3 className="flex">
              <span className="text-left font-light">{agent.decision_making_style}</span>
            </h3><p className="text-left text-sm leading-6 text-gray-500 hover:text-gray-600">{agent.public_info}</p><ul className="mt-3 divide-y rounded border-[1px] border-red-900 bg-red-100 py-1 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
              <li className="flex px-3 py-2 text-sm">
                <div className="flex-row flex-wrap">
                  <i className="fa-solid fa-lock fa-sm"></i>
                  <span className="ml-auto">
                    <span className="p-1 text-sm font-medium">{agent.secret}</span>
                  </span>
                </div>
              </li>
            </ul></>
        }
      /> </>
  );
}
