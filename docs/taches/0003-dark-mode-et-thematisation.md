# Tâche 0003 — Dark mode et thématisation CSS

## Objectif
Mettre en place le système de thématisation complet via CSS Variables, avec dark mode automatique (préférence navigateur) et bascule manuelle, en respectant ADR-0006 (CSS pur uniquement).

## Prérequis
- Tâche 0001 (initialisation) terminée

## Travaux à réaliser

### 1. Variables CSS de thème
- Créer un fichier `src/assets/styles/theme.css` dans `apps/webapp`
- Définir toutes les variables CSS dans `:root` (thème clair) :
  - Couleurs principales : `--color-primary` (bleu roi), `--color-primary-dark`, `--color-primary-light`
  - Fond : `--color-background` (blanc cassé), `--color-surface`
  - Texte : `--color-text`, `--color-text-muted`
  - Bordures : `--color-border`
  - États : `--color-error`, `--color-success`, `--color-warning`
  - Canvas : `--color-canvas-bg`
  - Post-its : palette de couleurs par défaut (`--postit-color-1` à `--postit-color-8`)
  - Espacements, rayons de bordure, ombres portées

### 2. Thème sombre
- Définir les variables du thème sombre dans `[data-theme="dark"]`
- Activer automatiquement via la media query `@media (prefers-color-scheme: dark)` (comportement par défaut)
- L'attribut `data-theme` sur `<html>` peut surcharger la détection automatique (bascule manuelle)

### 3. Bascule manuelle Dark/Light
- Stocker la préférence de l'utilisateur dans `localStorage` (`retro-theme: 'light' | 'dark' | 'auto'`)
- Implémenter `useThemeStore` (Pinia) avec les actions :
  - `toggle()` : bascule entre clair et sombre
  - `setAuto()` : revient à la préférence navigateur
- Appliquer `document.documentElement.dataset.theme` en conséquence
- Le menu burger de la page d'accueil et du board contient l'option "Dark Mode / Light Mode"

### 4. Application des variables
- Tous les composants Vue utilisent exclusivement les variables CSS (`var(--color-primary)`, etc.)
- Aucune valeur de couleur codée en dur dans les composants
- Les styles Konva (canvas) utilisent les variables récupérées via `getComputedStyle` au moment du rendu

### 5. Marque blanche
- Toutes les variables sont regroupées en un seul fichier `theme.css`
- Un commentaire en tête de fichier documente comment personaliser le thème pour une utilisation en marque blanche

## Tests E2E à implémenter
Fichier : `tests/e2e/steps/theme.steps.ts`
- "j'active le dark mode via le menu burger" → cliquer sur l'option Dark Mode, vérifier `document.documentElement.dataset.theme === 'dark'`
- "la préférence est mémorisée après rechargement" → recharger la page, vérifier que le thème sombre est toujours actif
- "le thème clair est restauré en cliquant sur 'Light Mode'" → basculer retour, vérifier la suppression de `data-theme`

## Critères d'acceptation
- Le thème sombre s'active automatiquement si le navigateur est en mode sombre
- La bascule manuelle via le menu burger fonctionne
- La préférence est mémorisée dans `localStorage` entre les sessions
- Aucune couleur n'est codée en dur dans les composants
- Le thème s'applique correctement aux éléments du canvas (fond, formes)
- Les scénarios E2E de thématisation passent en vert
