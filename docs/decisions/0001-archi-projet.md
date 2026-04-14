# Architecture globale du projet

## Contexte

Cette application va nécessiter une interface web, une ou plusieurs API et des bibliothèques partagées.
Il faut choisir comment structurer et gérer l'ensemble de ces composants.

## Décision

L'ensemble du projet sera développé dans un seul dépôt (monorepo).
Nous utiliserons **pnpm** pour la gestion du monorepo et des dépendances.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté 
- [ ] Déprécié 
- [ ] Remplacé

## Conséquences

- Facilite le partage de code entre le front et le back.
- Simplifie la gestion des versions et les mises à jour de dépendances.
- L'ensemble des parties de l'application sera développé avec l'écosystème JavaScript/TypeScript.


