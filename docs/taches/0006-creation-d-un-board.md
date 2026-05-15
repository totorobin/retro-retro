# Tâche 0006 — Création d'un board

## Objectif
Permettre à un membre d'une squad de créer un board, d'y accéder et de voir la liste des boards mise à jour sur la page d'accueil.

## Prérequis
- Tâche 0004 (page d'accueil) terminée
- Tâche 0002 (connexion Google) terminée

## Travaux à réaliser

### 1. Modèle Mongoose — `Board`
- Champs : `title` (String, required), `squadId` (ObjectId ref Squad), `ownerId` (ObjectId ref User), `mode` (enum : `creation` | `presentation`, défaut : `creation`), `elements` (tableau d'ObjectId ref BoardElement), `createdAt`, `updatedAt`

### 2. API backend
- `POST /api/boards` — crée un nouveau board ; body : `{ title, squadId }` ; retourne le board créé
- `GET /api/boards/:boardId` — retourne le board avec ses éléments (utilisé à l'ouverture)
- Appliquer le middleware `requireAuth` sur ces routes

### 3. Rejoindre un board via Socket.io
- Événement `board:join` — le client envoie `{ boardId }` ; le serveur ajoute le socket à la room du board
- Événement `board:leave` — quitter la room proprement lors de la déconnexion ou du retour à l'accueil

### 4. Vue Board — `BoardView.vue`
- Créer la route `/board/:boardId` dans Vue Router
- Charger les données du board via `GET /api/boards/:boardId` à l'ouverture
- Rejoindre la room Socket.io `board:join` à l'ouverture
- Afficher la structure de base du board :
  - Entête (menu burger + titre + switch mode — uniquement visible par le propriétaire)
  - Barre d'outils gauche (vide pour l'instant, sera remplie dans les tâches suivantes)
  - Zone canvas centrale (Konva Stage vide)
  - Liste des participants en haut à droite
  - Mini-map en bas à droite (placeholder)

### 5. Store Pinia — `useBoardStore`
- État : `board` (données du board), `mode` (`creation` | `presentation`), `elements` (liste des éléments)
- Action `loadBoard(boardId)` : charge le board depuis l'API
- Action `setMode(mode)` : met à jour le mode (propriétaire uniquement)

### 6. Page d'accueil — intégration
- Après création d'un board, l'ajouter en tête de la liste des boards de la squad
- Naviguer automatiquement vers `/board/:boardId`

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` — couvre partiellement `docs/scenarios/board_navigation.feature`
- "j'accède à un board existant" → naviguer vers `/board/:boardId` avec mock session et fixture board en base
- "le titre du board s'affiche en haut à gauche" → vérifier le texte du header
- "le switch de mode est visible uniquement pour le propriétaire" → tester avec deux sessions distinctes (propriétaire vs membre)
- "je reviens à l'accueil via le menu burger" → cliquer "Quitter le board", vérifier redirection vers `/squad/:squadId`

## Critères d'acceptation
- La création d'un board via le bouton de la page d'accueil fonctionne
- Le board apparaît dans la liste de la page d'accueil après création
- La page du board se charge correctement avec le titre en haut à gauche
- Le switch de mode est visible uniquement pour le propriétaire
- La connexion Socket.io au board est établie à l'ouverture
- Les scénarios E2E de navigation de base passent en vert
