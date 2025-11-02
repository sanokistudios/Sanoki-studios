# 🚀 Guide Complet de Déploiement sur Railway

Ce guide vous accompagne étape par étape pour déployer le site e-commerce sur Railway avec Cloudinary.

---

## 📋 Prérequis

Avant de commencer, vous devez avoir :

1. ✅ **Compte Railway** créé ([railway.app](https://railway.app))
2. ✅ **Compte Cloudinary** créé ([cloudinary.com](https://cloudinary.com))
3. ✅ **Compte MongoDB Atlas** créé ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
4. ✅ **Repository GitHub** avec le code : `https://github.com/sanokistudios/Sanoki-studios.git`

---

## 🎯 Étape 1 : Récupérer les Identifiants Cloudinary

### 1.1 Se connecter à Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Connectez-vous au compte Cloudinary du client
3. Allez dans le **Dashboard**

### 1.2 Récupérer les identifiants

Dans le Dashboard, cliquez sur le **⚙️ Settings** (en haut à droite), puis **Product Environment Credentials**.

Vous verrez :
- **Cloud Name** : Exemple : `dxy6k7p9m`
- **API Key** : Exemple : `123456789012345`
- **API Secret** : Exemple : `abcdefghijklmnopqrstuvwxyz123456`

⚠️ **Copiez ces 3 valeurs** - vous en aurez besoin pour Railway !

---

## 🗄️ Étape 2 : Récupérer MongoDB URI

### 2.1 Se connecter à MongoDB Atlas

1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Connectez-vous
3. Allez dans **Database** → Sélectionnez votre cluster

### 2.2 Récupérer la Connection String

1. Cliquez sur **Connect**
2. Choisissez **Connect your application**
3. Copiez la **Connection String**
   - Format : `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
4. **Remplacez `<password>`** par le mot de passe réel de l'utilisateur
5. **Ajoutez le nom de la base** : `/ecommerce?` avant `retryWrites`
   - Résultat : `mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority`

⚠️ **Copiez cette URI complète** - vous en aurez besoin pour Railway !

---

## 🚂 Étape 3 : Créer le Projet Railway

### 3.1 Créer un nouveau projet

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous
3. Cliquez sur **New Project**
4. Choisissez **Deploy from GitHub repo**
5. Sélectionnez le repository : `sanokistudios/Sanoki-studios`
6. Railway va détecter automatiquement le projet

### 3.2 Créer le service Backend

1. Railway va créer un service automatiquement
2. **Renommez-le** en cliquant sur son nom : `Backend`
3. Dans **Settings** → **Root Directory**, vérifiez ou mettez : `backend`
4. Railway détectera automatiquement Node.js

### 3.3 Créer le service Frontend

1. Dans le projet Railway, cliquez sur **+ New**
2. Sélectionnez **GitHub Repo** → `sanokistudios/Sanoki-studios`
3. **Renommez-le** : `Frontend`
4. Dans **Settings** → **Root Directory**, mettez : `frontend`

---

## 🔧 Étape 4 : Configurer le Backend sur Railway

### 4.1 Ouvrir les variables d'environnement

1. Cliquez sur le service **Backend**
2. Allez dans l'onglet **Variables**

### 4.2 Ajouter toutes les variables Backend

Cliquez sur **+ New Variable** et ajoutez **une par une** :

```env
# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Cloudinary (remplacez par les VRAIES valeurs du compte client)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# JWT Secret (générez-en un nouveau sécurisé)
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_256_bits

# Frontend URL (sera mis à jour après déploiement du frontend)
FRONTEND_URL=https://frontend-production.up.railway.app

# Environnement
NODE_ENV=production
PORT=5000
```

**OU** utilisez l'**Raw Editor** :
1. Cliquez sur **Raw Editor** (en haut à droite des variables)
2. Collez tout le bloc ci-dessus
3. Remplacez les valeurs par les vraies valeurs
4. Cliquez sur **Save**

### 4.3 Générer un JWT Secret

Pour générer un JWT Secret sécurisé :

**Sur macOS/Linux :**
```bash
openssl rand -base64 32
```

**Sur Windows PowerShell :**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**OU** en ligne : [randomkeygen.com](https://randomkeygen.com/) → Utilisez un "CodeIgniter Encryption Keys" (256 bits)

### 4.4 Vérifier la configuration

1. **Root Directory** : `backend`
2. **Build Command** : (automatique) `npm install`
3. **Start Command** : `npm start`

### 4.5 Déployer le Backend

1. Railway va automatiquement détecter les changements et déployer
2. Attendez 2-3 minutes
3. Une fois déployé, copiez l'URL générée :
   - Exemple : `https://backend-production-xxxx.up.railway.app`
   - ⚠️ **SAUVEZGARDEZ CETTE URL** - vous en aurez besoin pour le frontend !

---

## 🎨 Étape 5 : Configurer le Frontend sur Railway

### 5.1 Ouvrir les variables d'environnement

1. Cliquez sur le service **Frontend**
2. Allez dans l'onglet **Variables**

### 5.2 Ajouter les variables Frontend

Ajoutez ces variables (remplacez `https://backend-production-xxxx.up.railway.app` par l'URL réelle du backend) :

```env
# Backend API URL (remplacez par l'URL réelle du backend)
VITE_API_URL=https://backend-production-xxxx.up.railway.app/api

# Socket.io URL (même URL que le backend sans /api)
VITE_SOCKET_URL=https://backend-production-xxxx.up.railway.app

# Port (géré automatiquement par Railway)
PORT=4173
```

### 5.3 Vérifier la configuration

1. **Root Directory** : `frontend`
2. **Build Command** : `npm run build`
3. **Start Command** : `npm run preview`

### 5.4 Déployer le Frontend

1. Railway va builder et déployer automatiquement
2. Attendez 3-5 minutes (le build prend plus de temps)
3. Une fois déployé, copiez l'URL générée :
   - Exemple : `https://frontend-production-xxxx.up.railway.app`
   - ⚠️ **SAUVEZGARDEZ CETTE URL** !

---

## 🔄 Étape 6 : Mettre à Jour les URLs

### 6.1 Mettre à jour le Backend

Retournez dans le service **Backend** → **Variables** :

1. Trouvez `FRONTEND_URL`
2. Remplacez la valeur par l'URL réelle du frontend :
   ```env
   FRONTEND_URL=https://frontend-production-xxxx.up.railway.app
   ```
3. Cliquez sur **Save**

Railway va redéployer automatiquement le backend.

### 6.2 Vérifier que tout fonctionne

#### Backend
1. Ouvrez : `https://backend-production-xxxx.up.railway.app/api/health`
2. Vous devriez voir : `{"status":"OK","message":"Server is running"}`

#### Frontend
1. Ouvrez : `https://frontend-production-xxxx.up.railway.app`
2. Le site devrait s'afficher correctement

---

## 👤 Étape 7 : Créer le Compte Admin

### 7.1 Via Railway Shell (Recommandé)

1. Dans Railway, ouvrez le service **Backend**
2. Cliquez sur l'onglet **Deployments**
3. Cliquez sur le dernier déploiement
4. Cliquez sur **Shell** (ou utilisez l'onglet Shell dans le service)

5. Dans le shell, exécutez :
   ```bash
   cd backend
   node scripts/create-admin.js
   ```

### 7.2 Vérifier les variables nécessaires

Le script utilise ces variables d'environnement :
- `ADMIN_EMAIL` (optionnel, défaut: `admin@example.com`)
- `ADMIN_PASSWORD` (optionnel, défaut: `admin123`)
- `MONGODB_URI` (obligatoire)

Si vous voulez créer un admin avec des identifiants spécifiques, ajoutez dans les variables Backend :
```env
ADMIN_EMAIL=admin@sanokistudios.com
ADMIN_PASSWORD=votre_mot_de_passe_securise
```

Puis exécutez le script.

### 7.3 Se connecter à l'admin

1. Ouvrez : `https://frontend-production-xxxx.up.railway.app/admin`
2. Connectez-vous avec :
   - Email : `admin@example.com` (ou celui défini dans `ADMIN_EMAIL`)
   - Mot de passe : `admin123` (ou celui défini dans `ADMIN_PASSWORD`)

⚠️ **Important** : Changez le mot de passe immédiatement après la première connexion !

---

## ✅ Étape 8 : Vérifications Finales

### Checklist de vérification

- [ ] **Backend déployé** et accessible (`/api/health` retourne OK)
- [ ] **Frontend déployé** et accessible
- [ ] **Variables d'environnement** toutes configurées
- [ ] **URLs mises à jour** (`FRONTEND_URL` dans backend)
- [ ] **Compte admin créé** et accessible
- [ ] **Upload d'images fonctionnel** (testez en ajoutant un produit)
- [ ] **Site fonctionne** correctement

### Tests à faire

1. **Test d'upload d'image** :
   - Connectez-vous à `/admin`
   - Allez dans "Gestion des Produits"
   - Cliquez sur "Ajouter un produit"
   - Essayez d'uploader une image
   - Si ça fonctionne, Cloudinary est bien configuré ! ✅

2. **Test de connexion MongoDB** :
   - Si le backend démarre sans erreur, MongoDB est connecté ✅

3. **Test du chat** :
   - Ouvrez le site en tant qu'utilisateur
   - Cliquez sur le widget de chat
   - Envoyez un message
   - Si le chat fonctionne, Socket.io est bien configuré ✅

---

## 🆘 Résolution de Problèmes

### Erreur : "Cannot connect to MongoDB"
- ✅ Vérifiez que `MONGODB_URI` est correct
- ✅ Vérifiez que le mot de passe dans l'URI n'a pas de caractères spéciaux mal échappés
- ✅ Vérifiez que MongoDB Atlas autorise les connexions depuis Railway (Network Access)

### Erreur : "Cloudinary upload failed"
- ✅ Vérifiez que `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, et `CLOUDINARY_API_SECRET` sont corrects
- ✅ Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
- ✅ Vérifiez que le compte Cloudinary est actif

### Erreur : "CORS error"
- ✅ Vérifiez que `FRONTEND_URL` dans le backend correspond exactement à l'URL du frontend
- ✅ Vérifiez qu'il n'y a pas de slash `/` à la fin

### Frontend ne se connecte pas au backend
- ✅ Vérifiez que `VITE_API_URL` pointe vers `/api` à la fin
- ✅ Vérifiez que `VITE_SOCKET_URL` est la même URL que le backend (sans `/api`)
- ✅ Vérifiez que le backend est bien déployé et accessible

### Build échoue
- ✅ Vérifiez les logs dans Railway (onglet "Deployments" → "View Logs")
- ✅ Vérifiez que toutes les dépendances sont dans `package.json`
- ✅ Vérifiez que `node_modules` n'est pas commité (dans .gitignore)

---

## 🎉 Félicitations !

Votre site e-commerce est maintenant déployé sur Railway ! 🚀

### URLs à sauvegarder

- **Frontend** : `https://frontend-production-xxxx.up.railway.app`
- **Backend API** : `https://backend-production-xxxx.up.railway.app/api`
- **Admin Panel** : `https://frontend-production-xxxx.up.railway.app/admin`

### Prochaines étapes (optionnel)

- 🌐 **Ajouter un domaine personnalisé** : Railway → Settings → Domains
- 📧 **Configurer les emails** : Voir `CONFIG_EMAIL.md`
- 🔒 **Renforcer la sécurité** : Voir `SECURITE.md`
- 💾 **Sauvegarder MongoDB** : Configurez les sauvegardes automatiques dans MongoDB Atlas

---

**Bon déploiement ! 🎯**

