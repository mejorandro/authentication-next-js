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
    const sessionCokie = lucia.createBlankSessionCookie(session.id);
    cookies().set(sessionCokie.name, sessionCokie.value, sessionCokie.attributes);
}