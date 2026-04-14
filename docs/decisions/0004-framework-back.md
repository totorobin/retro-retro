# Framework des serveurs (Backend)

## Contexte

L'application doit gérer des interactions temps réel sur les boards (rétrospectives). Plusieurs utilisateurs doivent voir les modifications instantanément.

## Décision

Nous utiliserons **Socket.io** pour la gestion de la communication bidirectionnelle en temps réel.
**Express.js** sera utilisé pour le serveur HTTP (API REST classique et service des fichiers statiques).

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Nécessite de mettre en place une logique de synchronisation d'état côté serveur.
- Choix technologique éprouvé et facile à intégrer avec Node.js.

