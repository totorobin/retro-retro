# Tâche 0002 — Connexion Google OAuth2

## Objectif
Mettre en place l'authentification complète via Google OAuth2 : flux de connexion, création automatique de compte, gestion des sessions, protection des routes.

## Prérequis
- Tâche 0001 (initialisation) terminée
- Credentials Google OAuth configurés (voir `docs/guides/google-oauth-setup.md`)

## Travaux à réaliser

### 1. Backend — Passport Google OAuth2
- Configurer la stratégie `passport-google-oauth20` avec les scopes `profile` et `email`
- Implémenter le callback : chercher l'utilisateur par `googleId` ; si absent, créer le compte automatiquement avec nom, prénom, email et photo de profil
- Sérialiser/désérialiser l'utilisateur dans la session Express (`express-session` + store MongoDB)
- Variables d'environnement requises : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CALLBACK_URL`, `SESSION_SECRET`

### 2. Routes d'authentification
- `GET /auth/google` — redirige vers la page de consentement Google
- `GET /auth/google/callback` — callback OAuth ; redirige vers l'application après succès
- `POST /auth/logout` — détruit la session et redirige vers la page de connexion
- `GET /api/me` — retourne l'utilisateur courant (utilisé par le frontend pour vérifier la session)

### 3. Middleware de protection des routes
- Créer un middleware `requireAuth` qui vérifie `req.isAuthenticated()`
- Appliquer ce middleware à toutes les routes `/api/*` et `/board/*`
- En cas d'échec, retourner `401` sur les routes API

### 4. Modèle Mongoose — `User`
- Champs : `googleId` (unique), `email`, `firstName`, `lastName`, `avatarUrl`, `createdAt`

### 5. Frontend — Page de connexion
- Créer la vue `LoginView.vue` accessible sur `/login`
- Afficher le bouton "Se connecter avec Google" (lien vers `GET /auth/google`)
- Après connexion réussie, le backend redirige vers `/` (Vue Router prend le relais)

### 6. Frontend — Store d'authentification
- `useAuthStore` : stocker `currentUser` (null si non connecté)
- Action `fetchCurrentUser` : appel à `GET /api/me` au démarrage de l'application
- Action `logout` : appel à `POST /auth/logout` puis reset du store

### 7. Navigation guard Vue Router
- Guard global `beforeEach` : si la route requiert l'authentification et que `currentUser` est null, rediriger vers `/login`

### 8. Logique d'arrivée par URL
- Après connexion, analyser l'URL d'origine :
  - URL avec `squadId` → rejoindre la squad et aller sur sa page d'accueil
  - URL avec `boardId` → rejoindre la squad propriétaire et aller sur le board
  - URL sans paramètre → afficher la page "Rejoindre ou créer une Squad"

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/auth.steps.ts` — couvre `docs/scenarios/auth.feature`
- "je suis sur la page de connexion" → naviguer vers `/login`
- "je choisis de me connecter avec mon compte Google" → injecter le cookie mock session via `helpers/sessionMock.ts` (ADR-0020 : pas de vrai OAuth dans les tests)
- "un compte est créé automatiquement" → vérifier l'existence du document User en base via `helpers/dbFixtures.ts`
- "je suis redirigé vers l'invitation à rejoindre ou créer une Squad" → vérifier l'URL `/onboarding`
- "je suis connecté avec succès à mon compte existant" → vérifier que `GET /api/me` retourne l'utilisateur attendu
- "ma session est fermée" → vérifier la redirection vers `/login` et que `GET /api/me` retourne 401

## Critères d'acceptation
- Un nouvel utilisateur est créé en base lors de son premier accès
- Un utilisateur existant se reconnecte sans créer de doublon
- La déconnexion ferme la session et redirige vers `/login`
- Les routes protégées retournent `401` sans session valide
- Le frontend redirige vers `/login` si la session a expiré
- Les 3 scénarios du fichier `auth.feature` passent en vert
