# Le Board

Le board peut avoir deux états : **Création** et **Présentation**.
Seul le propriétaire (le créateur) du board peut changer l'état. Le passage d'un mode à l'autre est réversible.

la page du board se présente ainsi:
- c'est une page au dimensions 'infinie' : la fenêtre du navigateur affiche par défaut la partie centrale de la page, on peux zoomer et dézoomer (via la molette de la souris), on également peux se déplacer dans la page (via click long sur le bouton de la souris + déplacement de la souris)
- en haut a droite le fenêtre : un burger menu suivis du titre du board
- en haut au centre, visible uniquement par le propriétaire du board, un switch permettant de passer de l'état de création a l'état de présentation
- en haut a droite le fenêtre : la liste des utilisateurs connectés au board. Les curseurs de chaque utilisateur connecté sont visibles sur le board, avec leur nom ou leur photo de profil.
- en bas a droite, une version réduite de l'ensemble de la page permettant de se déplacer rapidement dans celle ci par simple click
- sur la gauche une barre de bouton adapté à l'état du board (en création, des boutons pour creer les formes, du texte, etc..., en présentations pour les post-it, traits laser, etc...)
- en bas au centre, en mode présentation, un switch permet de rendre l'ensemble des post-its de l'utilisateur lisibles ou ilisibles pour les autres utilisateurs

Le menu burger aura les actions suivantes:
- quitter le board (revenir sur la page d'accueil)
- Générer un lien de partage pour inviter des participants
- Changer le mode d'affichage (Dark Mode/ Light Mode)
- Creer un timer

## En Création

en création, les personnes connectés sur le board peuvent faire les actions suivantes:
- créer des rectangles, des ronds/ ovales, ou des formes irrégulières de plusieurs côté. ces zones peuvent etre déplacer et modifier au niveau de :
  - la transparence
  - la couleur de fond
  - la taille
  - la couleur des bordure (ou pas de bordure)
  - et une couleur pour les post-it qui seront placés dessus
- intégrer des images et les redimentionner, les déplacer
- ajouter du texte, le redimensionner, le déplacer
- faire des traits

## EN PRÉSENTATION

En mode présentation, les personnes connectées sur le board peuvent :
- Voir le board dans son ensemble.
- Visualiser les éléments créés en mode création (rectangles, ronds, images, textes), mais sans pouvoir les modifier ou les déplacer.
- Faire des traits "laser" qui s'effacent au bout de 10 secondes.
- Créer des post-its.
- Ajouter des GIFs ou des images.
- Ajouter des pastilles correspondants aux photos de profils des utilisateurs connectés.
- Interagir avec les post-its des autres utilisateurs.


### Les post-its

les post-its sont des éléments qui permettent de faire des notes sur le board. 
- Ils sont créés par les utilisateurs connectés au board et le texte ne peux être modifiés que par le créateur du post-it.
- Les post-its peuvent être supprimés par les créateurs des post-its ou le créateur du board.
- Les post-its peuvent être déplacés, redimensionnés par tous les utilisateurs connectés au board.
- Pour éviter les conflits, le premier utilisateur qui interagit avec un post-it en prend le contrôle exclusif jusqu'à la fin de son action (système de verrouillage).
- Il est possible d'ajouter des smiley au dessous des post-its par tous les utilisateurs du board, lorsque 2 utilisateurs ajoute le même smiley, un incrément s'affiche.
- Le texte est par défaut lisible uniquement par le créateur du post-it.
- Un bouton permet au créateur du post-it de rendre lisible le texte.
- la couleur de fond des post-it peux etre modifié par le créateur du post-it parmis un panel de couleur
- Lorsque l'on déplace ou on crée un post-it au dessus d'une zone pour l'acquelle une couleur a été définie, le post-it prend immédiatement la couleur définie.


### Liste des utilisateurs

La liste des utilisateurs connecté au bord est représenté par les images de profile des utilisateurs.
- lorsqu'un utilisateur est déconnecté du board, l'image sera grisé pour représenté son absence
- lorsque l'on passe la souris sur une image de profile, le nom prénom s'affiche
- cliquer sur une image de profile permet d'activer/désactiver la mise en évidence des objets (post-it, images) de l'utilisateur (flouter et assombrir le reste du board)
