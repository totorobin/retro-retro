# Tâche 0014 — Création de cercle / ovale

## Objectif
Implémenter l'outil de création de cercle et d'ovale sur le canvas Konva en mode Création, avec les mêmes propriétés et la même synchronisation que le rectangle.

## Prérequis
- Tâche 0010 (création de rectangle) terminée — le modèle `BoardElement` et la synchronisation Socket.io sont en place

## Travaux à réaliser

### 1. Extension du modèle BoardElement
- Le type SHAPE avec `shapeType: 'circle'` est déjà prévu dans le modèle de la Tâche 0010
- Ajouter les champs spécifiques au cercle/ovale : `radiusX` et `radiusY` (permet l'ovale lorsque `radiusX !== radiusY`)

### 2. Outil cercle — frontend
- Ajouter le bouton "Cercle / Ovale" dans la barre d'outils gauche (mode Création)
- Implémenter le dessin par drag sur le `KonvaStage` :
  - `mousedown` — enregistrer le centre ou le coin de départ
  - `mousemove` — afficher un ellipse fantôme (preview) en temps réel
  - `mouseup` — valider la création
- Tenir la touche `Shift` enfoncée pour contraindre à un cercle parfait (radiusX === radiusY)

### 3. Panel de propriétés
- Identique au rectangle (Tâche 0010) :
  - Couleur de fond, opacité, couleur et épaisseur de bordure
  - Couleur par défaut des post-its de la zone (`postitDefaultColor`)
- Les modifications sont appliquées immédiatement (stratégie Last-Write-Wins)

### 4. Déplacement et redimensionnement
- Activer le transformer Konva au clic
- Déplacement par drag and drop
- Redimensionnement via les poignées (maintenir `Shift` pour garder les proportions)
- Toute modification synchronisée via Socket.io (`element:update`)

### 5. Rendu Konva
- Utiliser le composant `v-ellipse` de `vue-konva`
- Appliquer les propriétés de style depuis le store

### 6. Réutilisation de la logique Socket.io
- Les événements `element:create` et `element:update` de la Tâche 0010 sont réutilisés sans modification
- Le serveur persiste et diffuse de la même façon

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_creation_mode.steps.ts` (enrichissement)
- "j'utilise l'outil de création de cercle" → cliquer sur le bouton cercle dans la toolbar
- "je dessine un cercle sur le board" → simuler un drag sur le canvas
- "un nouveau cercle est créé" → vérifier l'élément en base (`shapeType: 'circle'`)

## Critères d'acceptation
- L'utilisateur peut dessiner un cercle ou un ovale par drag sur le canvas
- Tenir `Shift` contraint à un cercle parfait
- Le panneau de propriétés fonctionne de la même façon que pour le rectangle
- Les modifications sont visibles en temps réel pour tous les participants
- L'élément est persisté et rechargé à la réouverture du board
- Les scénarios E2E de création de cercle passent en vert
