# Variables d'Environnement - Référence Complète

Ce document liste toutes les variables d'environnement nécessaires pour faire fonctionner le site.

---

## 🔧 Backend Variables

### Base de données
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```
- **Description** : URI de connexion à MongoDB Atlas
- **Obligatoire** : ✅ Oui
- **Format** : `mongodb+srv://username:password@cluster.mongodb.net/database`

### Cloudinary (Stockage d'images)
```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```
- **Description** : Identifiants Cloudinary pour l'upload d'images
- **Obligatoire** : ✅ Oui
- **Où trouver** : Dashboard Cloudinary → Settings → Product Environment Credentials

### JWT (Authentification)
```env
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_256_bits
```
- **Description** : Secret pour signer les tokens JWT
- **Obligatoire** : ✅ Oui
- **Recommandation** : Utilisez au moins 32 caractères aléatoires
- **Génération** : 
  ```bash
  openssl rand -base64 32
  ```

### URL Frontend
```env
FRONTEND_URL=https://votre-site-frontend.up.railway.app
```
- **Description** : URL complète du frontend (pour CORS et emails)
- **Obligatoire** : ✅ Oui
- **Note** : Mettez à jour si vous changez de domaine

### Email Configuration (Optionnel)

#### Option 1 : Mailtrap (Développement/Test)
```env
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=votre_user_mailtrap
MAILTRAP_PASS=votre_pass_mailtrap
```

#### Option 2 : SMTP (Production)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
EMAIL_FROM="Boutique" <votre_email@gmail.com>
ADMIN_EMAIL=votre_email_admin@gmail.com
```

- **Description** : Configuration pour l'envoi d'emails (notifications, confirmations de commande)
- **Obligatoire** : ❌ Non (mais recommandé)
- **Note** : Pour Gmail, utilisez un "App Password" au lieu de votre mot de passe normal

### Environnement
```env
NODE_ENV=production
PORT=5000
```
- **Description** : 
  - `NODE_ENV` : `production` ou `development`
  - `PORT` : Port d'écoute du serveur (Railway définit automatiquement)
- **Obligatoire** : ⚠️ `NODE_ENV` est important pour les optimisations

---

## 🎨 Frontend Variables

### API URL
```env
VITE_API_URL=https://votre-backend.up.railway.app/api
```
- **Description** : URL de l'API backend
- **Obligatoire** : ✅ Oui
- **Note** : Le préfixe `VITE_` est obligatoire pour que Vite expose la variable

### Socket.io URL
```env
VITE_SOCKET_URL=https://votre-backend.up.railway.app
```
- **Description** : URL du serveur Socket.io (pour le chat en temps réel)
- **Obligatoire** : ✅ Oui
- **Note** : Généralement la même URL que l'API sans `/api`

### Port
```env
PORT=4173
```
- **Description** : Port pour le serveur de prévisualisation (Vite preview)
- **Obligatoire** : ⚠️ Railway définit automatiquement via `$PORT`

---

## 📝 Exemple de Fichier .env Backend

Créez un fichier `backend/.env` (⚠️ **NE PAS** le commiter dans Git) :

```env
# Base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=mon-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# JWT
JWT_SECRET=ma_super_secret_key_tres_longue_et_aleatoire_qui_protege_les_tokens_jwt

# Frontend URL
FRONTEND_URL=https://mon-site-frontend.up.railway.app

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=monemail@gmail.com
SMTP_PASS=mon_app_password_gmail
EMAIL_FROM="Boutique" <monemail@gmail.com>
ADMIN_EMAIL=admin@monemail.com

# Environnement
NODE_ENV=production
PORT=5000
```

---

## 📝 Exemple de Fichier .env Frontend

Créez un fichier `frontend/.env` (⚠️ **NE PAS** le commiter dans Git) :

```env
# API Backend
VITE_API_URL=https://mon-backend.up.railway.app/api

# Socket.io
VITE_SOCKET_URL=https://mon-backend.up.railway.app

# Port (automatique sur Railway)
PORT=4173
```

---

## 🔐 Sécurité

### ⚠️ IMPORTANT : Ne jamais commiter les fichiers .env

Ajoutez ces fichiers à `.gitignore` :

```gitignore
# Backend
backend/.env
backend/.env.local
backend/.env.production

# Frontend
frontend/.env
frontend/.env.local
frontend/.env.production
```

### Variables sensibles

Les variables suivantes sont **SENSIBLES** et doivent rester secrètes :
- ✅ `MONGODB_URI` (contient mot de passe)
- ✅ `CLOUDINARY_API_SECRET`
- ✅ `JWT_SECRET`
- ✅ `SMTP_PASS` / `MAILTRAP_PASS`
- ✅ Tous les mots de passe et secrets

---

## 🚀 Configuration sur Railway

### Backend Service

Dans Railway → Service Backend → Variables :

1. Cliquez sur "Raw Editor" ou "New Variable"
2. Ajoutez chaque variable une par une
3. OU collez toutes les variables en une fois (format KEY=VALUE)

### Frontend Service

Dans Railway → Service Frontend → Variables :

1. Ajoutez `VITE_API_URL`
2. Ajoutez `VITE_SOCKET_URL`
3. Le `PORT` est géré automatiquement par Railway

---

## ✅ Vérification

Pour vérifier que les variables sont correctement configurées :

### Backend
```bash
cd backend
node -e "require('dotenv').config(); console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configuré' : '❌ Manquant');"
```

### Frontend
```bash
cd frontend
npm run build
# Vérifiez que les variables sont injectées dans le code compilé
```

---

## 🆘 Problèmes Courants

### Erreur : "MONGODB_URI is not defined"
- ✅ Vérifiez que la variable est bien définie dans Railway
- ✅ Vérifiez l'orthographe exacte (`MONGODB_URI` en majuscules)
- ✅ Redéployez le service après avoir ajouté la variable

### Erreur : "Cloudinary upload failed"
- ✅ Vérifiez que `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, et `CLOUDINARY_API_SECRET` sont corrects
- ✅ Vérifiez que votre compte Cloudinary est actif

### Erreur : "JWT_SECRET is not defined"
- ✅ Ajoutez `JWT_SECRET` dans les variables Railway
- ✅ Utilisez un secret fort (32+ caractères)

### Frontend ne peut pas se connecter au backend
- ✅ Vérifiez que `VITE_API_URL` pointe vers la bonne URL
- ✅ Vérifiez que le backend est bien déployé et accessible
- ✅ Vérifiez les logs Railway pour les erreurs CORS

---

Pour plus d'informations, consultez `GUIDE_TRANSITION_CLIENT.md`.

