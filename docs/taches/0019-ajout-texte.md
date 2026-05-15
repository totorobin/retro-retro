# Tâche 0019 — Ajout de texte sur le board

## Objectif
Implémenter l'outil de création de blocs de texte sur le canvas Konva en mode Création, avec édition inline, déplacement et synchronisation.

## Prérequis
- Tâche 0010 (rectangle) terminée — le modèle `BoardElement` et Socket.io sont en place

## Travaux à réaliser

### 1. Modèle BoardElement (type TEXT)
- Champs spécifiques : `content` (String), `fontSize` (Number), `fontColor` (String), `x`, `y`, `width`

### 2. Frontend — Outil Texte
- Bouton "Texte" dans la barre d'outils gauche (mode Création)
- Clic sur le canvas crée un bloc de texte à la position cliquée et active immédiatement l'édition
- Créer l'élément TEXT via `POST /api/boards/:boardId/elements`
- Diffuser `element:create` via Socket.io

### 3. Édition inline
- Pendant l'édition, superposer une `<textarea>` HTML positionnée en coordonnées écran (calculées depuis les coordonnées canvas via la transformation inverse du stage : position + scale)
- `Escape` ou clic en dehors valide le texte et masque la textarea
- La textarea disparaît ; le texte s'affiche via `v-text` de `vue-konva`

### 4. Panneau de propriétés
- Au clic sur un bloc de texte existant, afficher le panneau :
  - Taille de police (`fontSize`)
  - Couleur du texte (`fontColor`)
- Double-clic sur le bloc rouvre l'édition inline
- Toutes les modifications sont synchronisées via `element:update`

### 5. Déplacement
- Drag and drop du bloc de texte sur le canvas
- Toute modification de position synchronisée via `element:update`

### 6. Rendu Konva
- Utiliser `v-text` de `vue-konva` pour l'affichage hors édition
- Gérer le retour à la ligne automatique (`wrap: 'word'`)

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_creation_mode.steps.ts` (enrichissement) — couvre le scénario "Ajout de texte"
- "j'ajoute un bloc de texte avec le contenu 'Points Positifs'" → cliquer sur l'outil texte, cliquer sur le canvas, taper le texte, valider avec Escape
- "je le place en haut d'une zone" → drag du bloc vers la position souhaitée
- "le texte est visible par tous les participants connectés" → vérifier depuis un second contexte navigateur

## Critères d'acceptation
- Un utilisateur peut ajouter un bloc de texte et l'éditer inline
- `Escape` ou clic hors de la textarea valide le texte
- Double-clic rouvre l'édition
- Le texte peut être déplacé et ses propriétés (taille, couleur) modifiées
- Tous les changements sont synchronisés en temps réel
- L'élément est persisté et rechargé à la réouverture du board
- Le scénario E2E d'ajout de texte passe en vert
