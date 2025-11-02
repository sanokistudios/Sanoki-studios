# Guide de Transition - Hébergement du Site E-commerce

Ce guide explique comment transférer le site web de votre développeur vers votre propre infrastructure (Railway, Cloudinary, etc.).

## 📋 Prérequis

Pour héberger le site vous-même, vous devez créer et configurer :

1. ✅ **Compte Railway** - Pour héberger le backend et le frontend
2. ✅ **Compte Cloudinary** - Pour stocker les images uploadées
3. ✅ **MongoDB Atlas** (recommandé) ou MongoDB via Railway - Pour la base de données
4. ✅ **Compte GitHub** - Pour accéder au code source (optionnel mais recommandé)
5. ✅ **Domaine personnalisé** (optionnel) - Si vous voulez un nom de domaine personnalisé

---

## 🚀 Étapes de Configuration

### 1. Compte Railway

#### Création du compte
1. Allez sur [railway.app](https://railway.app)
2. Créez un compte avec votre email professionnel
3. Choisissez un plan (le plan gratuit convient pour commencer)

#### Création des projets
Vous aurez besoin de **2 services Railway** :
- **Backend** - Pour l'API Node.js
- **Frontend** - Pour l'interface React

#### Lier le dépôt GitHub (optionnel)
1. Dans Railway, cliquez sur "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Connectez votre compte GitHub
4. Sélectionnez le dépôt `ecommerce-vetements`
5. Répétez pour créer un second service (frontend)

#### Configuration manuelle (alternative)
Si vous préférez ne pas connecter GitHub :
1. Créez un "New Project" → "Empty Project"
2. Dans chaque service, allez dans "Settings" → "Source"
3. Choisissez "GitHub Repo" ou "Deploy from Local CLI"

---

### 2. Compte Cloudinary

#### Création du compte
1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit (offre jusqu'à 25 GB de stockage)
3. Une fois connecté, accédez au **Dashboard**

#### Récupération des identifiants
Dans le Dashboard de Cloudinary, vous trouverez :
- **Cloud Name** - Nom de votre cloud
- **API Key** - Clé API
- **API Secret** - Secret API

⚠️ **Important** : Gardez ces informations secrètes et ne les partagez jamais publiquement.

#### Configuration du dossier
Par défaut, les images seront stockées dans le dossier `ecommerce-vetements`. Vous pouvez le changer dans les paramètres si nécessaire.

---

### 3. Base de données MongoDB

#### Option A : MongoDB Atlas (Recommandé)
1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit (M0 - Free Tier)
3. Créez un nouveau cluster (choisissez la région la plus proche)
4. Configurez un utilisateur avec mot de passe
5. Configurez l'accès réseau (ajoutez `0.0.0.0/0` pour autoriser toutes les IPs, ou mieux : les IPs de Railway)
6. Récupérez la **connection string** (URI MongoDB)
   - Format : `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

#### Option B : MongoDB via Railway
1. Dans Railway, créez un nouveau service
2. Choisissez "MongoDB" dans les templates
3. Railway créera automatiquement l'instance MongoDB
4. Récupérez la **MONGODB_URI** depuis les variables d'environnement

---

### 4. Configuration des Variables d'Environnement

#### Backend (Railway)

Dans le service **Backend** de Railway, allez dans **Variables** et ajoutez :

```env
# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Cloudinary (remplacez par VOS identifiants)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# JWT Secret (générez une chaîne aléatoire sécurisée)
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire

# URL du frontend (sera mise à jour automatiquement par Railway)
FRONTEND_URL=https://votre-site-frontend.up.railway.app

# Email (optionnel - pour les notifications)
# Configuration Mailtrap (développement)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=votre_user_mailtrap
MAILTRAP_PASS=votre_pass_mailtrap

# OU Configuration SMTP (production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
EMAIL_FROM="Boutique" <votre_email@gmail.com>
ADMIN_EMAIL=votre_email_admin@gmail.com

# Environnement
NODE_ENV=production
PORT=5000
```

#### Frontend (Railway)

Dans le service **Frontend** de Railway, allez dans **Variables** et ajoutez :

```env
# URL de l'API backend (sera mis à jour automatiquement)
VITE_API_URL=https://votre-backend.up.railway.app/api

# URL Socket.io (pour le chat en temps réel)
VITE_SOCKET_URL=https://votre-backend.up.railway.app

# Port (géré automatiquement par Railway)
PORT=4173
```

#### Génération du JWT Secret

Pour générer un JWT Secret sécurisé, utilisez une de ces méthodes :

**Option 1 : En ligne**
- Allez sur [randomkeygen.com](https://randomkeygen.com/)
- Utilisez un "CodeIgniter Encryption Keys" (256 bits)

**Option 2 : Terminal**
```bash
# Sur macOS/Linux
openssl rand -base64 32

# Sur Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

### 5. Configuration Railway pour le Déploiement

#### Backend Service

1. **Source** : Connectez le dépôt GitHub ou utilisez Railway CLI
2. **Root Directory** : `backend`
3. **Build Command** : `npm install` (automatique)
4. **Start Command** : `npm start`
5. **Environment** : Railway détectera automatiquement Node.js

#### Frontend Service

1. **Source** : Connectez le dépôt GitHub ou utilisez Railway CLI
2. **Root Directory** : `frontend`
3. **Build Command** : `npm run build`
4. **Start Command** : `npm run preview`
5. **Environment** : Railway détectera automatiquement Node.js/Vite

---

### 6. Création du Compte Admin

Une fois le backend déployé, vous devez créer le compte administrateur.

#### Option 1 : Via script (recommandé)
1. Connectez-vous à votre machine locale
2. Clonez le dépôt
3. Créez un fichier `.env` dans le dossier `backend` avec vos variables d'environnement
4. Exécutez :
```bash
cd backend
node scripts/create-admin.js
```

#### Option 2 : Via Railway Shell
1. Dans Railway, ouvrez le service backend
2. Cliquez sur "Shell"
3. Exécutez :
```bash
node scripts/create-admin.js
```

Le script créera un compte admin avec :
- Email : La valeur de `ADMIN_EMAIL` (ou `admin@example.com` par défaut)
- Password : La valeur de `ADMIN_PASSWORD` (ou `admin123` par défaut)

⚠️ **Important** : Changez le mot de passe immédiatement après la première connexion !

---

### 7. Initialisation de la Base de Données (optionnel)

Pour ajouter des données par défaut (produits d'exemple) :

```bash
cd backend
node scripts/seed-products.js
```

---

### 8. Configuration Email (Optionnel)

#### Mailtrap (pour les tests)
1. Créez un compte sur [mailtrap.io](https://mailtrap.io)
2. Récupérez les identifiants SMTP
3. Ajoutez-les dans les variables d'environnement backend

#### Gmail SMTP (pour la production)
1. Activez "App Passwords" dans votre compte Google
2. Générez un mot de passe d'application
3. Utilisez :
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=votre_email@gmail.com`
   - `SMTP_PASS=votre_app_password`

#### Autre fournisseur SMTP
Configurez selon les paramètres de votre fournisseur email.

---

## 🔐 Sécurité

### Bonnes Pratiques

1. ✅ **Ne jamais commit les fichiers `.env`** dans Git
2. ✅ **Utiliser des secrets forts** pour JWT_SECRET
3. ✅ **Limiter les accès MongoDB** aux IPs de Railway uniquement (si possible)
4. ✅ **Changer le mot de passe admin** après la première connexion
5. ✅ **Activer 2FA** sur Railway et Cloudinary si disponible
6. ✅ **Sauvegarder régulièrement** la base de données MongoDB

---

## 🌐 Domaine Personnalisé (Optionnel)

### Configuration sur Railway

1. Dans Railway, ouvrez votre service
2. Allez dans "Settings" → "Domains"
3. Cliquez sur "Generate Domain" pour obtenir un domaine Railway
4. OU ajoutez votre domaine personnalisé :
   - Ajoutez votre domaine (ex: `mon-site.com`)
   - Railway vous donnera un enregistrement DNS à ajouter
   - Ajoutez cet enregistrement dans votre registraire de domaine
   - Attendez la propagation DNS (5-30 minutes)

### Configuration CORS

Si vous utilisez un domaine personnalisé, mettez à jour `FRONTEND_URL` dans les variables d'environnement du backend.

---

## 📝 Checklist de Transfert

Avant de considérer le transfert terminé, vérifiez :

- [ ] Compte Railway créé et configuré
- [ ] Compte Cloudinary créé avec identifiants récupérés
- [ ] Base de données MongoDB configurée
- [ ] Toutes les variables d'environnement configurées
- [ ] Backend déployé et fonctionnel
- [ ] Frontend déployé et fonctionnel
- [ ] Compte admin créé et accessible
- [ ] Upload d'images fonctionnel (test avec une image)
- [ ] Site accessible publiquement
- [ ] Domaine personnalisé configuré (si applicable)
- [ ] Emails fonctionnels (si configurés)

---

## 🆘 Support et Documentation

### Documentation existante dans le projet

- `DEPLOIEMENT_RAILWAY.md` - Guide de déploiement détaillé
- `BACKEND_ENV_EXAMPLE.md` - Exemple de variables d'environnement
- `CONFIG_EMAIL.md` - Configuration email
- `GUIDE_CLOUDINARY.md` - Configuration Cloudinary

### En cas de problème

1. Vérifiez les logs dans Railway (section "Deployments" → "View Logs")
2. Vérifiez que toutes les variables d'environnement sont correctes
3. Vérifiez la connexion à MongoDB
4. Vérifiez la configuration Cloudinary

---

## 💡 Gestion Future

### Ajouter un nouveau développeur

Si vous engagez un autre développeur :
1. Partagez l'accès Railway (Settings → Team → Invite Member)
2. Partagez les identifiants Cloudinary (Dashboard → Team → Invite)
3. Partagez l'accès MongoDB Atlas (si applicable)
4. Partagez l'accès GitHub (si vous utilisez GitHub)

### Sauvegardes

- **MongoDB Atlas** : Sauvegardes automatiques (selon le plan)
- **Cloudinary** : Les images sont sauvegardées automatiquement
- **Code** : Sauvegardé dans GitHub

### Mises à jour

Pour mettre à jour le site :
1. Le développeur pousse les changements sur GitHub
2. Railway redéploie automatiquement (si connecté à GitHub)
3. OU déclenchez manuellement un redéploiement dans Railway

---

## ✅ Récapitulatif des Services Nécessaires

| Service | Usage | Coût Approx. |
|---------|-------|--------------|
| **Railway** | Hébergement backend + frontend | Gratuit jusqu'à $5/mois |
| **Cloudinary** | Stockage images | Gratuit jusqu'à 25 GB |
| **MongoDB Atlas** | Base de données | Gratuit (M0 tier) |
| **Domaine** (optionnel) | Nom de domaine | ~10-15€/an |

**Total estimé** : Gratuit pour commencer, puis ~5-10€/mois selon le trafic.

---

Félicitations ! 🎉 Votre site e-commerce est maintenant sous votre contrôle.

