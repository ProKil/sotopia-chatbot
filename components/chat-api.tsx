'use server';

import { Session } from 'next-auth/types';

import { MessageTransaction } from './sotopia-types';

const API_URL = process.env.SOTOPIA_SERVER_URL;

export async function getSession(sessId: string): Promise<MessageTransaction[]> {
    if (sessId === '') {
        return [];
    }
    const response: Response = await fetch(
        `${ API_URL}/get/${ sessId}`, 
        { method: 'GET', cache: 'no-store' },
    );
    const session: MessageTransaction[] = await response.json();
    return session;
}

export async function connectSession(sessId: string, senderId: string): Promise<MessageTransaction[]> {
    let session: MessageTransaction[] = [];
    while (1) {
        const response: Response = await fetch(
            `${API_URL}/connect/${sessId}/client/${senderId}`,
            { method: 'POST', cache: 'no-store' },
        );
        session = await response.json();
        if (response.status === 200) {
            break;
        }
        await new Promise(f => setTimeout(f, 500));
    }
    return session;
}

export async function sendMessageToSession(sessId: string, senderId: string, message: string): Promise<MessageTransaction[]> {
    console.log('sending message to sessionnnnnnnnnnnnnnnnnnn ' + sessId);
    const response: Response = await fetch(
        `${ API_URL}/send/${ sessId}/${ senderId}`, 
        { method: 'POST', cache: 'no-store', body: message },
    );
    const session: MessageTransaction[] = await response.json();
    console.log('sent message to sessionnnnnnnnnnnnnnnn ' + sessId);
    return session;
}

export async function getClientLock(sessId: string): Promise<string> {
    if (sessId === '') {
        return 'no action';
    }
    const response: Response = await fetch(
        `${ API_URL}/get_lock/${ sessId}`, 
        { method: 'GET', cache: 'no-store' },
    );
    const lock: string = await response.json();
    return lock;
}

export async function fetchWaitingRoomData(session:Session): Promise<string> {
        const response = await fetch(`${API_URL}/enter_waiting_room/${session?.user?.email}`, {
            method: 'GET',
            cache: 'no-store'
        });
    return response.json();
}