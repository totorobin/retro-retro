# language: fr
Fonctionnalité: Navigation et Interface Globale du Board
  En tant qu'utilisateur participant à un board,
  Je veux pouvoir naviguer sur la surface infinie,
  Afin de consulter et interagir avec tous les éléments.

  Contexte:
    Étant donné que je suis connecté à l'application
    Et que j'accède à un board existant "Rétro Printemps"

  Scénario: Navigation par Zoom et Pan (Déplacement)
    Quand j'utilise la molette de la souris pour zoomer
    Alors l'affichage de la zone centrale s'agrandit
    Quand je maintiens le clic droit et déplace la souris
    Alors la vue se déplace sur la surface infinie du board

  Scénario: Utilisation de la Mini-map
    Quand je clique sur un point spécifique de la mini-map en bas à droite
    Alors la vue principale se déplace immédiatement vers cette zone du board

  Scénario: Consultation de la liste des participants
    Quand je regarde en haut à droite de la fenêtre
    Alors je vois la liste des utilisateurs connectés représentée par leurs photos de profil
    Quand je survole la photo d'un utilisateur
    Alors son nom et son prénom s'affichent

  Scénario: Mise en évidence des objets d'un utilisateur
    Quand je clique sur la photo d'un utilisateur connecté
    Alors les objets (post-its, images) appartenant à cet utilisateur sont mis en évidence
    Et le reste du board est flouté et assombri

  Scénario: Retour à l'accueil via le menu burger
    Quand j'ouvre le menu burger en haut à gauche
    Et que je sélectionne "Quitter le board"
    Alors je suis redirigé vers la page d'accueil de la Squad
