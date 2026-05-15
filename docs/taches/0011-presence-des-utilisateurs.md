# Tâche 0011 — Présence des utilisateurs (curseurs, liste connectés)

## Objectif
Afficher en temps réel la liste des utilisateurs connectés au board, leurs curseurs sur le canvas, et permettre la mise en évidence des éléments d'un utilisateur.

## Prérequis
- Tâche 0006 (création d'un board) terminée — Socket.io rooms en place
- Tâche 0008 (navigation) terminée — layer de curseurs disponible

## Travaux à réaliser

### 1. Gestion de la présence côté serveur
- À la connexion Socket.io d'un utilisateur à une room (`board:join`), notifier tous les membres via `board:userJoined` avec les infos de l'utilisateur (id, nom, prénom, avatarUrl)
- À la déconnexion (événement `disconnect` ou `board:leave`), notifier via `board:userLeft`
- Maintenir une Map en mémoire côté serveur : `roomId → Set<{ socketId, userId, name, avatarUrl }>`

### 2. Liste des participants (haut à droite)
- Composant `ParticipantList.vue` affiché en haut à droite du board
- Afficher l'avatar (photo de profil) de chaque utilisateur connecté
- Si un utilisateur se déconnecte, griser son avatar (ne pas le retirer immédiatement)
- Au survol d'un avatar, afficher le nom et le prénom dans une infobulle

### 3. Mise en évidence des éléments d'un utilisateur
- Au clic sur l'avatar d'un participant dans `ParticipantList.vue` :
  - Mettre en évidence tous les éléments (post-its, images) créés par cet utilisateur
  - Flouter et assombrir le reste du board (overlay semi-transparent)
  - Un second clic sur le même avatar annule la mise en évidence
- Implémenter via un filtre Konva ou un overlay CSS par-dessus le canvas

### 4. Synchronisation des curseurs
- Écouter les événements `mousemove` sur le `KonvaStage`
- Émettre `cursor:move` avec `{ x, y }` (coordonnées canvas, pas écran) à une fréquence limitée (throttle à ~30 fps)
- Recevoir les événements `cursor:move` des autres participants et mettre à jour leurs positions dans le store
- Afficher chaque curseur sur le layer dédié (Konva `Group` avec une flèche + label nom/avatar)
- Les curseurs sont supprimés du canvas lorsque l'utilisateur quitte le board

### 5. Protocole de curseurs (ADR-0015)
- Les coordonnées sont exprimées dans le repère du canvas (pas de l'écran), pour être indépendantes du zoom et de la position du viewport
- Ne pas envoyer les événements curseur en dehors du canvas (ex. quand la souris est sur la toolbar)

### 6. Store Pinia — `usePresenceStore`
- État : `participants` (Map userId → infos utilisateur + position curseur)
- Actions : `handleUserJoined`, `handleUserLeft`, `handleCursorMove`

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` (enrichissement) — couvre les scénarios "Liste des utilisateurs" et "Mise en évidence"
- "je regarde en haut à droite, je vois les photos de profil" → vérifier la présence du composant `ParticipantList`
- "je survole la photo d'un utilisateur, son nom s'affiche" → `hover()` sur un avatar, vérifier l'infobulle
- "je clique sur la photo d'un utilisateur, ses objets sont mis en évidence" → cliquer sur un avatar, vérifier l'overlay de mise en évidence (deux contextes navigateur simultanés)

## Critères d'acceptation
- La liste des participants s'affiche en haut à droite avec les avatars
- Un participant qui se déconnecte voit son avatar grisé
- Le survol d'un avatar affiche le nom complet
- Le clic sur un avatar met en évidence les éléments de cet utilisateur
- Les curseurs des autres participants sont visibles en temps réel sur le canvas
- Les curseurs ne sont pas visibles en dehors du canvas
- Les scénarios E2E de présence et mise en évidence passent en vert
