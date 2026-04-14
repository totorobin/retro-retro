# Choix de la Base de Données

## Contexte

L'application doit persister des données structurées (utilisateurs, squads, boards) ainsi que des objets graphiques aux schémas potentiellement variables (post-its, formes, images).

## Décision

Le choix se porte sur **MongoDB** comme base de données principale.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- **Flexibilité du schéma** : MongoDB permet de stocker facilement les différents types d'objets du board sans migration complexe de schéma SQL.
- **Performance** : Adapté aux lectures/écritures fréquentes générées par les interactions sur le board.
- **Écosystème** : Utilisation de Mongoose (ODM) pour le typage TypeScript côté backend.
- **Scalabilité** : Facilité de montée en charge si le nombre d'utilisateurs augmente.

## Questions-Réponses

**Pourquoi pas une base SQL ?**
- Les éléments du board (rectangles, post-its, traits) ont des propriétés très hétérogènes. Un format de document (BSON/JSON) est plus naturel pour ce cas d'usage qu'un modèle relationnel rigide.
