# Tâche 0021 — Pastilles / tampons (mode Présentation)

## Objectif
Implémenter trois outils de pastilles distincts en mode Présentation : avatars des participants connectés, smileys, et symboles — posés sur le canvas, persistés en base MongoDB.

## Prérequis
- Tâche 0007 (modes) terminée
- Tâche 0011 (présence) terminée — liste des participants connectés disponible dans `usePresenceStore`
- Tâche 0010 (rectangle) terminée — le modèle `BoardElement` et Socket.io sont en place

## Travaux à réaliser

### 1. Modèle BoardElement (type STAMP)
- Champs spécifiques : `stampType` (enum : `avatar` | `emoji` | `symbol`), `value` (String — URL avatar, code emoji ou caractère symbole), `authorId` (ObjectId — pour identifier qui a posé la pastille), `x`, `y`, `size` (Number)

### 2. Trois boutons distincts dans la barre d'outils

La barre d'outils gauche contient **trois boutons séparés** en mode Présentation (pas un seul bouton "Pastilles") :

#### Bouton 1 — Avatars
- Icône : grille de visages
- Clic → ouvre un popup affichant **tous les avatars des participants actuellement connectés au board** (récupérés depuis `usePresenceStore`)
- Chaque avatar est affiché en cercle clippé (40 × 40 px) avec le prénom en dessous
- Si un participant n'a pas de photo de profil, afficher ses initiales sur fond coloré
- Sélectionner un avatar → le prochain clic sur le canvas pose cette pastille

#### Bouton 2 — Smileys
- Icône : smiley souriant
- Clic → ouvre un popup avec la palette de smileys suivante (minimum 24) :
  ```
  👍 👎 ❤️ 🔥 ⭐ 🎉 😂 😢 😮 😡 🤔 💡
  🚀 ✅ ❌ 💯 🙌 👏 🤝 💪 👀 🔔 ⚡ 🌟
  ```
- Sélectionner un emoji → le prochain clic sur le canvas pose cette pastille

#### Bouton 3 — Symboles
- Icône : caractère symbolique (ex. ✓)
- Clic → ouvre un popup avec les symboles suivants (minimum 20) :
  ```
  ✓  ✗  ?  !  →  ←  ↑  ↓  ↗  ↘
  +  −  ×  ÷  =  ≠  ∞  ◆  ●  ■
  ```
- Sélectionner un symbole → le prochain clic sur le canvas pose cette pastille

### 3. Comportement commun aux trois outils
- Après sélection dans un popup, le curseur change (croix ou icône de la pastille sélectionnée)
- Clic sur le canvas → créer l'élément STAMP via `POST /api/boards/:boardId/elements` à la position cliquée
- Un second clic sur le bouton actif (ou appui sur `Escape`) annule l'outil sans poser de pastille
- Diffuser `element:create` via Socket.io à tous les participants

### 4. Rendu Konva
- Pastille avatar : `v-image` (charger l'image via `new window.Image()`, clip circulaire via `Konva.Circle` comme clip function)
- Pastille emoji : `v-text` avec `fontSize: 32` et `fontFamily: 'system-ui'` pour maximiser la compatibilité des emoji
- Pastille symbole : `v-text` avec `fontSize: 28` et `fontFamily: 'monospace'`
- Taille fixe à la pose ; les pastilles ne sont pas déplaçables ni redimensionnables après pose

### 5. Synchronisation Socket.io
- Réutiliser les événements `element:create` existants
- Pas de `element:update` ni `element:delete` pour les pastilles (permanentes)

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_presentation_mode.steps.ts` (enrichissement) — couvre le scénario "Pastilles de réaction"
- "je clique sur le bouton Avatars, je vois les avatars de tous les participants connectés" → vérifier le popup avec le nombre correct d'avatars (second contexte connecté)
- "je sélectionne l'avatar d'un participant et clique sur le board" → cliquer sur un avatar dans le popup, puis sur le canvas
- "une pastille de cet avatar est affichée à l'endroit cliqué" → vérifier l'élément STAMP (`stampType: 'avatar'`) en base et dans le second contexte
- "je clique sur le bouton Smileys et sélectionne 👍" → ouvrir le popup smileys, cliquer sur 👍, puis sur le canvas
- "je clique sur le bouton Symboles et sélectionne ✓" → ouvrir le popup symboles, cliquer sur ✓, puis sur le canvas
- "Escape annule l'outil sans poser de pastille" → activer un outil, appuyer sur Escape, vérifier l'absence de nouvel élément

## Critères d'acceptation
- La barre d'outils gauche contient trois boutons séparés : Avatars, Smileys, Symboles
- Le popup Avatars affiche tous les participants actuellement connectés (pas uniquement soi-même)
- Le popup Smileys affiche au moins 24 emoji
- Le popup Symboles affiche au moins 20 symboles
- La pastille est posée à l'endroit du clic sur le canvas
- Elle est visible en temps réel pour tous les participants
- Les pastilles sont persistées et rechargées à la réouverture du board
- `Escape` annule l'outil actif sans poser de pastille
- Les scénarios E2E "Pastilles" passent en vert
