# Stratégie de synchronisation et conflits

## Contexte

L'application permet à plusieurs utilisateurs de modifier simultanément les éléments d'un board via Socket.io ([ADR-0004](0004-framework-back.md)).
Il est nécessaire de définir comment le système réagit en cas de modifications concurrentes.

## Décision

La stratégie retenue est **Last-Write-Wins (LWW)** combinée à un système de **verrouillage temporaire**.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- **Verrouillage exclusif** : Le premier utilisateur qui commence une interaction (clic sur un post-it) en prend le contrôle exclusif. Les autres voient l'élément comme "verrouillé" et ne peuvent pas le modifier.
- **Dernière écriture gagnante (LWW)** : Pour les cas où les modifications arrivent sans verrouillage explicite, la dernière modification reçue par le serveur prévaut.
- **Réduction de la complexité** : Plus simple à implémenter que des algorithmes CRDT (Conflict-free Replicated Data Types) tout en restant efficace pour ce type d'usage.

## Questions-Réponses

**Est-ce que le verrouillage est visible ?**
- Oui, une indication graphique (bordure de couleur du curseur de l'utilisateur) doit montrer qu'un élément est en cours de modification.
