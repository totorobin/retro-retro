# Tâche 0020 — Miniatures des boards

## Objectif
Générer et afficher une image de prévisualisation (miniature) du contenu de chaque board sur la page d'accueil.

## Prérequis
- Tâche 0004 (page d'accueil) terminée
- Tâche 0010 (rectangle) terminée — des éléments existent sur le board

## Travaux à réaliser

### 1. Génération de la miniature côté frontend
- Utiliser la méthode `stage.toDataURL()` de Konva pour capturer le contenu du canvas en image PNG
- Déclencher la capture à des moments pertinents :
  - Lors d'une inactivité de 10 secondes sur le board (debounce)
  - Lors du départ de l'utilisateur (événement `beforeunload` ou `board:leave`)
- Envoyer l'image encodée en base64 via `POST /api/boards/:boardId/thumbnail`

### 2. Stockage de la miniature côté backend
- Route `POST /api/boards/:boardId/thumbnail` — reçoit le data URL, le convertit en fichier PNG, le stocke (même stratégie que les images — ADR-0013)
- Mettre à jour le champ `thumbnailUrl` du document `Board` en base MongoDB

### 3. Affichage sur la page d'accueil
- La liste des boards (Tâche 0004) affiche la miniature via `<img :src="board.thumbnailUrl">`
- Si aucune miniature n'est disponible, afficher un placeholder (icône générique)
- Les miniatures sont chargées avec `loading="lazy"` pour ne pas pénaliser le chargement initial

### 4. Mise à jour en temps réel (optionnel)
- Si un autre utilisateur est sur le board et génère une nouvelle miniature, la page d'accueil peut se mettre à jour via un événement Socket.io `board:thumbnailUpdated` diffusé à la squad room

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/home.steps.ts` (enrichissement)
- "la miniature du board s'affiche sur la page d'accueil" → créer un board avec des éléments, quitter, vérifier la présence d'un `<img>` non-placeholder sur la carte du board
- "un placeholder s'affiche si aucune miniature n'est disponible" → créer un board vide, vérifier la présence de l'icône générique

## Critères d'acceptation
- Une miniature est générée et sauvegardée lorsque l'utilisateur quitte le board
- La miniature est visible sur la page d'accueil à côté du titre du board
- Un placeholder s'affiche si aucune miniature n'est disponible
- La miniature est mise à jour après des modifications sur le board
- Les scénarios E2E de miniature passent en vert
