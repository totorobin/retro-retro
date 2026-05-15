# Tâche 0004 — Page d'accueil

## Objectif
Implémenter la page d'accueil d'une squad : entête, liste des membres, liste des boards et bouton de création.

## Prérequis
- Tâche 0001 (initialisation) terminée
- Tâche 0002 (connexion Google) terminée — l'utilisateur est authentifié

## Travaux à réaliser

### 1. Route et vue principale
- Créer la route `/squad/:squadId` dans Vue Router
- Créer la vue `HomeView.vue`
- Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié

### 2. Entête (Header)
- Afficher le logo de l'application et le nom de la squad
- Intégrer un menu burger avec les actions suivantes :
  - Basculer vers la page d'accueil d'une autre squad de l'utilisateur
  - Se connecter à ou créer une autre squad
  - Quitter la squad actuelle
  - Se déconnecter
  - Basculer Dark Mode / Light Mode
- Le menu burger doit afficher la liste des squads dont l'utilisateur est membre

### 3. Liste des membres
- Afficher la liste des membres de la squad (nom, prénom)
- Indiquer visuellement si chaque membre est actuellement connecté à l'application (via Socket.io presence)

### 4. Liste des boards
- Afficher tous les boards de la squad, triés du plus récent au plus ancien
- Pour chaque board, afficher :
  - Le titre du board
  - La date de création (format lisible : ex. "12 mai 2026")
  - Une miniature (image de prévisualisation du contenu du board)
  - Une pastille indiquant si des membres de la squad sont actuellement connectés sur ce board
- Cliquer sur un board navigue vers la vue board (`/board/:boardId`)

### 5. Bouton "Créer un board"
- Bouton bien visible sur la page
- Ouvre un formulaire (modal ou inline) pour saisir le titre du nouveau board
- Après création, navigue directement vers le board créé

### 6. API backend
- `GET /api/squads/:squadId` — retourne les informations de la squad et de ses membres
- `GET /api/squads/:squadId/boards` — retourne la liste des boards de la squad
- `POST /api/boards` — crée un nouveau board (body : `{ title, squadId }`)

### 7. Store Pinia
- `useSquadStore` : état de la squad active (nom, membres, liste des boards)
- `useAuthStore` : utilisateur courant

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/home.steps.ts`
- "je suis sur la page d'accueil de la squad" → naviguer vers `/squad/:squadId` avec mock session
- "le nom de la squad s'affiche dans l'entête" → vérifier le texte du header
- "la liste des membres est visible" → vérifier la présence des éléments membres
- "je clique sur 'Créer un board'" → remplir le formulaire et valider
- "je suis redirigé vers le board créé" → vérifier l'URL `/board/:boardId`
- "j'ouvre le menu burger et je me déconnecte" → cliquer sur déconnexion, vérifier redirection vers `/login`

## Critères d'acceptation
- La page affiche correctement le nom de la squad et ses membres
- Les boards s'affichent avec leur titre, leur date et leur miniature
- La pastille de présence est visible pour les boards avec des participants actifs
- Le menu burger permet de changer de squad et de se déconnecter
- Le bouton "Créer un board" crée un board et redirige dessus
- Les scénarios E2E de la page d'accueil passent en vert
