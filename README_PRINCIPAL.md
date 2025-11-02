# 🛍️ Site E-commerce - Plateforme Complète

Site e-commerce moderne et complet avec gestion de produits (vêtements et peintures), commandes, chat en temps réel, et interface d'administration avancée.

---

## 📚 Documentation

Ce projet contient plusieurs guides pour vous aider :

### 🚀 Pour démarrer rapidement
- **[README.md](README.md)** - Installation locale et utilisation basique
- **[GUIDE_DEMARRAGE.md](GUIDE_DEMARRAGE.md)** - Guide de démarrage détaillé

### 🏗️ Pour déployer en production
- **[GUIDE_TRANSITION_CLIENT.md](GUIDE_TRANSITION_CLIENT.md)** - **⭐ Guide complet pour le client** - Configuration Railway, Cloudinary, MongoDB
- **[VARIABLES_ENVIRONNEMENT.md](VARIABLES_ENVIRONNEMENT.md)** - Référence complète des variables d'environnement
- **[DEPLOIEMENT_RAILWAY.md](DEPLOIEMENT_RAILWAY.md)** - Guide de déploiement sur Railway

### 🔧 Configuration spécifique
- **[BACKEND_ENV_EXAMPLE.md](BACKEND_ENV_EXAMPLE.md)** - Exemple de configuration backend
- **[CONFIG_EMAIL.md](CONFIG_EMAIL.md)** - Configuration email (SMTP/Mailtrap)
- **[GUIDE_CLOUDINARY.md](GUIDE_CLOUDINARY.md)** - Configuration Cloudinary
- **[GUIDE_DEMARRAGE_AUTH.md](GUIDE_DEMARRAGE_AUTH.md)** - Guide authentification

### 🔒 Sécurité
- **[SECURITE.md](SECURITE.md)** - Bonnes pratiques de sécurité
- **[SECURITY.md](SECURITY.md)** - Security guidelines

---

## ✨ Fonctionnalités

### 🛒 Pour les clients
- ✅ Catalogue de produits (T-shirts, Sweats, Accessoires)
- ✅ Catalogue de peintures/prints
- ✅ Filtres et recherche avancée
- ✅ Panier d'achat
- ✅ Commandes avec paiement à la livraison
- ✅ Chat en temps réel avec l'admin
- ✅ Page d'accueil avec carousel d'images personnalisable
- ✅ Produits "featured" sur la page d'accueil

### 👨‍💼 Pour l'administrateur
- ✅ Gestion complète des produits (CRUD)
- ✅ Gestion des peintures/prints
- ✅ Gestion des collections
- ✅ Gestion des photos d'accueil (hero images)
- ✅ Suivi des commandes
- ✅ Chat en temps réel avec les clients
- ✅ Gestion des messages de contact
- ✅ Dashboard complet

---

## 🛠️ Stack Technique

### Frontend
- **React 18** + **Vite** - Framework et build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Socket.io-client** - Chat temps réel
- **Axios** - Requêtes HTTP

### Backend
- **Node.js** + **Express** - API REST
- **MongoDB** + **Mongoose** - Base de données
- **Socket.io** - Communication temps réel
- **JWT** - Authentification
- **Cloudinary** - Stockage d'images
- **Nodemailer** - Envoi d'emails

---

## 🚀 Démarrage Rapide

### 1. Installation
```bash
# Installation globale
npm run install:all

# OU installation manuelle
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configuration
Créez les fichiers `.env` en suivant **[VARIABLES_ENVIRONNEMENT.md](VARIABLES_ENVIRONNEMENT.md)**

### 3. Lancer le projet
```bash
npm run dev  # Lance backend + frontend
```

---

## 📦 Structure du Projet

```
ecommerce-vetements/
├── backend/              # API Node.js/Express
│   ├── config/          # Configuration (DB, Cloudinary)
│   ├── controllers/     # Logique métier
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Routes API
│   └── server.js        # Point d'entrée
│
├── frontend/            # Interface React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages du site
│   │   │   └── admin/   # Interface admin
│   │   ├── context/     # Context API (Auth, Cart)
│   │   └── utils/       # Utilitaires
│   └── public/          # Assets statiques
│
└── docs/                # Documentation
```

---

## 🌐 Déploiement

### Pour le client (hébergement propre)

Suivez le guide **[GUIDE_TRANSITION_CLIENT.md](GUIDE_TRANSITION_CLIENT.md)** qui explique :
- ✅ Configuration Railway
- ✅ Configuration Cloudinary
- ✅ Configuration MongoDB Atlas
- ✅ Variables d'environnement
- ✅ Création du compte admin
- ✅ Checklist complète

---

## 📝 Notes Importantes

### ⚠️ Fichiers sensibles
- ⚠️ Ne **jamais** commiter les fichiers `.env`
- ⚠️ Les secrets sont exclus via `.gitignore`
- ⚠️ Configurez tous les secrets dans Railway/Cloudinary

### 🔐 Sécurité
- Changez le mot de passe admin par défaut
- Utilisez des secrets forts (JWT_SECRET, etc.)
- Limitez les accès MongoDB si possible

---

## 📞 Support

Pour toute question concernant le déploiement ou la configuration, consultez les guides dans ce dossier ou contactez votre développeur.

---

**Bon développement ! 🚀**

