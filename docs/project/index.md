# Rétro Rétro

Ce projet sera grandement inspiré de l'ancienne application de rétrospective Métro Rétro
Il s'agit donc d'une application de retrospective.
L'utilisation ce doit simple et ludique. l'objectif étant avant tout de passer un bon moment avec ces collègues.

## Utilisation

Quand un utilisateur se connecte pour la première fois, il doit créer un compte avant de pouvoir acceder a l'application
Ensuite, en fonction de l'url qu'il a utilisé, les choix suivants s'offre a lui :
- Cas part défaut, url de l'application sans paramètres particulier :
  - L'utilisateur est invité a rejoindre une Squad ou créer une Squad
  - L'utilisateur se retrouve ensuite sur la page d'accueil de l'application
- Cas ou l'url contient l'id d'une squad:
  - L'utilisateur rejoin automatiquement la squad en question et se retrouve sur la page d'accueil de l'application
- Cas ou l'url contient l'id d'un board:
  - L'utilisateur rejoin automatiquement la squad propriétaire du board et se retrouve sur le board en tant que participant

# Thematisation

L'application aura pour couleur principale le bleu roi
Le fond sera un blanc cassé
la possibilité de passer sur un 'dark mode' sera disponible et automatique par défaut en fonction des options du navigateur
tous les paramètres de thématisation devra etre variabilisé pour permettre d'etre facilement changé pour une utilisation en marque blanche