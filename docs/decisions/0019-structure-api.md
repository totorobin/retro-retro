# Restructuration de l'API

## Contexte

L'API actuelle (`apps/api/src/index.ts`) contient à la fois la configuration du serveur, les routes, les modèles, et la logique métier. Cela devient difficile à maintenir au fur et à mesure que les fonctionnalités s'ajoutent. La structure monolithique du fichier `index.ts` ne respecte plus les standards de propreté du code (Clean Code).

## Décision

Nous décidons de structurer l'API suivant un pattern modulaire et séparé par couches :
- `src/index.ts` : Point d'entrée, instanciation et middleware.
- `src/routes/` : Définition des endpoints.
- `src/controllers/` : Logique de traitement des requêtes (parsing, réponse).
- `src/services/` : Logique métier pure et orchestration.
- `src/models/` : Définition des schémas de données.

## Statut

- [x] Proposé 2026-04-15
- [ ] Accepté
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Meilleure séparation des préoccupations.
- Facilité de test unitaire (les services peuvent être testés isolément des requêtes HTTP).
- Respect du principe de responsabilité unique (SRP).
- Temps initial de refactorisation.

## Questions-Réponses

**Où placer les middlewares personnalisés ?**

- Ils doivent être placés dans un dossier `src/middlewares/`.
