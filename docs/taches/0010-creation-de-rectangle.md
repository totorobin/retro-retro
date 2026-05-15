# Tâche 0010 — Création de rectangle

## Objectif
Implémenter l'outil de création de rectangle sur le canvas Konva en mode Création, avec synchronisation temps réel et persistance MongoDB.

## Prérequis
- Tâche 0006 (création d'un board) terminée
- Tâche 0007 (modes) terminée — le board est en mode Création

## Travaux à réaliser

### 1. Modèle Mongoose — `BoardElement` (type SHAPE)
- Champs communs à tous les éléments : `boardId`, `type` (enum : `SHAPE` | `POSTIT` | `IMAGE` | `TEXT` | `STAMP`), `ownerId`, `createdAt`, `updatedAt`
- Champs spécifiques SHAPE : `shapeType` (enum : `rectangle` | `circle` | `polygon`), `x`, `y`, `width`, `height`, `fillColor`, `fillOpacity`, `strokeColor`, `strokeWidth`, `postitDefaultColor`
- Route API : `POST /api/boards/:boardId/elements` — crée un élément ; `PATCH /api/elements/:elementId` — met à jour

### 2. Outil rectangle — frontend
- Ajouter le bouton "Rectangle" dans la barre d'outils gauche (visible uniquement en mode Création)
- Lors du clic sur le bouton, activer le mode de dessin rectangle
- Implémenter le dessin par drag sur le `KonvaStage` :
  - `mousedown` — enregistrer le point de départ
  - `mousemove` — afficher un rectangle fantôme (preview) en temps réel
  - `mouseup` — valider la création
- Annuler le dessin si le drag est trop petit (< 10px)

### 3. Panel de propriétés
- Après création (ou au clic sur le rectangle), afficher un panneau permettant de modifier :
  - Couleur de fond (`fillColor`) + sélecteur de couleur
  - Opacité (`fillOpacity`) + curseur 0–100 %
  - Couleur de bordure (`strokeColor`) ou absence de bordure
  - Épaisseur de bordure (`strokeWidth`)
  - Couleur par défaut des post-its (`postitDefaultColor`) qui seront créés dans cette zone
- Les modifications sont appliquées immédiatement (stratégie Last-Write-Wins)

### 4. Déplacement et redimensionnement
- Activer le transformer Konva (`KonvaTransformer`) au clic sur le rectangle
- Le déplacement se fait par drag and drop
- Le redimensionnement se fait via les poignées du transformer
- Toute modification (position, taille) est synchronisée via Socket.io

### 5. Synchronisation Socket.io
- Événement `element:create` — diffuse le nouvel élément à tous les membres de la room
- Événement `element:update` — diffuse les modifications (position, taille, couleurs) ; stratégie LWW : le dernier message reçu écrase l'état précédent
- Le serveur persiste chaque mise à jour en base MongoDB

### 6. Rendu Konva
- Utiliser le composant `v-rect` de `vue-konva`
- Appliquer les propriétés de style depuis le store
- Gérer le z-index des éléments (les éléments plus récents sont au-dessus)

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_creation_mode.steps.ts` — couvre partiellement `docs/scenarios/board_creation_mode.feature`
- "j'utilise l'outil de création de rectangle" → cliquer sur le bouton rectangle dans la toolbar
- "je dessine un rectangle sur le board" → simuler un drag sur le `KonvaStage` via Playwright (`mouse.move`, `mouse.down`, `mouse.up`)
- "un nouveau rectangle est créé" → vérifier la présence d'un élément de type SHAPE dans la réponse de `GET /api/boards/:boardId`
- "je modifie la couleur de fond et la transparence" → interagir avec le panneau de propriétés
- "les propriétés sont immédiatement mises à jour (LWW)" → vérifier la mise à jour via un second contexte navigateur (participant)

## Critères d'acceptation
- L'utilisateur peut dessiner un rectangle par drag sur le canvas
- Le rectangle s'affiche avec les couleurs et la transparence définies
- Le panneau de propriétés permet de modifier toutes les propriétés visuelles
- Les modifications sont visibles en temps réel pour tous les participants connectés
- Le rectangle est persisté en base et rechargé à la réouverture du board
- La couleur de post-it par défaut de la zone est respectée lors de la création de post-its dans ce rectangle
- Les scénarios E2E de création de forme passent en vert
