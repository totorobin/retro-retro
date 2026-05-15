# Tâche 0005 — Gestion des squads

## Objectif
Implémenter la création d'une squad, le fait de rejoindre une squad via un lien, et la navigation entre les squads d'un utilisateur.

## Prérequis
- Tâche 0002 (connexion Google) terminée

## Travaux à réaliser

### 1. Modèle Mongoose — `Squad`
- Champs : `name` (String, required), `adminId` (ObjectId ref User), `members` (tableau `{ userId: ObjectId, role: 'admin' | 'member', joinedAt: Date }`)

### 2. Page "Rejoindre ou créer une Squad"
- Affichée quand un utilisateur connecté n'appartient à aucune squad ou accède à l'application sans URL de squad
- Route : `/onboarding`
- Deux actions :
  - **Créer une squad** : formulaire (nom de la squad) → `POST /api/squads`
  - **Rejoindre une squad** : champ pour coller un lien d'invitation → rejoint et redirige

### 3. API backend
- `POST /api/squads` — crée une squad ; le créateur devient administrateur
- `GET /api/squads/:squadId` — retourne la squad avec ses membres
- `POST /api/squads/:squadId/join` — rejoint une squad en tant que membre
- `DELETE /api/squads/:squadId/members/me` — quitter la squad
- `GET /api/users/me/squads` — liste toutes les squads de l'utilisateur connecté

### 4. Rejoindre via URL
- Si l'URL contient `?squadId=XYZ` au moment de la connexion Google, rejoindre automatiquement cette squad après authentification
- Si l'URL contient `?boardId=ABC`, trouver la squad propriétaire du board, y rejoindre automatiquement et naviguer vers le board

### 5. Menu burger — navigation entre squads
- La liste des squads de l'utilisateur est chargée dans `useAuthStore` au démarrage
- Le menu burger de la page d'accueil (Tâche 0004) affiche cette liste
- Cliquer sur une squad navigue vers `/squad/:squadId`

### 6. Quitter une squad
- Option "Quitter la squad" dans le menu burger
- Confirmation avant action
- Si l'utilisateur est le seul membre / administrateur, avertir qu'il ne peut pas quitter sans transférer l'administration ou supprimer la squad
- Appel `DELETE /api/squads/:squadId/members/me`

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/squad.steps.ts` — couvre `docs/scenarios/squad.feature`
- "je suis sur la page de création de Squad et saisis le nom 'Squad Innovation'" → naviguer vers `/onboarding`, remplir le formulaire
- "une nouvelle Squad nommée 'Squad Innovation' est créée" → vérifier la redirection et le titre dans le header
- "je navigue sur l'URL d'invitation contenant l'ID d'une Squad" → naviguer directement vers l'URL avec mock session
- "je rejoins automatiquement la Squad en tant que membre" → vérifier le document Squad en base
- "je bascule vers une autre squad via le menu burger" → cliquer dans le menu burger, vérifier la redirection

## Critères d'acceptation
- Un utilisateur peut créer une squad et en devient administrateur
- Un utilisateur peut rejoindre une squad via un lien d'invitation (URL)
- Un utilisateur peut basculer entre ses squads via le menu burger
- Un utilisateur peut quitter une squad
- L'arrivée par URL avec `squadId` ou `boardId` rejoint automatiquement la squad correspondante
- Les 3 scénarios du fichier `squad.feature` passent en vert
