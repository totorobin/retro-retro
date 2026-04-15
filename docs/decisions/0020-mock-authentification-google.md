# Mock de l'Authentification Google pour les Tests E2E

## Contexte

Les tests de bout en bout (E2E) nécessitent une authentification pour accéder à la plupart des fonctionnalités. L'utilisation du véritable flux Google OAuth2 est complexe à automatiser (2FA, captchas, dépendance externe) et instable dans un environnement CI.
Actuellement, des mocks sont directement présents dans le code de l'API (`apps/api/src/routes/index.ts`), ce qui pollue le code de production.

## Décision

Nous décidons de déplacer toute la logique de mock de l'authentification dans le projet de tests.
La solution repose sur l'utilisation d'un mécanisme de "Session Mocking" au niveau de l'API, activé uniquement en mode non-production :
1. Un middleware dans l'API écoute un cookie, un header ou un paramètre de requête `mock_user_id`.
2. Si présent, ce middleware restaure manuellement l'objet `req.session.passport.user` pour simuler un utilisateur connecté via Passport.
3. Côté tests, l'utilitaire `mockSession` injecte ce cookie `mock_user_id` dans le contexte Playwright pour les domaines du frontend et de l'API.
4. Le frontend transmet explicitement le `mock_user_id` en paramètre de requête lors de l'appel initial `/api/me` pour garantir la reconnaissance de la session malgré les restrictions Cross-Origin de `localhost` sur différents ports.

## Statut

- [x] Proposé 2026-04-15
- [x] Accepté 2026-04-15

## Conséquences

- Tests E2E plus rapides car ils évitent les redirections OAuth.
- Indépendance vis-à-vis des serveurs Google lors des tests.
- Support du Cross-Origin sur localhost (ports différents) via le passage explicite du paramètre de mock.

## Questions-Réponses

**Comment les tests connaissent-ils le `SESSION_SECRET` ?**

- Il doit être configuré dans les variables d'environnement du projet de tests, identique à celui de l'API.

**Est-ce que cela pollue l'API ?**

- Un middleware minimal est introduit, mais il est strictement restreint au mode `development`/`test` et n'a aucun effet en production. Cela est préférable à un code de callback OAuth truffé de conditions `if`.
