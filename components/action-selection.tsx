import { type Message } from 'ai';
import { Ban, Hand, Meh, Mic, PhoneOff } from 'lucide-react';

import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';


export interface ActionSelectionProps {
    setActionType: (s: string) => void;
    actionType: string;
}

export function ActionSelection({ setActionType, actionType, ...props }: ActionSelectionProps) {    
    return <RadioGroup value={actionType} onValueChange={setActionType} className="grid grid-cols-6 gap-4">
    <div className='col-span-2'>
        <RadioGroupItem value="action" id="action" className="peer sr-only" />
        <Label
        htmlFor="action"
        className="h-15 col-span-2 flex  flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
        <Hand className="mb-3 h-4 w-4" />
        Do something
        </Label>
    </div>
    <div className='col-span-2'>
    <RadioGroupItem
        value="speak"
        id="speak"
        className="peer sr-only"
        />
        <Label
        htmlFor="speak"
        className="h-15 col-span-2 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
        <Mic className="mb-3 h-4 w-4" />
        Say something
        </Label>
    </div>
    <div className='col-span-2'>
    <RadioGroupItem
        value="non-verbal communication"
        id="nvc"
        className="peer sr-only"
        />
        <Label
        htmlFor="nvc"
        className="h-15 col-span-2 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
        <Meh className="mb-3 h-4 w-4" />
        Express Non-Verbally
        </Label>
    </div>
    <div className='col-span-3'>
    <RadioGroupItem
        value="none"
        id="none"
        className="peer sr-only"
        />
        <Label
        htmlFor="none"
        className="w-30 col-span-3 flex h-10 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
        <div className="flex flex-row content-center items-center gap-2">
        <Ban className="my-1 h-4 w-4"/> No action
        </div>
        </Label>
    </div>
    <div className='col-span-3'>
    <RadioGroupItem
        value="leave"
        id="leave"
        className="peer sr-only"
        />
        <Label
        htmlFor="leave"
        className="w-30 col-span-3 flex h-10 flex-col content-center items-center justify-between rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
        <div className="flex flex-row content-center items-center gap-2">
        <PhoneOff className="my-1 h-4 w-4"/> Leave
        </div>
        </Label>
    </div>
    </RadioGroup>;
}