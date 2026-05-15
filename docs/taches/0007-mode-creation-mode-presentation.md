# Tâche 0007 — Mode Création / Mode Présentation

## Objectif
Implémenter la bascule entre le mode Création et le mode Présentation du board, avec adaptation de l'interface et des outils disponibles selon le mode actif.

## Prérequis
- Tâche 0006 (création d'un board) terminée

## Travaux à réaliser

### 1. Switch de mode (propriétaire uniquement)
- Afficher un switch "Création / Présentation" en haut au centre du board
- Ce switch est visible et interactif uniquement pour le propriétaire du board (`ownerId === currentUser.id`)
- Pour les autres participants, le mode s'actualise en temps réel sans qu'ils puissent le modifier

### 2. Persistance et synchronisation du mode
- Sauvegarder le mode actif dans le document `Board` en base MongoDB (champ `mode`)
- Route API : `PATCH /api/boards/:boardId/mode` — met à jour le mode ; propriétaire uniquement (vérification côté serveur)
- Événement Socket.io `board:modeChanged` — diffuse le nouveau mode à tous les membres de la room dès le changement

### 3. Adaptation de la barre d'outils gauche
- En mode **Création** : afficher les outils de création de formes (rectangle, cercle, polygone), ajout d'image, ajout de texte, tracé de traits
- En mode **Présentation** : afficher les outils post-it, trait laser, pastilles/tampons, GIF
- La barre d'outils est un composant distinct (`ToolbarLeft.vue`) qui reçoit le mode en prop et affiche les bons outils

### 4. Comportement des éléments selon le mode
- En mode **Présentation** : les éléments de création (rectangles, cercles, polygones, images, textes) sont affichés mais non sélectionnables, non déplaçables, non modifiables
- En mode **Création** : les post-its ne peuvent pas être créés (l'outil est absent)
- La logique de blocage des interactions est gérée dans le store et dans les composants Konva (désactivation des event listeners)

### 5. Switch "Tout dévoiler" (mode Présentation uniquement)
- Afficher un switch en bas au centre, visible uniquement en mode Présentation
- Ce switch permet au participant de rendre tous ses post-its visibles pour tous les autres utilisateurs d'un seul coup
- Événement Socket.io `postits:revealAll` — diffuse la mise à jour de visibilité à la room

### 6. Store Pinia — mise à jour
- Ajouter dans `useBoardStore` :
  - `isOwner` : booléen calculé depuis `board.ownerId` et `currentUser.id`
  - `setMode(mode)` : met à jour le mode via l'API et diffuse via Socket.io (propriétaire uniquement)
  - Listener sur `board:modeChanged` pour mettre à jour le mode local en temps réel

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` (enrichissement)
- "je passe le board en mode Présentation via le switch" → cliquer sur le switch de mode (avec session propriétaire)
- "le switch de mode n'est pas visible pour un participant" → vérifier l'absence du switch avec une session membre
- "la barre d'outils affiche les outils du mode Présentation" → vérifier la présence des boutons post-it, laser, pastilles
- "en mode Présentation, je ne peux pas déplacer un rectangle" → tenter un drag, vérifier l'absence de mise à jour

## Critères d'acceptation
- Seul le propriétaire voit et peut actionner le switch de mode
- Le mode change en temps réel pour tous les participants connectés
- La barre d'outils gauche affiche les bons outils selon le mode actif
- En mode Présentation, les formes de création sont visibles mais non interactives
- Le switch "Tout dévoiler" n'est visible qu'en mode Présentation
- Le mode est persisté en base et restauré à la réouverture du board
- Les scénarios E2E de bascule de mode passent en vert
