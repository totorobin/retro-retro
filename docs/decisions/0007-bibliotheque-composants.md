# Bibliothèque de composants graphiques

## Contexte

Pour garantir une cohérence visuelle sur l'ensemble des applications (existantes ou futures) et faciliter la réutilisation du code CSS (voir [ADR-0006](0006-css.md)), il est nécessaire de centraliser les composants graphiques.

## Décision

Un package dédié aux composants graphiques (Vue.js) sera créé dans le monorepo.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Unification de l'UI/UX sur tous les projets du monorepo.
- Simplification de la maintenance des composants transverses (boutons, inputs, etc.).
- Nécessite de configurer une bibliothèque de composants publiable ou partagée en interne du monorepo.