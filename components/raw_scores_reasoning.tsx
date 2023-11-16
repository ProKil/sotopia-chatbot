import { rewards } from './rewards';

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
            <div className="mx-auto max-w-lg p-2 pt-8">
                <details
                    className="rounded-lg p-6 open:bg-white open:shadow-lg open:ring-1 open:ring-black/5 dark:open:bg-slate-900 dark:open:ring-white/10"
                >
                    <summary className="select-none rounded-md bg-lime-200 p-2 text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                        Raw Scores
                    </summary>
                    <div className="mt-3 flex-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {scores_string}
                    </div>
                </details>
            </div>

            <div className="mx-auto max-w-lg px-2">
                <details
                    className="rounded-lg p-6 open:bg-white open:shadow-lg open:ring-1 open:ring-black/5 dark:open:bg-slate-900 dark:open:ring-white/10"
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
