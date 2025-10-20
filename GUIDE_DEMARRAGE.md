# 🚀 Guide de Démarrage Rapide

Ce guide vous aidera à lancer le projet en quelques minutes.

## 📋 Prérequis

Assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- [MongoDB](https://www.mongodb.com/try/download/community) (ou compte MongoDB Atlas)
- Un éditeur de code (VS Code recommandé)

## ⚡ Installation Express (5 minutes)

### Étape 1 : Installation des dépendances
```bash
npm run install:all
```

### Étape 2 : Configuration de l'environnement

**Backend** - Créer le fichier `backend/.env` :
```bash
cd backend
cp .env.example .env  # Sur Linux/Mac
# Ou copier manuellement sur Windows
```

Contenu du fichier `backend/.env` :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce-vetements
JWT_SECRET=changez_cette_cle_secrete_en_production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Créer le fichier `frontend/.env` :
```bash
cd frontend
cp .env.example .env
```

Contenu du fichier `frontend/.env` :
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Étape 3 : Lancer MongoDB

**Option A - MongoDB local :**
```bash
# Dans un nouveau terminal
mongod
```

**Option B - MongoDB Atlas (Cloud gratuit) :**
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Récupérer l'URL de connexion
4. Modifier `MONGODB_URI` dans `backend/.env`

### Étape 4 : Créer le compte administrateur
```bash
cd backend
node scripts/create-admin.js
```

### Étape 5 : (Optionnel) Ajouter des produits d'exemple
```bash
node scripts/seed-products.js
```

### Étape 6 : Lancer l'application
```bash
# Retourner à la racine du projet
cd ..

# Lancer backend + frontend
npm run dev
```

## 🎉 C'est prêt !

- **Site web** : http://localhost:5173
- **Admin** : http://localhost:5173/admin
  - Email : `admin@example.com`
  - Mot de passe : `admin123`

## 🔧 Commandes Utiles

```bash
# Lancer tout
npm run dev

# Lancer uniquement le backend
npm run dev:backend

# Lancer uniquement le frontend
npm run dev:frontend

# Créer un admin
cd backend && node scripts/create-admin.js

# Ajouter des produits d'exemple
cd backend && node scripts/seed-products.js
```

## 📱 Tester le site

### En tant que client :
1. Aller sur http://localhost:5173
2. Parcourir la boutique
3. Ajouter des produits au panier
4. Passer une commande
5. Tester le chat en bas à droite

### En tant qu'admin :
1. Aller sur http://localhost:5173/admin
2. Se connecter (admin@example.com / admin123)
3. Gérer les produits
4. Voir les commandes
5. Répondre aux messages du chat

## ❓ Problèmes Courants

### Port déjà utilisé
```bash
# Changer le port dans backend/.env
PORT=5001
```

### MongoDB ne démarre pas
```bash
# Vérifier l'installation
mongod --version

# Vérifier le service (Linux)
sudo systemctl status mongod

# Vérifier le service (Mac)
brew services list
```

### Erreur "Cannot find module"
```bash
# Réinstaller les dépendances
npm run install:all
```

### Le frontend ne se connecte pas au backend
- Vérifier que le backend est bien démarré
- Vérifier les URLs dans `frontend/.env`
- Vérifier la console du navigateur pour les erreurs

## 🚀 Prochaines Étapes

1. **Personnaliser** :
   - Changer le nom de la marque
   - Ajouter le vrai logo
   - Modifier les couleurs dans `frontend/tailwind.config.js`

2. **Ajouter du contenu** :
   - Ajouter de vrais produits via l'admin
   - Modifier les textes des pages
   - Ajouter les informations de contact

3. **Déployer** :
   - Backend sur Railway/Render
   - Frontend sur Vercel/Netlify
   - Base de données sur MongoDB Atlas

## 📚 Documentation Complète

Pour plus d'informations, consultez le [README.md](README.md) complet.

## 💡 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le terminal
2. Consultez la console du navigateur (F12)
3. Vérifiez que tous les services sont lancés
4. Relisez les étapes ci-dessus

---

**Bon développement ! 🎨**

