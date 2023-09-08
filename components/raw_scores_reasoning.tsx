import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import { rewards } from "./rewards";

function BeautifyJson(data: any) {
    // Custom function to format the JSON object
    const beautifyJson = (jsonObject: any) => {
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      return formattedJson.replace(/"([^"]+)":/g, (match, p1) => `"${p1}:`);
    };
  
    // Call the beautifyJson function and render the formatted JSON as a string
    const formattedString = beautifyJson(data);
  
    return <pre>{formattedString}</pre>;
  }

function RawScoresReasoning(scores: rewards, reasoning: string) { 
    const scores_string = BeautifyJson(scores);

    const lines = reasoning.split('\n');

    // Process each line to add bold tags to categories
    const processedLines = lines.map((line) => {
    // Check if the line contains a category (e.g., "believability")
    const categoryMatch = line.match(/^(.*?):/);
    if (categoryMatch) {
        const category = categoryMatch[1];
        // Replace the category name with bold tags
        line = line.replace(category, `**${category}**`);
    }
    return line;
    });

    // Join the lines back together to form the formatted text
    const formattedReasoning = processedLines.join('\n');
    return (
    <div>
       <div className="max-w-lg mx-auto p-2 pt-8">
        <details className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg" open>
          <summary className="text-lg leading-6 text-slate-900 bg-lime-200 p-2 rounded-md dark:text-white font-semibold select-none">
                  Raw Scores
          </summary>
          <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 flex-wrap">
                    <p>{scores_string}</p>
          </div>
        </details>
      </div>

        <div className="max-w-lg mx-auto px-2">
        <details className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg" open>
          <summary className="text-lg leading-6 text-slate-900 bg-teal-100 p-2 rounded-md dark:text-white font-semibold select-none">
                    Reasoning
          </summary>
          <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {formattedReasoning}
          </div>
        </details>
            </div>
    </div>
    )
}

export default RawScoresReasoning;