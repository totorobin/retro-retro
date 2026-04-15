# Le Board

Le board peut avoir deux états : **Création** et **Présentation**.
Seul le propriétaire (le créateur) du board peut changer l'état. Le passage d'un mode à l'autre est réversible.

La page du board se présente ainsi :
- C'est une page aux dimensions "infinies" : la fenêtre du navigateur affiche par défaut la partie centrale de la page. On peut zoomer et dézoomer (via la molette de la souris) et se déplacer dans la page (via un clic long sur le bouton de la souris + déplacement).
- En haut à gauche de la fenêtre : un menu burger suivi du titre du board.
- En haut au centre, visible uniquement par le propriétaire du board : un switch permettant de passer de l'état de création à l'état de présentation.
- En haut à droite de la fenêtre : la liste des utilisateurs connectés au board. Les curseurs de chaque utilisateur connecté sont visibles sur le board, avec leur nom ou leur photo de profil.
- En bas à droite : une version réduite de l'ensemble de la page (mini-map) permettant de se déplacer rapidement par simple clic.
- Sur la gauche : une barre d'outils adaptée à l'état du board (en mode création : boutons pour créer des formes, du texte, etc. ; en mode présentation : post-its, traits laser, pastilles, etc.).
- En bas au centre, en mode présentation : un switch permet de rendre l'ensemble des post-its de l'utilisateur lisibles ou invisibles pour les autres participants (permettant de tout dévoiler d'un coup).

Le menu burger contient les actions suivantes :
- Quitter le board (revenir à la page d'accueil).
- Générer un lien de partage pour inviter des participants.
- Changer le mode d'affichage (Dark Mode / Light Mode).
- Créer un timer.

## Mode Création

En mode création, les personnes connectées sur le board peuvent effectuer les actions suivantes :
- Créer des rectangles, des ronds/ovales, ou des formes irrégulières polygonales. Ces zones peuvent être déplacées et modifiées sans système de verrouillage (stratégie "Last-Write-Wins" pour tous les éléments) au niveau de :
  - La transparence.
  - La couleur de fond.
  - La taille.
  - La couleur des bordures (ou absence de bordure).
  - La couleur par défaut des post-its qui y seront placés.
- Intégrer des images, les redimensionner et les déplacer.
- Ajouter du texte, le redimensionner et le déplacer.
- Tracer des traits.

## Mode Présentation

En mode présentation, les personnes connectées sur le board peuvent :
- Consulter le board dans son ensemble.
- Visualiser les éléments créés en mode création (rectangles, ronds, images, textes), sans pouvoir les modifier ni les déplacer.
- Tracer des traits "laser" qui s'effacent automatiquement au bout de 10 secondes.
- Créer des post-its.
- Ajouter des GIFs ou des images.
- Ajouter des pastilles correspondant aux photos de profil des utilisateurs connectés (faisant office de "tampon" ou réaction), ainsi que des pastilles contenant des symboles et des smileys.
- Interagir avec les post-its des autres utilisateurs.

### Les post-its

Les post-its sont des éléments permettant de prendre des notes sur le board.
- Ils sont créés par les utilisateurs connectés. Le texte ne peut être modifié que par son créateur.
- Un post-it peut être supprimé par son créateur ou par le propriétaire du board.
- Les post-its peuvent être déplacés et redimensionnés par tous les utilisateurs connectés.
- Pour éviter les conflits, le premier utilisateur qui interagit avec un post-it en prend le contrôle exclusif jusqu'à la fin de son action (système de verrouillage).
- Il est possible d'ajouter des smileys/réactions sous les post-its. Lorsque plusieurs utilisateurs ajoutent le même smiley, un compteur d'incrément s'affiche.
- Par défaut, le contenu textuel n'est lisible que par le créateur du post-it.
- Un bouton permet au créateur de rendre son texte visible par tous.
- La couleur de fond des post-its peut être modifiée par le créateur parmi une palette prédéfinie.
- Lorsqu'on déplace ou crée un post-it au-dessus d'une zone ayant une couleur prédéfinie, le post-it adopte immédiatement cette couleur.

### Liste des utilisateurs

La liste des utilisateurs connectés est représentée par leurs photos de profil.
- Lorsqu'un utilisateur se déconnecte, sa photo est grisée pour signaler son absence.
- Au survol d'une photo de profil, le nom et le prénom de l'utilisateur s'affichent.
- Cliquer sur une photo de profil permet d'activer ou de désactiver la mise en évidence des objets (post-its, images) appartenant à cet utilisateur (en floutant et assombrissant le reste du board).
