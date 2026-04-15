# Visibilité des curseurs utilisateurs en temps réel

## Contexte

Pour une expérience collaborative et ludique, il est souhaité que chaque utilisateur puisse voir la position du curseur des autres participants sur le board en temps réel. Cela permet de mieux suivre l'attention du groupe et de savoir qui interagit avec quels éléments.

## Décision

Nous utiliserons **Socket.io** (voir [ADR-0004](0004-framework-back.md)) pour diffuser la position des curseurs.

1.  **Côté Frontend** : 
    - Un écouteur sur l'événement `mousemove` de la zone de board capturera les coordonnées relatives (x, y).
    - Un système de **Throttling** (limitation de fréquence) sera mis en place pour n'envoyer les coordonnées qu'une fois toutes les 30 à 50ms afin de ne pas saturer le serveur.
    - Les positions seront envoyées via un événement Socket.io spécifique `cursor:move`.

2.  **Côté Backend** :
    - Le serveur recevra les coordonnées et les diffusera immédiatement à tous les autres utilisateurs connectés au même board via `socket.broadcast.to(boardId).emit('cursor:update', data)`.
    - Les données envoyées contiendront : `userId`, `userName`, `x`, `y`.

3.  **Affichage** :
    - Les curseurs distants seront rendus par des composants Vue légers, positionnés en `absolute` ou via un `SVG overlay`.
    - Chaque curseur affichera le nom de l'utilisateur ou sa photo de profil à côté d'une icône de curseur colorée.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-15)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Augmentation du trafic réseau (modérée par le throttling).
- Meilleur sentiment de présence "en direct" (social presence).
- Nécessite de gérer la visibilité des curseurs lors des zooms/déplacements de caméra (coordonnées relatives au board et non à la fenêtre).

## Questions-Réponses

**Comment gérer les performances si 50 personnes sont sur le board ?**

- Le throttling est la clé. On peut aussi arrêter d'envoyer les positions si le curseur ne bouge pas.
- On peut masquer les noms des utilisateurs quand les curseurs sont trop proches ou après quelques secondes d'inactivité.
