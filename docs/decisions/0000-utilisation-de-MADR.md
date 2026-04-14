# Utilisation de "Markdown Any Decision Records"

## Contexte

Le choix d'utiliser des MADR a été pris depuis quelque temps dans mon contexte professionnel afin de documenter l'ensemble de nos choix d'architecture.
Rien a ce jour n'est venu nous faire regreter ce choix. C'est donc naturelement que me viens l'idée de l'utiliser dans le cadre de ce projet.

## Décision

Utiliser le MADR pour noter toute décision d'architecture, de choix de librairie, etc

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécie
- [ ] Remplace

## Conséquences

- Nécessite de rédiger/expliquer chaque décision d'architecture
- Meilleure connaissance de l'architecture

## Questions-Réponses

**Est-ce que ce format convient ?**

- Utilisation du fichier [adr-template](./adr-template.md)
- Ajout du bloc Questions-Réponses pour enregistrer les échanges pendant la prise de décision

**Comment faire pour modifier une MADR si besoin dans le futur ?**
- Une fois la décision prise, un MADR ne doit plus jamais être modifié (valeur d'historique)
- Pour appliquer une modif, il est proposé de créer un nouveau MADR qui précise les changements à apporter (avec les statuts "Déprécie" ou "Remplace" par exemple).
    - Préciser dans la remplacante le lien vers l'ancienne MADR écrasée
    - Préciser dans l'ancienne MADR qu'elle a été dépréciée/remplacée avec un lien vers la nouvelle

