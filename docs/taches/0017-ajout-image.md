# Tâche 0017 — Ajout d'image sur le board

## Objectif
Implémenter l'outil d'import et d'affichage d'image sur le canvas Konva en mode Création, avec upload backend, déplacement, redimensionnement et synchronisation.

## Prérequis
- Tâche 0010 (rectangle) terminée — le modèle `BoardElement` et Socket.io sont en place

## Travaux à réaliser

### 1. Modèle BoardElement (type IMAGE)
- Champs spécifiques : `imageUrl` (String — URL publique de stockage), `x`, `y`, `width`, `height`
- Stratégie de stockage (ADR-0013) : upload vers le backend, stockage sur le système de fichiers ; retourner une URL publique

### 2. Backend — Route d'upload
- Route `POST /api/upload` — reçoit un fichier image (multipart/form-data via `multer`), le stocke dans `uploads/`, retourne `{ url: '/uploads/<filename>' }`
- Servir le dossier `uploads/` en statique via Express

### 3. Frontend — Outil Image
- Bouton "Image" dans la barre d'outils gauche (mode Création)
- Clic sur le bouton ouvre un sélecteur de fichier (`<input type="file" accept="image/*">` caché, déclenché par le bouton)
- Upload via `POST /api/upload` ; le backend retourne l'URL
- Créer l'élément IMAGE via `POST /api/boards/:boardId/elements` avec la position au centre du viewport actuel
- Diffuser `element:create` via Socket.io à tous les participants

### 4. Rendu Konva
- Utiliser `v-image` de `vue-konva` (charger d'abord l'image via `new window.Image()` puis passer l'objet à Konva)
- Activer le transformer Konva au clic : déplacement par drag, redimensionnement via les poignées
- Toute modification de position/taille est synchronisée via `element:update`

### 5. Synchronisation Socket.io
- Réutiliser les événements `element:create` et `element:update` existants

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_creation_mode.steps.ts` (enrichissement) — couvre le scénario "Ajout d'une image"
- "j'importe une image sur le board" → simuler un upload via `page.setInputFiles` sur l'input file caché
- "l'image est affichée sur le canvas" → vérifier la présence d'un élément IMAGE dans `GET /api/boards/:boardId`
- "l'image est affichée avec les dimensions et la position souhaitées pour tous les participants" → vérifier depuis un second contexte navigateur

## Critères d'acceptation
- Un utilisateur peut importer une image depuis son disque et la voir apparaître sur le canvas
- L'image peut être déplacée et redimensionnée
- Les modifications sont synchronisées en temps réel pour tous les participants
- L'élément est persisté et rechargé à la réouverture du board
- Le scénario E2E d'ajout d'image passe en vert
