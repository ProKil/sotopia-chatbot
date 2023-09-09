export interface ScenarioData {
    scenario: string;
    agent1: string;
    agent2: string;
    agent1Goal: string;
    agent2Goal: string;
<<<<<<< HEAD
  }
  
export const parseScenarioData = (text: string): ScenarioData => {
    const scenarioData: ScenarioData = {
      scenario: '',
      agent1: '',
      agent2: '',
      agent1Goal: '',
      agent2Goal: '',
    };
    console.log(text)
  
    // Extracting "scenario"
    const scenarioMatch = text.match(/Scenario:\s*([\s\S]*?)(?=Participants:|$)/i);
    if (scenarioMatch) {
      scenarioData.scenario = scenarioMatch[1].trim();
    }
  
    // Extracting "Participants" and their names
    const participantsMatch = text.match(/Participants:\s*(.+?)\s+and\s+(.+?)(?=\n|$)/i);
    if (participantsMatch) {
      const participants = participantsMatch[0].trim().split(' and ');
      if (participants.length === 2) {
        scenarioData.agent1 = participants[0].split(":")[1].trim();
        scenarioData.agent2 = participants[1].trim();
      }
    }
  
=======
}

export const parseScenarioData = (text: string): ScenarioData => {
    const scenarioData: ScenarioData = {
        scenario: '',
        agent1: '',
        agent2: '',
        agent1Goal: '',
        agent2Goal: '',
    };
    console.log(text);

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

>>>>>>> main
    // Extracting "agent1Goal" and "agent2Goal"
    const regexString = `${scenarioData.agent1}'s goal:\\s*([\\s\\S]*?)(?=${scenarioData.agent2}'s goal:|\\$)`;
    const goalsMatch = text.match(new RegExp(regexString, 'i'));
    if (goalsMatch) {
<<<<<<< HEAD
      const goals = goalsMatch[1].trim().split('\n');
      scenarioData.agent1Goal = goals[0].trim();
    }
    text = text.split("\n\n\n")[1]
=======
        const goals = goalsMatch[1].trim().split('\n');
        scenarioData.agent1Goal = goals[0].trim();
    }
    text = text.split('\n\n\n')[1];
>>>>>>> main
    const regexString_2 = `${scenarioData.agent2}'s goal:\\s*([\\s\\S]*?)(?=Conversation Starts:|\\$)`;
    const goalsMatch_2 = text.match(new RegExp(regexString_2, 'i'));
    if (goalsMatch_2) {
        const goals_2 = goalsMatch_2[1].trim().split('\n');
        scenarioData.agent2Goal = goals_2[0].trim();
    }
<<<<<<< HEAD
  
    return scenarioData;
  };
=======

    return scenarioData;
};
>>>>>>> main
