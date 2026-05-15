# Tâche 0015 — Création de polygone irrégulier

## Objectif
Implémenter l'outil de création de formes polygonales irrégulières (dessin point par point) sur le canvas Konva en mode Création.

## Prérequis
- Tâche 0010 (création de rectangle) terminée — le modèle `BoardElement` et la synchronisation Socket.io sont en place

## Travaux à réaliser

### 1. Extension du modèle BoardElement
- `shapeType: 'polygon'` est déjà prévu dans le modèle
- Champ spécifique : `points` (tableau de nombres `[x1, y1, x2, y2, ...]`) pour stocker les sommets du polygone
- Remplace `width`/`height` qui ne s'appliquent pas aux polygones irréguliers

### 2. Outil polygone — frontend
- Ajouter le bouton "Polygone" dans la barre d'outils gauche (mode Création)
- Implémenter le dessin par clics successifs :
  - Chaque clic sur le canvas ajoute un sommet
  - Une ligne de prévisualisation suit le curseur entre le dernier sommet posé et la position actuelle
  - Double-clic ou clic sur le premier sommet ferme et valide le polygone
  - Touche `Escape` annule le dessin en cours
- Afficher les sommets intermédiaires comme de petits cercles pour guider l'utilisateur

### 3. Panel de propriétés
- Identique au rectangle et au cercle (Tâche 0010) :
  - Couleur de fond, opacité, couleur et épaisseur de bordure
  - Couleur par défaut des post-its de la zone (`postitDefaultColor`)
- Les modifications sont appliquées immédiatement (stratégie Last-Write-Wins)

### 4. Déplacement et modification
- Déplacement : drag and drop de l'ensemble du polygone (déplacer tous les points de façon uniforme)
- Pas de redimensionnement via transformer Konva (trop complexe pour les polygones irréguliers)
- permettre de déplacer individuellement les sommets en mode édition (clic sur le polygone pour activer, puis drag sur les cercles de sommets)

### 5. Rendu Konva
- Utiliser le composant `v-line` de `vue-konva` avec `closed: true`
- Appliquer `fill`, `stroke`, `opacity` depuis le store

### 6. Réutilisation de la logique Socket.io
- Événements `element:create` et `element:update` identiques aux autres formes
- Le payload de `points` est envoyé dans `element:update` à chaque modification de sommet

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_creation_mode.steps.ts` (enrichissement)
- "j'utilise l'outil polygone et clique pour ajouter des sommets" → simuler plusieurs clics sur le canvas
- "je ferme le polygone par double-clic" → simuler un double-clic sur le dernier point
- "j'annule le tracé avec Escape" → simuler la touche Escape, vérifier qu'aucun élément n'est créé

## Critères d'acceptation
- L'utilisateur peut créer un polygone en cliquant pour ajouter des sommets
- Un double-clic ou un clic sur le premier sommet ferme le polygone
- `Escape` annule le tracé en cours
- Le panneau de propriétés fonctionne de la même façon que pour les autres formes
- L'élément est persisté et rechargé correctement à la réouverture du board
- Les scénarios E2E de création de polygone passent en vert
