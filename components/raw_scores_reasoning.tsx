<<<<<<< HEAD
import { rewards } from "./rewards";
=======
import { rewards } from './rewards';
>>>>>>> main

function BeautifyJson(data: any) {
    // Custom function to format the JSON object
    const beautifyJson = (jsonObject: any) => {
<<<<<<< HEAD
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      return formattedJson.replace(/"([^"]+)":/g, (match, p1) => `"${p1}:`);
    };
  
    // Call the beautifyJson function and render the formatted JSON as a string
    const formattedString = beautifyJson(data);
  
    return <pre>{formattedString}</pre>;
  }

function RawScoresReasoning(scores: rewards, reasoning: string) { 
=======
        const formattedJson = JSON.stringify(jsonObject, null, 2);
        return formattedJson.replace(/"([^"]+)":/g, (match, p1) => `"${p1}:`);
    };

    // Call the beautifyJson function and render the formatted JSON as a string
    const formattedString = beautifyJson(data);

    return <pre>{formattedString}</pre>;
}

function RawScoresReasoning(scores: rewards, reasoning: string) {
>>>>>>> main
    const scores_string = BeautifyJson(scores);

    const lines = reasoning.split('\n');

    // Process each line to add bold tags to categories
    const processedLines = lines.map((line) => {
<<<<<<< HEAD
    // Check if the line contains a category (e.g., "believability")
    const categoryMatch = line.match(/^(.*?):/);
    if (categoryMatch) {
        const category = categoryMatch[1];
        // Replace the category name with bold tags
        line = line.replace(category, `**${category}**`);
    }
    return line;
=======
        // Check if the line contains a category (e.g., "believability")
        const categoryMatch = line.match(/^(.*?):/);
        if (categoryMatch) {
            const category = categoryMatch[1];
            // Replace the category name with bold tags
            line = line.replace(category, `**${category}**`);
        }
        return line;
>>>>>>> main
    });

    // Join the lines back together to form the formatted text
    const formattedReasoning = processedLines.join('\n');
    return (
<<<<<<< HEAD
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
=======
        <div>
            <div className="mx-auto max-w-lg p-2 pt-8">
                <details
                    className="rounded-lg p-6 open:bg-white open:shadow-lg open:ring-1 open:ring-black/5 dark:open:bg-slate-900 dark:open:ring-white/10"
                    open
                >
                    <summary className="select-none rounded-md bg-lime-200 p-2 text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                        Raw Scores
                    </summary>
                    <div className="mt-3 flex-wrap text-sm leading-6 text-slate-600 dark:text-slate-400">
                        <p>{scores_string}</p>
                    </div>
                </details>
            </div>

            <div className="mx-auto max-w-lg px-2">
                <details
                    className="rounded-lg p-6 open:bg-white open:shadow-lg open:ring-1 open:ring-black/5 dark:open:bg-slate-900 dark:open:ring-white/10"
                    open
                >
                    <summary className="select-none rounded-md bg-teal-100 p-2 text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                        Reasoning
                    </summary>
                    <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {formattedReasoning}
                    </div>
                </details>
            </div>
        </div>
    );
}

export default RawScoresReasoning;
>>>>>>> main
