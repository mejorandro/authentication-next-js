import  { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import db from './db';
import { cookies } from 'next/headers';

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'sessions'
});

const lucia = new Lucia (adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production'
        }
    }
});

export async function createAuthSession(userId){
    const session = await lucia.createSession(userId, {});
    const sessionCokie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCokie.name, sessionCokie.value, sessionCokie.attributes);
}

export async function verifyAuth(){
    const sessionCookie = cookies().get(lucia.sessionCookieName);
    const emptySessionObj = {user: null, session: null} 


    if(!sessionCookie){
        return emptySessionObj;
    }

    const sessionId = sessionCookie.value;

    if(!sessionId){
        return emptySessionObj;
    }

    const result = await lucia.validateSession(sessionId);

    try {
        if (result.session && result.session.fresh){
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }

        if(!result.session){
            const sessionCokie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCokie.name,
                sessionCokie.value,
                sessionCokie.attributes
            );
        }
    } catch {}

    return result;
}