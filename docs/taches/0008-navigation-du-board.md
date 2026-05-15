# Tâche 0008 — Navigation du board (canvas infini, zoom, pan)

## Objectif
Implémenter le canvas infini du board : zoom à la molette et déplacement (pan) par clic droit + drag.

## Prérequis
- Tâche 0006 (création d'un board) terminée — le `KonvaStage` de base est en place

## Travaux à réaliser

### 1. Canvas infini — KonvaStage
- Configurer le `KonvaStage` pour occuper toute la fenêtre du navigateur (`width: window.innerWidth`, `height: window.innerHeight`)
- Gérer le redimensionnement de la fenêtre (écouteur `resize`)
- La vue par défaut est centrée sur l'origine (0, 0) du canvas
- Préparer l'architecture en couches (Layers) : layer éléments, layer curseurs (réservé pour Tâche 0011), layer UI

### 2. Zoom à la molette
- Écouter l'événement `wheel` sur le `KonvaStage`
- Calculer le facteur de zoom (ex. `scaleBy = 1.05` par cran de molette)
- Zoomer/dézoomer autour de la position du curseur (pas du centre du canvas)
- Limites de zoom : min `0.1x`, max `5x`
- Stocker le niveau de zoom dans `useBoardStore`

### 3. Déplacement (Pan)
- Activer le déplacement lors d'un clic droit maintenu + glissement de la souris
- Ou lors d'un clic molette maintenu + glissement
- Mettre à jour la position du stage (`x`, `y`)
- Stocker la position du viewport dans `useBoardStore` (utilisée par la tâche 0018 pour la mini-map)

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` — couvre partiellement `docs/scenarios/board_navigation.feature`
- "j'utilise la molette de la souris pour zoomer" → simuler un `wheel` event via Playwright (`page.mouse.wheel`)
- "l'affichage de la zone centrale s'agrandit" → vérifier le changement de scale du stage via `page.evaluate`
- "je maintiens le clic droit et déplace la souris" → simuler `mouse.down` bouton droit + `mouse.move`
- "la vue se déplace sur la surface infinie" → vérifier le changement de position (`x`, `y`) du stage

## Critères d'acceptation
- Le zoom à la molette fonctionne et se centre sur la position du curseur
- Le déplacement (pan) par clic droit + drag fonctionne
- Le canvas s'adapte correctement au redimensionnement de la fenêtre
- Le zoom et la position du viewport sont stockés dans `useBoardStore`
- Les scénarios E2E de zoom et pan passent en vert
