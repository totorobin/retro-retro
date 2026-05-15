# Tâche 0009 — Lien de partage

## Objectif
Permettre au propriétaire du board de générer un lien d'invitation et de le copier dans le presse-papier depuis le menu burger.

## Prérequis
- Tâche 0006 (création d'un board) terminée
- Tâche 0005 (gestion des squads) terminée — la logique de rejoindre via URL est en place

## Travaux à réaliser

### 1. Option dans le menu burger
- Ajouter "Générer un lien de partage" dans le menu burger du board
- Accessible par tous les membres (pas uniquement le propriétaire)

### 2. Modale de partage
- Afficher une modale avec l'URL de partage : `<origin>/?boardId=<boardId>`
- Bouton "Copier dans le presse-papier" → `navigator.clipboard.writeText(url)`
- Feedback visuel après la copie (ex. bouton passe à "Copié !")

### 3. Comportement à l'arrivée
- Lorsqu'un utilisateur accède à cette URL et se connecte (ou est déjà connecté), il rejoint automatiquement la squad propriétaire du board — logique déjà gérée par les tâches 0003 et 0010

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/board_navigation.steps.ts` (enrichissement)
- "je génère un lien de partage depuis le menu burger" → cliquer sur l'option, vérifier l'affichage de la modale avec l'URL
- "le bouton 'Copier' copie l'URL dans le presse-papier" → cliquer sur copier, vérifier via `page.evaluate(() => navigator.clipboard.readText())`

## Critères d'acceptation
- L'option "Générer un lien de partage" est accessible depuis le menu burger
- La modale affiche une URL valide contenant le `boardId`
- Le bouton "Copier" place l'URL dans le presse-papier
- Un utilisateur arrivant via ce lien rejoint automatiquement la squad et le board
- Le scénario E2E de partage de lien passe en vert
