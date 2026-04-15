import { sign } from 'cookie-signature';
import { Page } from 'playwright';

/**
 * Simule une session utilisateur pour les tests E2E via un cookie de mock.
 * L'API reconnaît ce cookie en mode non-production pour restaurer la session.
 * @param page L'objet Page de Playwright.
 * @param userId L'ID de l'utilisateur à mocker.
 */
export async function mockSession(page: Page, userId: string, webUrl: string = 'http://localhost:3000') {
    // Injecter le cookie de mock reconnu par l'API
    // Playwright nécessite une URL complète pour l'injection via url
    await page.context().addCookies([
        {
            name: 'mock_user_id',
            value: userId,
            url: webUrl,
            httpOnly: false,
            secure: false,
            sameSite: 'Lax'
        },
        {
            name: 'mock_user_id',
            value: userId,
            url: 'http://localhost:4000',
            httpOnly: false,
            secure: false,
            sameSite: 'Lax'
        }
    ]);
}
