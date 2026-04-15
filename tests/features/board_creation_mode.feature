# language: fr
Fonctionnalité: Mode Création du Board
  En tant que créateur ou participant autorisé sur un board en mode Création,
  Je veux créer des formes et intégrer des médias,
  Afin de structurer l'espace de la rétrospective.

  Contexte:
    Étant donné que je suis connecté à l'application
    Et que j'accède à un board que j'ai créé
    Et que je passe le board en mode "Création" via le switch en haut au centre

  Scénario: Création et modification d'une zone (forme)
    Quand j'utilise l'outil de création de rectangle
    Et que je dessine un rectangle sur le board
    Alors un nouveau rectangle est créé
    Quand je modifie la couleur de fond et la transparence du rectangle
    Et que je définis la couleur des post-its par défaut sur "Bleu" pour cette zone
    Alors les propriétés du rectangle sont immédiatement mises à jour (LWW)
    Et les post-its créés dans cette zone prendront la couleur "Bleu"

  Scénario: Ajout d'une image
    Quand j'importe une image sur le board
    Et que je la redimensionne
    Et que je la déplace
    Alors l'image est affichée avec les dimensions et la position souhaitées pour tous les participants

  Scénario: Ajout de texte
    Quand j'ajoute un bloc de texte avec le contenu "Points Positifs"
    Et que je le place en haut d'une zone
    Alors le texte est visible par tous les participants connectés
