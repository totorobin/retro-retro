# Tâche 0016 — Création et gestion des post-its

## Objectif
Implémenter les post-its en mode Présentation : création, édition de texte (privée par défaut), déplacement avec verrouillage temporaire, réactions, dévoilement et suppression.

## Prérequis
- Tâche 0007 (modes) terminée — le board est en mode Présentation
- Tâche 0010 (rectangle) terminée — le modèle `BoardElement` et Socket.io sont en place

## Travaux à réaliser

### 1. Modèle Mongoose — BoardElement (type POSTIT)
- Champs spécifiques : `text` (String), `isTextVisible` (Boolean, défaut : `false`), `color` (String, couleur de fond), `x`, `y`, `width`, `height`, `authorId` (ObjectId ref User), `lockedBy` (ObjectId | null), `reactions` (tableau `{ emoji: String, userIds: [ObjectId] }`)

### 2. Création d'un post-it
- Bouton "Post-it" dans la barre d'outils gauche (mode Présentation uniquement)
- Clic sur le canvas crée un post-it à la position cliquée
- Le post-it adopte automatiquement la couleur par défaut de la zone rectangulaire sous-jacente (`postitDefaultColor`), ou la couleur par défaut de l'application sinon
- Ouvrir immédiatement l'éditeur de texte inline après création

### 3. Édition du texte
- Seul le créateur du post-it (`authorId === currentUser.id`) peut modifier le texte
- L'édition se fait inline sur le canvas (utiliser un élément `textarea` HTML positionné par-dessus le canvas pendant l'édition, ou `v-text` Konva)
- Par défaut, `isTextVisible = false` : le texte n'est visible que par le créateur ; les autres voient un post-it opaque sans texte

### 4. Dévoilement individuel et global
- Bouton sur le post-it (icône œil) permettant au créateur de basculer `isTextVisible = true`
- Switch "Tout dévoiler" en bas au centre (implémenté en Tâche 0007) : passe tous les post-its de l'utilisateur à `isTextVisible = true` en un seul événement Socket.io `postits:revealAll`

### 5. Verrouillage temporaire
- Lorsqu'un utilisateur commence à déplacer ou redimensionner un post-it :
  - Émettre `element:lock` avec `{ elementId, userId }` vers la room
  - Le serveur met à jour `lockedBy` en base
  - Les autres clients affichent une indication visuelle (bordure colorée de la couleur du curseur de l'utilisateur qui a le verrou)
  - Les autres utilisateurs ne peuvent pas interagir avec ce post-it tant que `lockedBy !== null`
- Lorsque l'action se termine (mouseup / blur) :
  - Émettre `element:unlock` — le serveur remet `lockedBy = null`
  - Timeout de sécurité côté serveur (5 secondes) pour libérer automatiquement en cas de déconnexion

### 6. Déplacement et adoption de couleur
- Drag and drop du post-it sur le canvas
- Si le post-it est déposé dans une zone rectangulaire ayant un `postitDefaultColor`, la couleur du post-it est mise à jour automatiquement
- Émission de `element:update` avec la nouvelle position et la nouvelle couleur

### 7. Changement de couleur
- Palette de couleurs prédéfinies dans le panneau de propriétés (uniquement pour le créateur)
- Le changement de couleur est synchronisé via `element:update`

### 8. Réactions (smileys)
- Menu de réactions accessible sous chaque post-it (au survol ou au clic)
- N'importe quel participant peut ajouter une réaction
- Si plusieurs utilisateurs ajoutent le même emoji, un compteur s'affiche (`emoji x N`)
- Événement Socket.io `element:react` — `{ elementId, emoji, userId }`
- Le serveur met à jour le tableau `reactions` du post-it

### 9. Suppression
- Le créateur et le propriétaire du board peuvent supprimer un post-it
- Bouton de suppression dans le panneau de propriétés (visible uniquement pour les autorisés)
- Événement `element:delete` diffusé à la room ; le post-it disparaît immédiatement

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_presentation_mode.steps.ts` — couvre `docs/scenarios/board_presentation_mode.feature`
- "je sélectionne l'outil post-it et saisis le texte" → cliquer sur l'outil, cliquer sur le canvas, taper le texte
- "le texte n'est lisible que par moi par défaut" → vérifier depuis un second contexte navigateur (autre utilisateur) que le texte n'est pas visible
- "j'actionne le switch 'Tout dévoiler'" → cliquer sur le switch en bas du board
- "l'ensemble de mes post-its deviennent lisibles pour tous" → vérifier depuis le second contexte que les textes sont maintenant visibles
- "je commence à déplacer un post-it, j'en prends le contrôle exclusif" → simuler `mousedown` sur le post-it, vérifier l'indicateur de verrouillage dans le second contexte
- "Alice ne peut pas modifier ce post-it pendant que je le déplace" → tenter un drag depuis le second contexte, vérifier le refus
- "j'ajoute un smiley 'Pouce levé' sous un post-it" → cliquer sur le menu réactions, sélectionner l'emoji
- "un compteur s'affiche si un autre utilisateur ajoute le même smiley" → ajouter le même emoji depuis le second contexte, vérifier le compteur `x2`

## Critères d'acceptation
- Un participant peut créer un post-it en mode Présentation
- Le texte du post-it n'est visible que par son créateur par défaut
- Le créateur peut dévoiler individuellement ou en masse ses post-its
- Le verrouillage empêche deux utilisateurs de déplacer le même post-it simultanément
- Un post-it déplacé dans une zone colorée adopte la couleur de cette zone
- Les réactions affichent un compteur si plusieurs utilisateurs choisissent le même emoji
- La suppression est réservée au créateur et au propriétaire du board
- Les 5 scénarios du fichier `board_presentation_mode.feature` passent en vert
