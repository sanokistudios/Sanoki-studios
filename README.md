# 🛍️ Site E-commerce - Marque de Vêtements Tunisienne

Site e-commerce complet et moderne pour une marque de vêtements tunisienne, avec système de panier, commandes, et chat en temps réel.

## 🚀 Fonctionnalités

### Pour les clients :
- ✅ Navigation fluide et responsive (mobile, tablette, desktop)
- ✅ Catalogue de produits avec filtres et recherche
- ✅ Pages détaillées des produits avec sélection de taille/couleur
- ✅ Panier d'achat avec gestion des quantités
- ✅ Processus de commande simplifié
- ✅ Paiement à la livraison (Cash on Delivery)
- ✅ Chat en direct avec l'administrateur
- ✅ Page de confirmation de commande

### Pour l'administrateur :
- ✅ Interface d'administration sécurisée (JWT)
- ✅ Gestion complète des produits (CRUD)
- ✅ Suivi des commandes avec statuts
- ✅ Chat en temps réel avec les clients
- ✅ Dashboard intuitif

## 🛠️ Stack Technique

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Styling moderne
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Socket.io-client** - Chat temps réel
- **React Hot Toast** - Notifications
- **Lucide React** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **Socket.io** - Communication temps réel
- **JWT** - Authentification sécurisée
- **Bcrypt** - Hash des mots de passe

## 📦 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Cloner le projet
```bash
cd ecommerce-vetements
```

### 2. Installer les dépendances

**Installation globale (recommandée) :**
```bash
npm run install:all
```

**Ou installation manuelle :**
```bash
# Dépendances racine
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configuration des variables d'environnement

**Backend** - Créer `backend/.env` :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce-vetements
JWT_SECRET=votre_secret_jwt_super_securise_a_changer
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Créer `frontend/.env` :
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Démarrer MongoDB

**Avec MongoDB local :**
```bash
mongod
```

**Avec MongoDB Atlas :**
Modifier `MONGODB_URI` dans `backend/.env` avec votre URL de connexion.

### 5. Créer un compte administrateur

```bash
cd backend
node scripts/create-admin.js
```

Ce script créera un compte admin avec les identifiants définis dans `.env`.

## 🚀 Démarrage

### Lancement complet (Backend + Frontend) :
```bash
npm run dev
```

### Ou lancement séparé :

**Backend uniquement :**
```bash
npm run dev:backend
# Ou
cd backend && npm run dev
```

**Frontend uniquement :**
```bash
npm run dev:frontend
# Ou
cd frontend && npm run dev
```

## 🌐 Accès à l'application

- **Site web** : http://localhost:5173
- **API Backend** : http://localhost:5000
- **Admin Panel** : http://localhost:5173/admin

### Identifiants admin par défaut :
- **Email** : admin@example.com
- **Mot de passe** : admin123

⚠️ **Important** : Changez ces identifiants en production !

## 📁 Structure du projet

```
ecommerce-vetements/
├── backend/
│   ├── config/           # Configuration (DB, etc.)
│   ├── controllers/      # Contrôleurs (logique métier)
│   ├── middleware/       # Middlewares (auth, etc.)
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes API
│   ├── scripts/          # Scripts utilitaires
│   ├── uploads/          # Fichiers uploadés
│   ├── server.js         # Point d'entrée
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── context/      # Context API (Auth, Cart)
│   │   ├── pages/        # Pages du site
│   │   │   ├── admin/    # Pages admin
│   │   │   └── ...       # Pages publiques
│   │   ├── utils/        # Utilitaires (API, socket)
│   │   ├── App.jsx       # Composant racine
│   │   └── main.jsx      # Point d'entrée
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/register` - Inscription admin
- `GET /api/auth/me` - Récupérer l'utilisateur connecté

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (Admin)
- `PUT /api/products/:id` - Modifier un produit (Admin)
- `DELETE /api/products/:id` - Supprimer un produit (Admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes (Admin)
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id` - Mettre à jour le statut (Admin)

### Messages (Chat)
- `GET /api/messages` - Liste des messages
- `POST /api/messages` - Envoyer un message
- `DELETE /api/messages/:id` - Supprimer un message (Admin)

### Contact
- `POST /api/contact` - Envoyer un message de contact
- `GET /api/contact` - Liste des messages (Admin)

## 💬 Socket.io Events

### Client → Server
- `client-message` - Message du client
- `join` - Rejoindre une room

### Server → Client
- `new-message` - Nouveau message reçu

### Admin → Server
- `admin-message` - Message de l'admin

## 🎨 Personnalisation

### Couleurs et design
Modifier `frontend/tailwind.config.js` :
```javascript
colors: {
  primary: '#000000',      // Couleur principale
  secondary: '#ffffff',    // Couleur secondaire
  accent: '#2563eb',       // Couleur d'accent
}
```

### Logo et nom de marque
1. Remplacer le texte "MARQUE" dans :
   - `frontend/src/components/Header.jsx`
   - `frontend/src/components/Footer.jsx`
   - `frontend/index.html` (titre)

2. Ajouter le logo :
   - Placer le fichier dans `frontend/public/`
   - Mettre à jour le chemin dans `Header.jsx`

## 📝 Ajout de produits

### Via l'interface admin
1. Connectez-vous à `/admin`
2. Cliquez sur "Ajouter un produit"
3. Remplissez le formulaire

### Via l'API
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "T-shirt Classic",
    "description": "T-shirt en coton de qualité",
    "price": 45,
    "category": "t-shirt",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Noir", "Blanc"],
    "images": ["https://example.com/image.jpg"],
    "stock": 100,
    "featured": true
  }'
```

## 🚀 Déploiement

### Backend (Railway / Render / Heroku)
1. Créer un compte
2. Connecter le repo GitHub
3. Configurer les variables d'environnement
4. Déployer le dossier `backend`

### Frontend (Vercel / Netlify)
1. Connecter le repo GitHub
2. Configurer le dossier `frontend`
3. Définir les variables d'environnement
4. Build command : `npm run build`
5. Output directory : `dist`

### Base de données
Utiliser **MongoDB Atlas** pour une base de données cloud gratuite.

## 🐛 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est lancé
mongod --version

# Vérifier la connexion
mongo
```

### Port déjà utilisé
```bash
# Changer le port dans backend/.env
PORT=5001
```

### Problème CORS
Vérifier que `FRONTEND_URL` dans `backend/.env` correspond à l'URL du frontend.

## 📄 Licence

Ce projet est créé pour un test technique. Libre d'utilisation et de modification.

## 👨‍💻 Auteur

Projet réalisé dans le cadre d'un test technique pour une entreprise tunisienne.

## 🙏 Support

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à me contacter.

---

**Fait avec ❤️ en Tunisie** 🇹🇳

