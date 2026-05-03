# Limitation de la taille des fichiers source

## Contexte

Actuellement, certains fichiers de l'application commencent à croître de manière significative (ex: `index.ts` de l'API). Des fichiers trop longs sont difficiles à maintenir, à tester et favorisent le couplage fort. Une limite claire permet de forcer une meilleure modularité.

## Décision

Nous décidons de limiter la taille des fichiers source à un maximum de **250 lignes**. Au-delà de cette limite, le fichier doit être décomposé en modules plus petits et cohérents.

## Statut

- [x] Proposé 2026-04-15
- [ ] Accepté
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Meilleure lisibilité du code.
- Maintenance facilitée par la réduction de la complexité par fichier.
- Favorise le principe de responsabilité unique (SRP).
- Augmentation du nombre de fichiers dans le projet.

## Questions-Réponses

**Quelles sont les exceptions ?**

- Les fichiers de configuration générés ou les fichiers de données statiques (ex: traductions volumineuses) peuvent déroger à cette règle si la division n'apporte pas de clarté.
