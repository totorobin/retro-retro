# Tâche 0018 — Mini-map

## Objectif
Implémenter la mini-map en bas à droite du board : vue miniature de l'ensemble du canvas, indicateur de viewport et navigation rapide par clic.

## Prérequis
- Tâche 0008 (navigation — zoom, pan) terminée — le viewport et ses coordonnées sont dans `useBoardStore`
- Tâche 0010 (rectangle) terminée — des éléments existent sur le board pour tester le rendu

## Travaux à réaliser

### 1. Composant `MiniMap.vue`
- Position fixe en bas à droite de la fenêtre (par-dessus le canvas principal, z-index élevé)
- Dimensions fixes : ex. 200 × 150 px avec un fond semi-transparent
- Implémenter via un second `KonvaStage` de taille 200 × 150 px

### 2. Rendu miniature des éléments
- Calculer automatiquement le facteur de scale depuis la bounding box de l'ensemble des éléments du board vers les dimensions de la mini-map
- Afficher tous les éléments (formes, images, textes, post-its) en version réduite, sans interactivité
- La mini-map se met à jour en temps réel lorsque des éléments sont ajoutés, déplacés ou modifiés (réactivité via le store Pinia)

### 3. Indicateur de viewport
- Afficher un rectangle translucide sur la mini-map représentant la zone actuellement visible dans le viewport principal
- Ce rectangle se met à jour en temps réel lorsque l'utilisateur zoome ou pan

### 4. Navigation par clic
- Cliquer sur un point de la mini-map déplace instantanément le viewport principal vers la zone correspondante
- Calculer la transformation inverse (coordonnées mini-map → coordonnées canvas) en tenant compte du scale courant

### 5. Intégration dans `useBoardStore`
- Exposer `viewportRect` (x, y, width, height en coordonnées canvas) pour que `MiniMap.vue` puisse dessiner l'indicateur
- `viewportRect` est mis à jour à chaque changement de zoom ou de position du stage

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` (enrichissement) — couvre le scénario "Mini-map"
- "je clique sur un point spécifique de la mini-map en bas à droite" → cliquer sur le composant MiniMap à une position précise
- "la vue principale se déplace immédiatement vers cette zone du board" → vérifier le changement de position (`x`, `y`) du stage via `page.evaluate`

## Critères d'acceptation
- La mini-map s'affiche en bas à droite avec une vue miniature de tous les éléments du board
- L'indicateur de viewport montre correctement la zone visible
- Cliquer sur la mini-map téléporte la vue principale vers la zone correspondante
- La mini-map se met à jour en temps réel lors des modifications du board
- Le scénario E2E "Mini-map" passe en vert
