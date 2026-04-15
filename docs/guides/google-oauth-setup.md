# Configuration de Google OAuth2

Pour que l'authentification fonctionne dans **Rétro Rétro**, vous devez obtenir un `GOOGLE_CLIENT_ID` et un `GOOGLE_CLIENT_SECRET` (parfois appelé `SECRET`) depuis la Google Cloud Console.

## Étapes de configuration

### 1. Créer un projet sur Google Cloud Console
- Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/).
- Connectez-vous avec votre compte Google.
- Cliquez sur la liste déroulante des projets en haut à gauche et sélectionnez **Nouveau projet**.
- Donnez un nom à votre projet (ex: `Retro-Retro`) et cliquez sur **Créer**.

### 2. Configurer l'écran de consentement OAuth
- Dans le menu latéral, allez dans **API et services** > **Écran de consentement OAuth**.
- Choisissez le type d'utilisateur **Externe** et cliquez sur **Créer**.
- Remplissez les informations obligatoires :
    - **Nom de l'application** : `Rétro Rétro`
    - **E-mail d'assistance utilisateur** : Votre adresse email.
    - **Coordonnées du développeur** : Votre adresse email.
- Cliquez sur **Enregistrer et continuer** pour les étapes suivantes (Domaines, Champs d'application/Scopes, Utilisateurs tests) sans modifications particulières pour le développement local.

### 3. Créer les identifiants
- Dans le menu latéral, allez dans **API et services** > **Identifiants**.
- Cliquez sur **Créer des identifiants** en haut de la page et choisissez **ID de client OAuth**.
- Sélectionnez **Application Web** comme type d'application.
- Ajoutez un nom (ex: `Web Client Retro`).
- Dans la section **Origines JavaScript autorisées**, ajoutez :
    - `http://localhost:3000` (URL du Frontend)
- Dans la section **URI de redirection autorisés**, ajoutez :
    - `http://localhost:4000/auth/google/callback` (URL du Backend)
- Cliquez sur **Créer**.

### 4. Récupérer les clés
- Une fenêtre s'affiche avec votre **ID client** et votre **Code secret client**.
- Copiez ces valeurs.

## Mise à jour de l'application

Ouvrez le fichier `apps/api/.env` (créez-le à partir de `.env.example` s'il n'existe pas) et renseignez les valeurs suivantes :

```env
GOOGLE_CLIENT_ID=votre_id_client_ici
GOOGLE_CLIENT_SECRET=votre_code_secret_ici
```

> **Note** : Le `SESSION_SECRET` dans le fichier `.env` est une chaîne de caractères aléatoire de votre choix utilisée pour sécuriser les sessions utilisateur.
