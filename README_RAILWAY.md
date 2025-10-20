# 🚂 Déploiement Railway - Checklist Rapide

## ✅ Ce qui est déjà configuré

- ✅ MongoDB Atlas : Base de données cloud
- ✅ Cloudinary : Stockage d'images
- ✅ Backend : API + Socket.io
- ✅ Frontend : React + Vite
- ✅ Fichiers de configuration Railway

## 🚀 Déploiement en 3 étapes

### 1️⃣ Pousser sur GitHub

```bash
cd ecommerce-vetements
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/ecommerce-vetements.git
git push -u origin main
```

### 2️⃣ Créer un projet Railway

1. https://railway.app → New Project
2. Deploy from GitHub repo
3. Sélectionner `ecommerce-vetements`

### 3️⃣ Configurer 2 services

#### 🔹 Service 1 : Backend
**Root Directory:** `backend`

**Variables d'environnement:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://VOTRE_USER:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce
JWT_SECRET=votre_secret_jwt_securise
ADMIN_EMAIL=admin@votredomaine.com
ADMIN_PASSWORD=votre_mot_de_passe
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
FRONTEND_URL=https://votre-frontend.railway.app
```

#### 🔹 Service 2 : Frontend
**Root Directory:** `frontend`

**Variables d'environnement:**
```
VITE_API_URL=https://votre-backend.railway.app/api
VITE_SOCKET_URL=https://votre-backend.railway.app
```

## 🔄 Après déploiement

1. ✅ Copier l'URL du backend
2. ✅ Mettre à jour `VITE_API_URL` et `VITE_SOCKET_URL` dans le frontend
3. ✅ Copier l'URL du frontend
4. ✅ Mettre à jour `FRONTEND_URL` dans le backend
5. ✅ Redéployer (automatique)

## 🎯 URLs finales

- **Site web:** https://xxx-frontend.railway.app
- **Admin:** https://xxx-frontend.railway.app/admin
- **API:** https://xxx-backend.railway.app/api

## 📚 Documentation complète

Voir `DEPLOIEMENT_RAILWAY.md` pour le guide détaillé.

---

**Temps estimé : 10-15 minutes** ⏱️

