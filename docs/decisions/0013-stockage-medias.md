# Gestion et stockage des médias

## Contexte

Les utilisateurs peuvent intégrer des images et des GIFs sur les boards.
Il faut définir comment ces fichiers sont stockés et servis par l'application.

## Décision

Les fichiers médias seront **stockés sur le serveur** (système de fichiers local au backend ou stockage persistant partagé).

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Simplification de l'architecture initiale (pas de service tiers comme S3).
- Nécessite de configurer des volumes persistants lors du déploiement Docker.
- Express.js servira les fichiers statiques de façon sécurisée.
- Une limite de taille par fichier devra être définie (ex: 5 Mo).

## Questions-Réponses

**Est-ce évolutif ?**
- Oui, si le volume devient trop important, le backend pourra être adapté pour uploader vers un stockage objet (type S3) de façon transparente pour le frontend.
