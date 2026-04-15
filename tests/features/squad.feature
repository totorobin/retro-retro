# language: fr
Fonctionnalité: Gestion des Squads
  En tant qu'utilisateur connecté,
  Je veux créer, rejoindre ou changer de Squad,
  Afin de collaborer avec mes collègues.

  Scénario: Création d'une nouvelle Squad
    Étant donné que je suis connecté à l'application
    Et que je suis sur la page de création de Squad
    Quand je saisis le nom "Squad Innovation"
    Et que je valide la création
    Alors une nouvelle Squad nommée "Squad Innovation" est créée
    Et je suis l'administrateur de cette Squad
    Et je suis redirigé vers la page d'accueil de la Squad "Squad Innovation"

  Scénario: Rejoindre une Squad via un lien d'invitation
    Étant donné que je suis connecté à l'application
    Quand je navigue sur l'URL d'invitation contenant l'ID d'une Squad "XYZ-789"
    Alors je rejoins automatiquement la Squad "XYZ-789" en tant que membre
    Et je suis redirigé vers la page d'accueil de la Squad "XYZ-789"

  Scénario: Basculer vers une autre Squad
    Étant donné que je suis connecté et membre de "Squad A" et "Squad B"
    Et que je suis sur la page d'accueil de la "Squad A"
    Quand j'ouvre le menu burger de l'entête
    Et que je sélectionne "Squad B" dans la liste des squads
    Alors je suis redirigé vers la page d'accueil de la "Squad B"
