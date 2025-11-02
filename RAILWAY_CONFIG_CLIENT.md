# 🚂 Configuration Railway - Variables d'Environnement Client

Ce fichier liste les variables d'environnement à configurer dans Railway pour le client **Sanoki Studios**.

---

## 🔧 Variables Backend (Service Backend)

Allez dans Railway → Projet → Service **Backend** → **Variables** → Ajoutez :

### ✅ Identifiants Cloudinary (Client)
⚠️ **ATTENTION : Les identifiants Cloudinary sont sensibles**  
Les valeurs réelles sont stockées localement dans `CLOUDINARY_CREDENTIALS_LOCAL.txt` (non commité).

Pour configurer Railway, utilisez les valeurs suivantes :
```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Les identifiants réels doivent être récupérés depuis :**
- Le fichier local `CLOUDINARY_CREDENTIALS_LOCAL.txt` (non tracké par Git)
- OU directement depuis le Dashboard Cloudinary du client

### 📊 Base de données MongoDB
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```
⚠️ **À remplacer** par l'URI MongoDB Atlas du client

### 🔐 JWT Secret
```env
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_256_bits
```
⚠️ **À générer** : Utilisez `openssl rand -base64 32` ou [randomkeygen.com](https://randomkeygen.com/)

### 🌐 Frontend URL
```env
FRONTEND_URL=https://frontend-production-xxxx.up.railway.app
```
⚠️ **À mettre à jour** après le déploiement du frontend avec l'URL réelle

### ⚙️ Environnement
```env
NODE_ENV=production
PORT=5000
```

### 👤 Admin (Optionnel)
```env
ADMIN_EMAIL=admin@sanokistudios.com
ADMIN_PASSWORD=votre_mot_de_passe_securise
```

---

## 🎨 Variables Frontend (Service Frontend)

Allez dans Railway → Projet → Service **Frontend** → **Variables** → Ajoutez :

### 🔗 Backend API URL
```env
VITE_API_URL=https://backend-production-xxxx.up.railway.app/api
```
⚠️ **À remplacer** par l'URL réelle du backend Railway (obtenue après déploiement)

### 🔌 Socket.io URL
```env
VITE_SOCKET_URL=https://backend-production-xxxx.up.railway.app
```
⚠️ **À remplacer** par l'URL réelle du backend Railway (même URL que ci-dessus, sans `/api`)

### 🚪 Port
```env
PORT=4173
```
⚠️ Railway gère automatiquement le port, mais cette variable peut être utile

---

## 📋 Checklist de Configuration

### Backend
- [ ] `CLOUDINARY_CLOUD_NAME` = (récupérer depuis `CLOUDINARY_CREDENTIALS_LOCAL.txt` ou Dashboard Cloudinary)
- [ ] `CLOUDINARY_API_KEY` = (récupérer depuis `CLOUDINARY_CREDENTIALS_LOCAL.txt` ou Dashboard Cloudinary)
- [ ] `CLOUDINARY_API_SECRET` = (récupérer depuis `CLOUDINARY_CREDENTIALS_LOCAL.txt` ou Dashboard Cloudinary)
- [ ] `MONGODB_URI` = URI MongoDB Atlas du client
- [ ] `JWT_SECRET` = Secret généré (32+ caractères)
- [ ] `FRONTEND_URL` = URL du frontend Railway (après déploiement)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`

### Frontend
- [ ] `VITE_API_URL` = `https://backend-xxxx.railway.app/api`
- [ ] `VITE_SOCKET_URL` = `https://backend-xxxx.railway.app`
- [ ] `PORT` = `4173`

---

## 🔒 Sécurité

⚠️ **Important** :
- Ne jamais commit ces identifiants dans Git
- Ces identifiants sont uniquement pour Railway Variables
- Le fichier `CLOUDINARY_CREDENTIALS_LOCAL.txt` est dans `.gitignore`

---

## ✅ Vérification

Après configuration :

1. **Test Backend** :
   - Ouvrez : `https://backend-xxxx.railway.app/api/health`
   - Devrait retourner : `{"status":"OK","message":"Server is running"}`

2. **Test Cloudinary** :
   - Connectez-vous à `/admin`
   - Ajoutez un produit avec une image
   - Si l'upload fonctionne, Cloudinary est bien configuré ! ✅

---

**Configuration prête ! 🚀**

