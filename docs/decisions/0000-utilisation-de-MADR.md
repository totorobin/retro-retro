# Utilisation de "Markdown Any Decision Records"

## Contexte

Le choix d'utiliser des MADR a été pris depuis quelque temps dans mon contexte professionnel afin de documenter l'ensemble de nos choix d'architecture.
Rien à ce jour n'est venu nous faire regretter ce choix. C'est donc naturellement que l'idée est venue de l'utiliser dans le cadre de ce projet.

## Décision

Utiliser le format MADR pour documenter toute décision d'architecture, choix de bibliothèque, etc.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Nécessite de rédiger et d'expliquer chaque décision structurante.
- Améliore la connaissance et la traçabilité de l'architecture.
- Facilite l'onboarding de nouveaux développeurs sur le projet.

## Questions-Réponses

**Est-ce que ce format convient ?**

- Utilisation du fichier [adr-template](./adr-template.md).
- Ajout du bloc Questions-Réponses pour enregistrer les échanges pendant la prise de décision.

**Comment faire pour modifier une MADR si besoin dans le futur ?**

- Une fois la décision prise, un MADR ne doit plus être modifié (valeur d'historique).
- Pour appliquer une modification, il est nécessaire de créer un nouveau MADR précisant les changements (avec les statuts "Déprécié" ou "Remplacé").
    - Préciser dans la nouvelle décision le lien vers l'ancienne MADR remplacée.
    - Préciser dans l'ancienne MADR qu'elle a été remplacée avec un lien vers la nouvelle.

