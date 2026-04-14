# Gestion des modèles de données

## Contexte

Comme le front et le back utilisent TypeScript (voir [ADR-0002](0002-language-de-programmation.md)), il est crucial de partager les mêmes interfaces et types pour les données échangées afin d'éviter les incohérences.

## Décision

Une bibliothèque de modèles de données partagée sera créée dans le monorepo. Elle sera référencée par tous les autres packages (front, back, etc.).

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Garantie de la cohérence des contrats d'interface entre le front et le back.
- Centralisation de la logique métier commune.
- Facilite la maintenance lors d'un changement de structure de données.

