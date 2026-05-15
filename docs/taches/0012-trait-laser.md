# Tâche 0012 — Trait laser (mode Présentation)

## Objectif
Implémenter l'outil de trait laser en mode Présentation : dessin libre, diffusion temps réel à tous les participants, disparition automatique après 10 secondes, sans persistance en base.

## Prérequis
- Tâche 0007 (modes) terminée
- Tâche 0008 (navigation — canvas infini) terminée — le KonvaStage et son layer dédié sont disponibles

## Travaux à réaliser

### 1. Comportement
- Outil "Trait laser" dans la barre d'outils gauche (mode Présentation uniquement)
- Dessin libre par clic maintenu + glissement sur le canvas
- Le trait est visible par tous les participants connectés en temps réel (pendant le dessin)
- 10 secondes après la fin du tracé, le trait s'efface (animation de fondu ou suppression immédiate)
- Les traits laser ne sont **pas** persistés en base de données

### 2. Implémentation Socket.io
- Événement `laser:draw` — diffuse les points du trait en cours en streaming (throttle ~30 fps)
- Événement `laser:end` — indique la fin du tracé avec un `timestamp` ; les clients déclenchent le timer d'expiration à partir de cet instant
- Le serveur relaie les événements à la room sans persister quoi que ce soit

### 3. Gestion côté client
- Stocker les traits actifs dans un état local du composant (non dans le store Pinia)
- À réception de `laser:end`, démarrer un `setTimeout` de 10 s puis retirer le trait du layer
- Utiliser un `Layer` Konva dédié pour les traits laser (au-dessus des éléments, en dessous des curseurs)
- Rendu : `v-line` de `vue-konva` avec `stroke`, `strokeWidth` et `lineCap: 'round'`

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_presentation_mode.steps.ts` (enrichissement) — couvre le scénario "Trait laser"
- "je sélectionne l'outil 'Trait laser' et trace une ligne" → activer l'outil, simuler un drag sur le canvas
- "la ligne est visible temporairement par tous les participants" → vérifier depuis un second contexte navigateur
- "la ligne s'efface automatiquement au bout de 10 secondes" → attendre 11 s, vérifier l'absence du trait

## Critères d'acceptation
- Un participant peut tracer un trait laser visible par tous en temps réel
- Le trait laser disparaît automatiquement 10 secondes après la fin du tracé
- Les traits laser ne persistent pas après rechargement de la page
- Le scénario E2E "Trait laser" passe en vert
