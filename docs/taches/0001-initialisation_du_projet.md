# Tâche 0001 — Initialisation du projet

## Objectif
Mettre en place le squelette technique complet du monorepo avant tout développement fonctionnel.

## Travaux à réaliser

### 1. Monorepo pnpm
- Créer le fichier `package.json` racine avec la configuration des workspaces pnpm
- Créer le fichier `pnpm-workspace.yaml` référençant `apps/*` et `libs/*`
- Ajouter un `tsconfig.base.json` racine avec les options TypeScript communes

### 2. Application frontend — `apps/webapp`
- Initialiser un projet Vue 3 avec Vite (`pnpm create vite`)
- Configurer TypeScript (`tsconfig.json`, `tsconfig.app.json`)
- Installer les dépendances : `vue`, `vue-router`, `pinia`, `vue-konva`, `konva`
- Créer la structure de dossiers : `src/components/`, `src/views/`, `src/stores/`, `src/router/`, `src/assets/`
- Configurer le port de développement sur `3000`

### 3. Application backend — `apps/api`
- Initialiser un projet Node.js avec Express et Socket.io
- Configurer TypeScript (`tsconfig.json`)
- Installer les dépendances : `express`, `socket.io`, `mongoose`, `passport`, `passport-google-oauth20`, `express-session`, `dotenv`
- Créer la structure en couches : `src/routes/`, `src/controllers/`, `src/services/`, `src/models/`, `src/middlewares/`
- Configurer le port sur `4000`
- Créer le fichier `.env.example` avec les variables requises : `PORT`, `MONGODB_URI`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CALLBACK_URL`

### 4. Librairie de types partagés — `libs/shared-types`
- Créer un package TypeScript pur (pas de bundler)
- Déclarer les interfaces principales : `User`, `Squad`, `Board`, `BoardElement`
- Typer les événements Socket.io (côté client et serveur)
- Configurer les exports dans `package.json` pour que les autres packages puissent l'importer via `@retro/shared-types`

### 5. Docker Compose — MongoDB
- Créer `docker-compose.yml` à la racine avec un service `mongodb` (image `mongo:7`)
- Exposer le port `27017`
- Persister les données via un volume nommé
- Documenter la commande de démarrage dans le `README.md`

### 6. Dev Container
- Créer `.devcontainer/devcontainer.json`
- Configurer l'image de base Node.js LTS
- Installer automatiquement pnpm
- Démarrer le service Docker Compose MongoDB au lancement
- Ajouter les extensions JetBrains / VS Code recommandées pour l'IA (GitHub Copilot, AI Assistant) et les outils du projet (ESLint, Prettier, Vue Language Features, TypeScript)

### 7. Projet de tests E2E — `tests/e2e`
- Créer le package `tests/e2e/` avec son `package.json`
- Installer les dépendances : `@cucumber/cucumber`, `@playwright/test`, `playwright`
- Créer la structure : `features/` (lien symbolique ou copie vers `docs/scenarios/`), `steps/`, `helpers/`
- Configurer `cucumber.js` (chemin des features, chemin des steps, navigateur Chromium headless)
- Implémenter `helpers/sessionMock.ts` — génère un cookie de session signé pour simuler un utilisateur authentifié sans passer par Google OAuth (ADR-0020)
- Implémenter `helpers/dbFixtures.ts` — fonctions de création/suppression de données de test (user, squad, board)
- Ajouter le script `pnpm test:e2e` dans le `package.json` racine
- Vérifier que `pnpm test:e2e` s'exécute sans erreur (0 scénario, 0 step — le framework tourne)

## Critères d'acceptation
- `pnpm install` à la racine installe toutes les dépendances sans erreur
- `pnpm --filter webapp dev` démarre le frontend sur http://localhost:3000
- `pnpm --filter api dev` démarre le backend sur http://localhost:4000
- `docker compose up -d` démarre MongoDB sans erreur
- Le package `@retro/shared-types` est importable depuis `webapp` et `api`
- `pnpm test:e2e` s'exécute sans erreur (infrastructure en place, aucun scénario échoué)
