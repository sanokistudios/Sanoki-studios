# 🚂 Déploiement sur Railway - Guide Complet

## 🎯 Vue d'ensemble

Railway permet de déployer facilement le backend et le frontend séparément, avec MongoDB Atlas et Cloudinary déjà configurés.

---

## 📋 Prérequis

- ✅ Compte GitHub
- ✅ Compte Railway (gratuit : https://railway.app)
- ✅ MongoDB Atlas configuré (déjà fait ✅)
- ✅ Cloudinary configuré (déjà fait ✅)

---

## 🚀 Étape 1 : Pousser sur GitHub

### 1. Initialiser Git (si pas déjà fait)

```bash
cd C:\Users\sami\Desktop\Etudes\Freelance\ecommerce-vetements
git init
git add .
git commit -m "Initial commit - E-commerce complet"
```

### 2. Créer un repo sur GitHub

1. Aller sur https://github.com/new
2. Nom du repo : `ecommerce-vetements`
3. Visibilité : **Private** (recommandé)
4. Ne pas cocher "Initialize with README"
5. Cliquer sur "Create repository"

### 3. Pousser le code

```bash
git remote add origin https://github.com/VOTRE_USERNAME/ecommerce-vetements.git
git branch -M main
git push -u origin main
```

---

## 🚂 Étape 2 : Configurer Railway

### 1. Créer un compte Railway

1. Aller sur https://railway.app
2. S'inscrire avec GitHub (recommandé)
3. Vérifier l'email

### 2. Créer un nouveau projet

1. Cliquer sur "New Project"
2. Choisir "Deploy from GitHub repo"
3. Sélectionner `ecommerce-vetements`
4. Railway va détecter automatiquement le projet

---

## 🔧 Étape 3 : Déployer le Backend

### 1. Configuration du service Backend

Railway va créer un service automatiquement. Configurez-le :

1. **Root Directory** : `backend`
2. **Build Command** : `npm install`
3. **Start Command** : `npm start`

### 2. Variables d'environnement Backend

Dans l'onglet "Variables", ajouter :

```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://VOTRE_USER:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT (Générer une clé aléatoire sécurisée)
JWT_SECRET=votre_secret_jwt_ultra_securise_a_generer

# Admin
ADMIN_EMAIL=admin@votredomaine.com
ADMIN_PASSWORD=votre_mot_de_passe_securise

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Frontend URL (à modifier après déploiement du frontend)
FRONTEND_URL=https://votre-frontend.railway.app
```

### 3. Déployer

1. Railway va automatiquement builder et déployer
2. Attendre 2-3 minutes
3. Copier l'URL générée (ex: `https://ecommerce-backend-production.railway.app`)

---

## 🎨 Étape 4 : Déployer le Frontend

### 1. Ajouter un nouveau service

1. Dans le même projet Railway
2. Cliquer sur "New Service"
3. Choisir "GitHub repo"
4. Sélectionner le même repo
5. **Root Directory** : `frontend`

### 2. Variables d'environnement Frontend

```env
VITE_API_URL=https://VOTRE_URL_BACKEND.railway.app/api
VITE_SOCKET_URL=https://VOTRE_URL_BACKEND.railway.app
```

⚠️ **Important** : Remplacer `VOTRE_URL_BACKEND` par l'URL du backend déployé à l'étape 3.

### 3. Configuration Build

Railway devrait détecter automatiquement Vite, mais vérifiez :

- **Build Command** : `npm run build`
- **Start Command** : `npm run preview` (ou utilisez un serveur static)

### 4. Déployer

Railway va builder et déployer le frontend.

---

## 🔄 Étape 5 : Mettre à jour les URLs

### 1. Mettre à jour le Backend

Retournez dans les variables du **Backend** et mettez à jour :

```env
FRONTEND_URL=https://votre-frontend-url.railway.app
```

Puis redéployez (Railway le fait automatiquement).

### 2. Mettre à jour MongoDB Atlas (Sécurité)

1. Aller sur MongoDB Atlas
2. **Network Access**
3. Au lieu de `0.0.0.0/0`, ajouter les IPs de Railway
   - Ou garder `0.0.0.0/0` pour simplicité (moins sécurisé)

---

## ✅ Vérifications

### Backend
```
https://votre-backend.railway.app/api/health
```
Devrait retourner : `{"status":"OK","message":"Server is running"}`

### Frontend
```
https://votre-frontend.railway.app
```
Devrait afficher le site web

### Admin
```
https://votre-frontend.railway.app/admin
```
- Email : `admin@example.com`
- Mot de passe : `admin123`

---

## 🎯 Commandes Utiles Railway CLI (optionnel)

### Installer Railway CLI

```bash
npm install -g @railway/cli
```

### Déployer depuis le terminal

```bash
railway login
railway link
railway up
```

---

## 📊 Architecture Déployée

```
┌─────────────────────────────────────────┐
│           MongoDB Atlas (Cloud)         │
│            [VOTRE_CLUSTER]              │
└─────────────────────────────────────────┘
                    ↑
                    │
┌─────────────────────────────────────────┐
│      Backend (Railway)                  │
│   Node.js + Express + Socket.io         │
│   Port: 5000                            │
│   URL: xxx-backend.railway.app          │
└─────────────────────────────────────────┘
                    ↑
                    │
┌─────────────────────────────────────────┐
│      Frontend (Railway)                 │
│       React + Vite                      │
│   URL: xxx-frontend.railway.app         │
└─────────────────────────────────────────┘
                    ↑
                    │
┌─────────────────────────────────────────┐
│       Cloudinary (Images)               │
│        [VOTRE_CLOUD_NAME]               │
└─────────────────────────────────────────┘
```

---

## 💡 Conseils

### Performance
- Railway met en veille les services gratuits après 15min d'inactivité
- Premier chargement peut être lent (réveil du service)

### Logs
- Accéder aux logs dans l'onglet "Deployments" de chaque service
- Utile pour débugger

### Redéploiement
- Chaque push sur GitHub déclenche un redéploiement automatique
- Ou redéployer manuellement depuis Railway

### Domaine personnalisé
- Railway permet d'ajouter un domaine custom
- Aller dans "Settings" → "Domains"

---

## 🆘 Problèmes Courants

### Backend ne démarre pas
➡️ Vérifier les logs
➡️ Vérifier les variables d'environnement
➡️ Vérifier la connexion MongoDB

### Frontend affiche une erreur API
➡️ Vérifier que `VITE_API_URL` pointe vers le bon backend
➡️ Vérifier que le backend est accessible

### Chat ne fonctionne pas
➡️ Vérifier `VITE_SOCKET_URL`
➡️ Vérifier `FRONTEND_URL` dans le backend
➡️ WebSocket doit être activé sur Railway (l'est par défaut)

### Images ne s'uploadent pas
➡️ Vérifier les credentials Cloudinary
➡️ Vérifier les logs du backend

---

## 🎉 Résultat Final

Une fois déployé, vous aurez :

✅ Backend API accessible mondialement  
✅ Frontend hébergé et rapide  
✅ Base de données MongoDB Atlas  
✅ Images sur Cloudinary  
✅ Chat temps réel fonctionnel  
✅ SSL/HTTPS automatique  
✅ Déploiement automatique à chaque commit  

**Coût : $0 (plan gratuit Railway) 🎉**

---

## 📚 Ressources

- Railway Docs : https://docs.railway.app
- MongoDB Atlas : https://cloud.mongodb.com
- Cloudinary : https://cloudinary.com/console

---

**Prêt pour la production ! 🚀🇹🇳**

