# language: fr
Fonctionnalité: Authentification via Google OAuth2
  En tant qu'utilisateur,
  Je veux pouvoir me connecter via mon compte Google,
  Afin d'accéder aux fonctionnalités de l'application sans créer de mot de passe spécifique.

  Scénario: Premier accès et création de compte automatique
    Étant donné que je n'ai pas de compte sur l'application
    Et que je suis sur la page de connexion
    Quand je choisis de me connecter avec mon compte Google
    Et que je m'authentifie avec succès auprès de Google
    Alors un compte est créé automatiquement avec mon identifiant unique Google
    Et mes informations (nom, prénom, email) sont récupérées depuis Google
    Et je suis redirigé vers l'invitation à rejoindre ou créer une Squad

  Scénario: Connexion d'un utilisateur existant
    Étant donné que j'ai déjà un compte lié à mon identifiant Google
    Et que je suis sur la page de connexion
    Quand je choisis de me connecter avec mon compte Google
    Et que je m'authentifie avec succès auprès de Google
    Alors je suis connecté avec succès à mon compte existant
    Et je suis redirigé vers ma Squad par défaut ou la page d'accueil

  Scénario: Déconnexion
    Étant donné que je suis connecté à l'application
    Quand j'ouvre le menu burger de l'entête
    Et que je sélectionne "Se déconnecter"
    Alors ma session est fermée
    Et je suis redirigé vers la page de connexion
