# Évaluation de WebRTC pour la réduction de charge des WebSockets

## Contexte

Avec l'ajout de la visibilité des curseurs (voir [ADR-0015](0015-visibilite-des-curseurs.md)), le trafic via Socket.io (WebSockets) va augmenter. L'utilisation de WebRTC (Peer-to-Peer) a été suggérée comme une solution pour décharger le serveur en faisant circuler les données de position directement entre les navigateurs des utilisateurs.

## Décision

Nous **ne retenons pas** WebRTC comme solution principale pour la synchronisation des curseurs ou des données du board. Nous conservons **Socket.io** pour l'ensemble des communications temps réel.

### Raisons du rejet de WebRTC :

1.  **Complexité du maillage (Mesh topology)** : En P2P pur, chaque utilisateur doit maintenir une connexion avec *tous* les autres utilisateurs (N*(N-1) connexions). Pour un board de 20 personnes, cela représente 380 connexions actives au total, ce qui sature rapidement le CPU et la bande passante montante (upload) des clients.
2.  **Infrastructure supplémentaire** : WebRTC nécessite des serveurs de signalisation (déjà couverts par Socket.io), mais aussi des serveurs **STUN/TURN** pour traverser les pare-feux et NAT, ce qui complexifie le déploiement.
3.  **Fiabilité et Latence** : Bien que WebRTC (via UDP/DataChannels) soit plus rapide en théorie, la mise en place d'un système de synchronisation d'état robuste (post-its, verrous) est beaucoup plus complexe en P2P qu'en mode client-serveur centralisé.
4.  **Cohérence avec l'architecture actuelle** : Socket.io est déjà en place pour la persistance des données (MongoDB) et la gestion des conflits (Last-Write-Wins). Introduire une seconde technologie pour un seul usage (les curseurs) augmenterait inutilement la dette technique.

## Statut

- [ ] Proposé (2026-04-14)
- [ ] Accepté
- [x] Rejeté (2026-04-15)
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- **Optimisation de Socket.io** : Pour réduire la charge, nous comptons sur le **Throttling** côté client (voir ADR-0015) et l'utilisation de **Rooms** (salons) par board côté serveur pour limiter la diffusion des messages uniquement aux personnes concernées.
- **Scalabilité serveur** : Si le serveur sature, nous utiliserons le module `@socket.io/redis-adapter` pour répartir la charge sur plusieurs instances Node.js derrière un load balancer, plutôt que de complexifier le client avec WebRTC.

## Questions-Réponses

**WebRTC n'est-il pas plus performant pour la vidéo/audio ?**

- Si. Si nous devions ajouter de la visio-conférence intégrée au board à l'avenir, WebRTC serait le choix incontournable. Mais pour des données de type "coordonnées" ou "texte", le surcoût de mise en œuvre ne justifie pas le gain de performance par rapport à un WebSocket bien optimisé.
