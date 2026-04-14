# Framework des serveurs

## Contexte

Le serveur back vas principalement géré les interations avec les board. comme plusieurs personnes seront connecté sur un seul board et que chaque changement éffectué par une personne doit etre affiché de facon immédiate au autres utilisateur et etre également sauvegardés pour plus tard, l'utilisation d'une websocket semble essentiel.

## Décision

On partira donc sur l'utilisation de Socket.io pour la gestion de la websocket.
L'utilisation de Express.js est une possibilité pour les actions ne necessitant pas de websocket et l'hébergement du front

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

utilisation de la dernière version de Socket.io

