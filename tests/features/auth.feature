# language: fr
Fonctionnalité: Authentification et Inscription
  En tant qu'utilisateur,
  Je veux pouvoir créer un compte et me connecter,
  Afin d'accéder aux fonctionnalités de l'application.

  Scénario: Inscription d'un nouvel utilisateur
    Étant donné que je suis sur la page d'inscription
    Quand je remplis le formulaire avec un nom, un prénom, un email et un mot de passe valide
    Et que je valide l'inscription
    Alors mon compte est créé
    Et je suis redirigé vers l'invitation à rejoindre ou créer une Squad

  Scénario: Connexion d'un utilisateur existant
    Étant donné qu'un utilisateur avec l'email "test@example.com" existe
    Et que je suis sur la page de connexion
    Quand je saisis l'email "test@example.com" et le mot de passe associé
    Et que je valide la connexion
    Alors je suis connecté avec succès
    Et je suis redirigé vers ma Squad par défaut ou la page d'accueil
