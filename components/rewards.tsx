export type Rewards = {
    believability: number;
    relationship: number;
    knowledge: number;
    secret: number;
    social_rules: number;
    financial_and_material_benefits: number;
    goal: number;
    overall_score: number;
};

type RewardProperties = {
    min: number;
    max: number;
    begin_color: string;
    end_color: string;
};

const RewardBar = ({
    label,
    value,
    min,
    max,
    begin_color,
    end_color
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    begin_color: string;
    end_color: string;
}) => (
    <div>
        <p className="small-caps">{label}</p>
        <div className="h-5 w-full p-1">
        <div className="flex h-full items-center">
            <div className="w-[10rem] px-2 text-right">{min}</div>
            <div
                style={{
                    width: "66rem",
                    background: `linear-gradient(to right, ${begin_color}, ${end_color})`
                }}
                className="relative h-full"
            >
            <div className="absolute left-0 top-0 h-full w-full">
                <div className="group relative">
                <div
                    className="absolute -top-1 h-6 w-1 bg-black"
                    style={{ left: `${((value - min) / (max - min)) * 100}%` }}
                >
                    <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                    {value}
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div className="w-[10rem] px-2">{max}</div>
        </div>
        </div>
    </div>
);

const defaultRewards: Rewards = {
    believability: 2,
    relationship: 3,
    knowledge: 2,
    secret: -2,
    social_rules: -8,
    financial_and_material_benefits: 4,
    goal: 2,
    overall_score: 3
};

const rewardProperties: Record<string, RewardProperties> = {
    believability: { min: 0, max: 10, begin_color: 'white', end_color: 'red' },
    relationship: { min: -5, max: 5, begin_color: 'blue', end_color: 'red' },
    knowledge: { min: 0, max: 10, begin_color: 'white', end_color: 'red' },
    secret: { min: -10, max: 0, begin_color: 'blue', end_color: 'white' },
    social_rules: { min: -10, max: 0, begin_color: 'blue', end_color: 'white' },
    financial_and_material_benefits: { min: -5, max: 5, begin_color: 'blue', end_color: 'red' },
    goal: { min: 0, max: 10, begin_color: 'white', end_color: 'red' }
};

export const rewardDiagram = ({ scores }: { scores?: Rewards }) => {
    const effectiveScores = { ...defaultRewards, ...scores };

    return (
        <div className="rounded-lg drop-shadow-md hover:bg-slate-300 bg-slate-200 px-4 pb-4 pt-1 dark:bg-black dark:text-white">
        <div className="flex-col">
            {Object.keys(effectiveScores).map((key, index) => {
            if (key === 'overall_score') return null;

            const { min, max, begin_color, end_color } = rewardProperties[key] || {};

            return (
                <RewardBar
                key={index}
                label={key}
                value={effectiveScores[key as keyof Rewards]}
                min={min}
                max={max}
                begin_color={begin_color}
                end_color={end_color}
                />
            );
            })}
        </div>
        </div>
    );
};




        
export interface ScoresCommentsData {
    terminated_reason: string;
    agent1_comment: string;
    agent2_comment: string;
  }
  
export const parseReasoning = (text: string): ScoresCommentsData => {
    const interactionData: ScoresCommentsData = {
        terminated_reason: '',
        agent1_comment: '',
        agent2_comment: '',
    };
    if (text === null) {
        // If text is null, return an empty ScoresCommentsData
        return interactionData;
      }
  
    // Extracting "terminated reason"
    const terminatedReasonMatch = text.match(/terminated reason:\s*([\s\S]*?)(?=\w+:|$)/i);
    if (terminatedReasonMatch) {
      interactionData.terminated_reason = terminatedReasonMatch[1].trim();
    }
  
    // Extracting "Agent 1's comment"
    const agent1CommentMatch = text.match(/Agent 1 comments:\s*([\s\S]*?)(?=Agent 2 comments:|$)/i);
    if (agent1CommentMatch) {
      interactionData.agent1_comment = agent1CommentMatch[1].trim();
    }
  
    // Extracting "Agent 2' comment"
    const agent2CommentMatch = text.match(/Agent 2 comments:\s*([\s\S]*?)(?=$)/i);
    if (agent2CommentMatch) {
      interactionData.agent2_comment = agent2CommentMatch[1].trim();
    }
  
    return interactionData;
  };