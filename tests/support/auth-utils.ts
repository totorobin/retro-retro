import { sign } from 'cookie-signature';
import { Page } from 'playwright';
import { MongoClient } from 'mongodb';

/**
 * Simule une session utilisateur pour les tests E2E.
 * Crée une session directement dans MongoDB et injecte le cookie signé.
 */
export async function mockSession(page: Page, userId: string, webUrl: string = 'http://localhost:3000') {
    const sessionSecret = process.env.SESSION_SECRET || 'retro-secret';
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/retro-retro';
    
    // 1. Créer l'objet session au format express-session/passport
    const sessionId = `test-session-${Math.random().toString(36).substring(7)}`;
    const sessionData = {
        cookie: {
            originalMaxAge: 24 * 60 * 60 * 1000,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            path: "/",
            sameSite: 'lax'
        },
        passport: {
            user: userId
        }
    };

    // 2. Insérer directement dans MongoDB
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db();
        await db.collection('sessions').updateOne(
            { _id: sessionId as any },
            { $set: { session: JSON.stringify(sessionData), expires: sessionData.cookie.expires } },
            { upsert: true }
        );
    } finally {
        await client.close();
    }

    // 3. Signer le cookie (format express-session 's:{signed_value}')
    const signedCookie = 's:' + sign(sessionId, sessionSecret);

    // 4. Injecter le cookie dans le navigateur
    await page.context().addCookies([
        {
            name: 'connect.sid',
            value: signedCookie,
            url: webUrl,
            httpOnly: true,
            sameSite: 'Lax'
        }
    ]);
}
