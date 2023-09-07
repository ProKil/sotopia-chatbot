export type rewards = {
    believability: number;
    relationship: number;
    knowledge: number;
    secret: number;
    social_rules: number;
    financial_and_material_benefits: number;
    goal: number;
    overall_score: number;
}

export const rewardDiagram = ( 
    scores: rewards
) => (
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.believability}</div>
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.relationship}</div>
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.knowledge}</div>
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.secret}</div>
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.social_rules}</div>
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.financial_and_material_benefits}</div>
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
                            <div className="-translate-x-30 absolute -top-8 left-1/2 hidden transform rounded bg-black px-2 py-1 text-sm text-white group-hover:block">{scores.goal}</div>
                    </div>
                    </div>
                    <div className="ml-1 w-[30%] px-2">10</div>
                </div>
                </div>
            </div>
            </div>
);
        
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