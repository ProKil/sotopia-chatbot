export interface ScenarioData {
    scenario: string;
    agent1: string;
    agent2: string;
    agent1Goal: string;
    agent2Goal: string;
    agent1Background: string;
    agent2Background: string;
}

export const parseScenarioData = (text: string): ScenarioData => {
    const scenarioData: ScenarioData = {
        scenario: '',
        agent1: '',
        agent2: '',
        agent1Goal: '',
        agent2Goal: '',
        agent1Background: '',
        agent2Background: '',
    };

    // Extracting "scenario"
    const scenarioMatch = text.match(
        /Scenario:\s*([\s\S]*?)(?=Participants:|$)/i,
    );
    if (scenarioMatch) {
        scenarioData.scenario = scenarioMatch[1].trim();
    }

    // Extracting "Participants" and their names
    const participantsMatch = text.match(
        /Participants:\s*(.+?)\s+and\s+(.+?)(?=\n|$)/i,
    );
    if (participantsMatch) {
        const participants = participantsMatch[0].trim().split(' and ');
        if (participants.length === 2) {
            scenarioData.agent1 = participants[0].split(':')[1].trim();
            scenarioData.agent2 = participants[1].trim();
        }
    }

    // Extracting "agent1Background" and "agent2Background"
    const regexAgent1Background = `${scenarioData.agent1}'s background:\\s*([\\s\\S]*?)(?=${scenarioData.agent2}'s background:|\\$)`;
    const regexAgent2Background = `${scenarioData.agent2}'s background:\\s*([\\s\\S]*?)(?=${scenarioData.agent1}'s goal:|\\$)`;

    const agent1BackgroundMatch = text.match(
        regexAgent1Background,
    );
    if (agent1BackgroundMatch) {
        const agent1Background = agent1BackgroundMatch[1].trim().split('\n');
        scenarioData.agent1Background = agent1Background[0].trim();
    }

    const agent2BackgroundMatch = text.match(
        regexAgent2Background,
    );
    if (agent2BackgroundMatch) {
        const agent2Background = agent2BackgroundMatch[1].trim().split('\n');
        scenarioData.agent2Background = agent2Background[0].trim();
    }

    // Extracting "agent1Goal" and "agent2Goal"
    console.log(text);
    console.log(scenarioData.agent2);
    const regexString = `(?<=${scenarioData.agent1}'s goal:)(.*?)(?=${scenarioData.agent2}'s goal:)`;
    const goalsMatch = text.match(new RegExp(regexString, 's'));
    if (goalsMatch) {
        const goals = goalsMatch[1].trim().split('\n');
        scenarioData.agent1Goal = goals.join(' \n').trim();
    }
    const regexString_2 = `(?<=${scenarioData.agent2}'s goal:)(.*?)(?=Conversation Starts:)`;
    const goalsMatch_2 = text.match(new RegExp(regexString_2, 's'));
    if (goalsMatch_2) {
        const goals_2 = goalsMatch_2[1].trim().split('\n');
        scenarioData.agent2Goal = goals_2.join(' \n').trim();
    }

    // Handle the case where there are two goals
    const text_list = text.split('\n\n\n');
    if (text_list.length > 1) {
        text = text_list[1];
        const regexString_2 = `${scenarioData.agent2}'s goal:\\s*([\\s\\S]*?)(?=Conversation Starts:|\\$)`;
        const goalsMatch_2 = text.match(new RegExp(regexString_2, 'i'));
        if (goalsMatch_2) {
            const goals_2 = goalsMatch_2[1].trim().split('\n');
            scenarioData.agent2Goal = goals_2[0].trim();
        }
    }

    return scenarioData;
};
