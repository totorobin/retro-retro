# language: fr
Fonctionnalité: Mode Présentation et Post-its
  En tant qu'utilisateur participant à une rétrospective,
  Je veux créer des post-its et interagir avec ceux des autres,
  Afin de partager mes idées et mes réactions.

  Contexte:
    Étant donné que je suis connecté à l'application
    Et que j'accède à un board en mode "Présentation"

  Scénario: Création et modification d'un post-it personnel
    Quand je sélectionne l'outil post-it
    Et que je saisis le texte "On a bien progressé sur le sprint"
    Alors le post-it est créé sur le board
    Et le texte n'est lisible que par moi (son créateur) par défaut

  Scénario: Dévoiler ses post-its personnels
    Étant donné que j'ai créé plusieurs post-its privés
    Quand j'actionne le switch "Tout dévoiler" en bas au centre
    Alors l'ensemble de mes post-its deviennent lisibles pour tous les participants

  Scénario: Verrouillage d'un post-it lors de l'interaction
    Étant donné qu'un autre utilisateur "Alice" est connecté
    Quand je commence à déplacer un post-it existant
    Alors j'en prends le contrôle exclusif (verrouillage temporaire)
    Et l'élément est visuellement marqué comme verrouillé pour "Alice"
    Et "Alice" ne peut pas modifier ce post-it pendant que je le déplace

  Scénario: Réactions sur les post-its
    Quand j'ajoute un smiley "Pouce levé" sous un post-it d'Alice
    Alors le smiley est affiché sous le post-it
    Quand un autre utilisateur ajoute également un smiley "Pouce levé" sur ce même post-it
    Alors un compteur d'incrément s'affiche à côté du smiley

  Scénario: Utilisation du trait laser
    Quand je sélectionne l'outil "Trait laser"
    Et que je trace une ligne sur le board
    Alors la ligne est visible temporairement par tous les participants
    Et la ligne s'efface automatiquement au bout de 10 secondes

  Scénario: Utilisation des pastilles de réaction
    Quand je sélectionne l'outil "Pastilles"
    Et que je choisis ma photo de profil comme tampon
    Et que je clique sur le board
    Alors une pastille de ma photo de profil est affichée à l'endroit cliqué
