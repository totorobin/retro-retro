# Moteur de rendu du Board (DOM vs Canvas)

## Contexte

Le Board de l'application nécessite des fonctionnalités de manipulation d'objets (rectangles, post-its, images), un zoom/déplacement (pan) sur une surface "infinie", une mini-map, et l'affichage de nombreux curseurs en temps réel.
Deux approches principales sont envisageables pour le rendu :
1. **Succession d'objets HTML/DOM** (éventuellement SVG) : Chaque élément du board est un nœud DOM.
2. **Canvas 2D** : Le board est dessiné sur un canevas bitmap unique.

## Décision

La stratégie retenue est l'utilisation d'un **Canvas 2D** (via une bibliothèque comme **Konva.js** ou **Fabric.js**).

### Justification du choix

- **Performances (Zoom/Pan)** : Le Canvas est nettement plus performant pour gérer le zoom et le déplacement fluide, surtout quand le nombre d'objets augmente (plusieurs centaines de post-its, traits laser, curseurs). Le DOM souffre de "reflows" coûteux lors des transformations globales.
- **Rendu des traits laser** : L'implémentation de traits "laser" qui s'effacent progressivement est beaucoup plus naturelle en Canvas qu'en manipulant des centaines de nœuds SVG/DOM temporaires.
- **Mini-map** : La génération d'une mini-map est facilitée par le Canvas (possibilité d'exporter le rendu courant vers une image miniature ou un second canvas réduit).
- **Z-Index et superposition** : La gestion des couches (background, éléments, curseurs) est explicite et performante.

## Statut

- [x] Proposé (2026-04-15)
- [x] Accepté (2026-04-15)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- **Accessibilité** : Moins native que le DOM. Il faudra porter une attention particulière à l'accessibilité (ex: fournir une version textuelle ou des labels ARIA pour les interactions critiques).
- **Événements** : Les événements de souris (clic sur un objet précis) ne sont pas gérés par le navigateur sur des pixels. L'utilisation d'une bibliothèque (Konva/Fabric) est indispensable pour retrouver une gestion d'événements par objet.
- **Développement** : Courbe d'apprentissage légèrement plus élevée pour l'équipe que du HTML/CSS standard, mais compensée par la robustesse de l'outil final.
- **SEO** : Aucun impact (le board est une application métier privée).

## Questions-Réponses

**Pourquoi pas du SVG ?**
- Le SVG est un bon compromis, mais il reste une forme de DOM. Pour un board "infini" avec des milliers de petits éléments (pastilles, traits), les performances de rendu du navigateur peuvent devenir instables lors des zooms rapides.

**Est-ce compatible avec Vue.js ?**
- Oui, des bibliothèques comme `vue-konva` permettent d'utiliser une approche déclarative (composants Vue) tout en effectuant le rendu final dans un Canvas.
