'use client';

import * as React from 'react';
import { useInView } from 'react-intersection-observer';

import { useAtBottom } from '@/lib/hooks/use-at-bottom';

interface ChatScrollAnchorProps {
    trackVisibility?: boolean;
    setMessagesChangeTriggerScroll?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatScrollAnchor({ trackVisibility, setMessagesChangeTriggerScroll }: ChatScrollAnchorProps) {
    const isAtBottom = useAtBottom();
    const { ref, entry, inView } = useInView({
        trackVisibility,
        delay: 100,
        rootMargin: '0px 0px -150px 0px',
    });

    React.useEffect(() => {
        if (!isAtBottom && trackVisibility && !inView) {
            entry?.target.scrollIntoView({
                block: 'start',
            });
            if (setMessagesChangeTriggerScroll) {
                setMessagesChangeTriggerScroll(false);
            }
        }
    }, [inView, entry, isAtBottom, trackVisibility, setMessagesChangeTriggerScroll]);

    return <div ref={ref} className="h-px w-full" />;
}
