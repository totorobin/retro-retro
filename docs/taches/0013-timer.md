# Tâche 0013 — Timer

## Objectif
Implémenter un timer de décompte visible par tous les participants du board, contrôlé par le propriétaire depuis le menu burger.

## Prérequis
- Tâche 0006 (création d'un board) terminée — Socket.io rooms en place
- Tâche 0007 (modes) terminée — la notion de propriétaire du board est disponible

## Travaux à réaliser

### 1. Option dans le menu burger
- Ajouter "Créer un timer" dans le menu burger du board (propriétaire uniquement)

### 2. Modale de configuration
- Durées rapides : boutons 1 min, 3 min, 5 min, 10 min
- Saisie libre en minutes/secondes
- Bouton "Démarrer" → émettre `timer:start`

### 3. Overlay du timer — `TimerOverlay.vue`
- Affiché en haut au centre du board (position fixe, z-index élevé) lorsqu'un timer est actif
- Affiche le décompte en `MM:SS`
- Boutons pour le propriétaire : **Pause** / **Reprendre** / **Arrêter**
- Les participants voient le décompte mais pas les boutons de contrôle

### 4. Synchronisation Socket.io
- `timer:start` — `{ duration, startedAt }` — le propriétaire démarre ; diffusé à toute la room
- `timer:pause` — `{ pausedAt, remaining }` — propriétaire met en pause
- `timer:resume` — `{ resumedAt }` — propriétaire reprend
- `timer:stop` — propriétaire arrête ; le timer disparaît pour tous
- Le calcul du temps restant est effectué côté client (`setInterval` local basé sur `startedAt`) pour éviter la dérive liée à la latence réseau

### 5. Expiration
- À l'arrivée à `00:00` : animation visuelle (clignotement ou fond coloré de l'overlay)
- Le timer reste affiché à `00:00` jusqu'à ce que le propriétaire l'arrête

### 6. Store Pinia — `useTimerStore`
- État : `isActive`, `isRunning`, `isPaused`, `remaining` (ms), `startedAt`, `pausedOffset`
- Actions : `handleTimerStart`, `handleTimerPause`, `handleTimerResume`, `handleTimerStop`

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` (enrichissement)
- "je crée un timer de 5 secondes" → ouvrir le menu burger, configurer 5 s, démarrer (utiliser une durée courte dans les tests)
- "le décompte est visible pour tous les participants" → vérifier la présence de `TimerOverlay` dans un second contexte navigateur
- "le timer affiche 00:00 à expiration" → attendre 6 s, vérifier l'affichage `00:00`
- "le propriétaire peut arrêter le timer" → cliquer sur "Arrêter", vérifier la disparition de l'overlay dans les deux contextes

## Critères d'acceptation
- Le propriétaire peut créer un timer depuis le menu burger
- Le décompte est synchronisé en temps réel pour tous les participants
- Les boutons Pause/Reprendre/Arrêter fonctionnent et sont visibles uniquement par le propriétaire
- À expiration, une notification visuelle s'affiche
- Les scénarios E2E du timer passent en vert
