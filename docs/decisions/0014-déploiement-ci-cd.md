# Déploiement et CI/CD

## Contexte

L'application doit être déployée de manière automatisée, reproductible et accessible aux utilisateurs finaux.

## Décision

La stratégie de déploiement repose sur **Docker** et **Clever Cloud**, avec une automatisation via **GitHub Actions**.

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- **Docker** : Garantit un environnement de développement et de production identique. Facilite le packaging du monorepo pnpm.
- **Clever Cloud** : Plateforme PaaS (Platform as a Service) choisie pour héberger l'application avec scalabilité automatique.
- **GitHub Actions** : Pipeline CI/CD automatisée (Lint, Tests, Build Docker, Déploiement vers Clever Cloud) à chaque push sur la branche principale.

## Questions-Réponses

**Est-ce que Clever Cloud supporte Docker ?**
- Oui, Clever Cloud propose un support natif pour les images Docker, ce qui simplifie le déploiement.
