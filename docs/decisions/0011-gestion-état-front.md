# Gestion d'état côté Frontend

## Contexte

Vue.js 3 a été choisi comme framework frontend ([ADR-0003](0003-framework-front.md)).
L'application possède une logique d'état complexe (board infini, synchronisation temps réel, thèmes, données utilisateur).

## Décision

Nous utiliserons **Pinia** pour la gestion de l'état global côté client.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Centralise l'état des composants complexes (ex: la liste des post-its chargés).
- Meilleure intégration avec les DevTools de Vue.
- Support natif de TypeScript ([ADR-0002](0002-language-de-programmation.md)).
- Simplifie la communication entre les composants du monorepo.

## Questions-Réponses

**Pourquoi pas Vuex ?**
- Pinia est devenu le standard officiel de Vue 3, offrant une API plus simple (pas de mutations) et un meilleur support TypeScript.
