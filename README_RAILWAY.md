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
MONGODB_URI=mongodb+srv://admin_ecommerce:TxT7q8u16Fc9U9NX@cluster0.efgauoh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey_change_in_production_2024
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=duzmzztqt
CLOUDINARY_API_KEY=381188665714857
CLOUDINARY_API_SECRET=AtHHZZxMLGF9e5Dg9MMwvyh-S60
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

