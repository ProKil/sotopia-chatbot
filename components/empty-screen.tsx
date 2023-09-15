import { UseChatHelpers } from 'ai/react';
import { Dispatch, SetStateAction } from 'react';

import { ExternalLink } from '@/components/external-link';
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';

export interface EmptyScreenProps {
    setSessionIdDialog: Dispatch<SetStateAction<boolean>>;
}

export function EmptyScreen( { setSessionIdDialog }: EmptyScreenProps) {
    return (
        <>
        <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-4xl font-thin">
                    Sotopia,
                    <pre className='text-right font-sans text-base font-normal'>a social AI experiment by Carnegie Mellon University</pre>
                </h1>
                <p className="prose-sm mb-2 leading-relaxed">
                You are invited to participate in a research study aiming to study realistic
                social interactions across contexts between AI agents and humans.
                This research is dedicated to bridging the gap between technology and humanlike
                collabarotive interactions, ultimately paving the way for more
                proficient and pro-social AI.

                <br />
                You will engage in an interaction with another agent, following a provided social scenario, goals, and potential character profiles.
                You will be taking on the role of a specific character for this interaction, rather than responding as yourself.
                
                <br />
                You must be at least 18 years old. Participation is voluntary.
                You may discontinue participation at any time during the research activity.
                
                <br />
                <br />
                <i>Confidentiality</i>: The study will collect your research data, and the data collected in this study will be made unidentifiable to the best of our extent. We will securely store the data on our servers and only share with qualified researchers. If you later decide that you do not want your responses included in this study, please email so we can exclude your work.
                
                <br />
                <br />
                <i>Contact</i>: If you have any questions about this study, desire additional information, or wish to withdraw your participation please contact us. If you have questions pertaining to your rights as a research participant; or to report concerns to this study, you should contact the Office of Research Integrity and Compliance at Carnegie Mellon University, referencing study number STUDY2023_00000299. Email: irb-review@andrew.cmu.edu. Phone: 412-268-4721.
                </p>


                    <p className='prose-sm mb-2 leading-relaxed bg-lime-200 dark:bg-slate-800 rounded-md drop-shadow-md px-1'>
                        Note that this is only a <em>pilot</em> study and we look forward to your feedback. The study is best experienced on a desktop or laptop computer.
                    </p> 
                <div className="text-center">
                <Button  variant="link" onClick={()=>{window.print();}}>Print a copy of this consent form for your records.</Button> 
                </div>
                <div className='text-center'>
                <Button variant="default" onClick={() => {setSessionIdDialog(true);}}>I am ready to start.</Button> 
                </div>    
            </div>
        </div>
        </>
    );
}
