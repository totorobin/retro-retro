# Gestion de l'authentification

## Contexte

Pour sécuriser l'accès aux boards et aux données utilisateurs sans gérer la complexité et les risques liés au stockage des mots de passe, l'utilisation d'un fournisseur d'identité tiers (OAuth2) est recommandée.

## Décision

L'authentification sera gérée via **Google Sign-In**. 
L'architecture doit rester ouverte pour l'ajout futur d'autres fournisseurs (GitHub, Microsoft, etc.).

## Statut

- [ ] Proposé (2026-04-14)
- [x] Accepté (2026-04-14)
- [ ] Rejeté
- [ ] Déprécié
- [ ] Remplacé

## Conséquences

- Simplifie l'onboarding utilisateur (pas de création de compte spécifique).
- Délègue la sécurité critique (stockage des secrets) à un tiers de confiance.
- Stockage minimal des données utilisateurs suite à l'authentification (id unique, email, nom, prénom, photo de profil).




