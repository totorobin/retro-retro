# Stratégie de tests

## Contexte

La qualité et la non-régression du projet doivent être assurées par une stratégie de tests automatisés robuste.

## Décision

Nous adopterons une stratégie de tests à plusieurs niveaux :
- **Tests de composants** pour la bibliothèque (voir [ADR-0007](0007-bibliotheque-composants.md)) avec **Playwright**.
- **Tests de bout en bout (E2E)** pour l'application globale avec **Playwright**, en utilisant le format **Cucumber** (scénarios BDD).
- **Tests unitaires et d'intégration** pour les services backend avec une bibliothèque adaptée (ex: Vitest ou Jest).

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Mise en place de rapports automatisés pour la couverture de code et la qualité.
- Documentation vivante de l'application via les fichiers Gherkin (Cucumber).
- Garantie de stabilité lors des évolutions fonctionnelles.