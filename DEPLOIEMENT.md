# 🚀 Guide de Déploiement

Ce guide vous explique comment déployer votre site e-commerce en production.

## 📋 Checklist Pré-déploiement

- [ ] Changer les identifiants admin par défaut
- [ ] Générer une nouvelle clé JWT secrète
- [ ] Configurer MongoDB Atlas (base de données cloud)
- [ ] Tester l'application en local
- [ ] Préparer les images des produits
- [ ] Configurer les variables d'environnement de production

## 🗄️ Base de Données - MongoDB Atlas

### 1. Créer un compte MongoDB Atlas
1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créer un compte gratuit
3. Créer un nouveau cluster (Free Tier - M0)

### 2. Configurer l'accès
1. **Database Access** : Créer un utilisateur
   - Username : `admin_ecommerce`
   - Password : Générer un mot de passe sécurisé
   - Rôle : `readWriteAnyDatabase`

2. **Network Access** : Autoriser les connexions
   - Ajouter `0.0.0.0/0` (toutes les IPs) pour le développement
   - En production, limiter aux IPs de votre serveur

### 3. Récupérer l'URL de connexion
1. Cliquer sur "Connect"
2. Choisir "Connect your application"
3. Copier l'URL (format : `mongodb+srv://...`)
4. Remplacer `<password>` par votre mot de passe

## 🔧 Backend - Déploiement sur Render

### 1. Préparer le backend
Créer `backend/package.json` avec un script start :
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2. Déployer sur Render
1. Créer un compte sur [Render](https://render.com)
2. Cliquer sur "New +" → "Web Service"
3. Connecter votre repo GitHub
4. Configurer :
   - **Name** : `ecommerce-backend`
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

### 3. Variables d'environnement
Dans l'onglet "Environment", ajouter :
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...  (votre URL MongoDB Atlas)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire
ADMIN_EMAIL=admin@votresite.com
ADMIN_PASSWORD=motdepassesecurise
FRONTEND_URL=https://votre-site.vercel.app
```

### 4. Déployer
Cliquer sur "Create Web Service" et attendre le déploiement.

**URL du backend** : `https://ecommerce-backend.onrender.com`

## 🎨 Frontend - Déploiement sur Vercel

### 1. Préparer le frontend
Vérifier `frontend/package.json` :
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 2. Déployer sur Vercel
1. Créer un compte sur [Vercel](https://vercel.com)
2. Cliquer sur "Add New" → "Project"
3. Importer votre repo GitHub
4. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### 3. Variables d'environnement
Dans "Settings" → "Environment Variables", ajouter :
```
VITE_API_URL=https://ecommerce-backend.onrender.com/api
VITE_SOCKET_URL=https://ecommerce-backend.onrender.com
```

### 4. Déployer
Cliquer sur "Deploy" et attendre le déploiement.

**URL du site** : `https://votre-site.vercel.app`

## 🔄 Mise à jour du Backend avec l'URL du Frontend

Retourner sur Render et mettre à jour `FRONTEND_URL` :
```
FRONTEND_URL=https://votre-site.vercel.app
```

## ✅ Vérifications Post-déploiement

### 1. Tester le backend
```bash
curl https://ecommerce-backend.onrender.com/api/health
# Devrait retourner : {"status":"OK","message":"Server is running"}
```

### 2. Créer le compte admin
```bash
# Via l'interface Render
# Aller dans "Shell" et exécuter :
node scripts/create-admin.js
```

### 3. Ajouter des produits
Deux options :
1. Via le script : `node scripts/seed-products.js`
2. Via l'interface admin du site

### 4. Tester l'application complète
- [ ] Connexion admin
- [ ] Ajout de produits
- [ ] Navigation sur le site
- [ ] Ajout au panier
- [ ] Création d'une commande
- [ ] Chat en temps réel
- [ ] Gestion des commandes (admin)

## 🔒 Sécurité en Production

### 1. Générer une clé JWT sécurisée
```bash
# Dans un terminal Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Changer les identifiants admin
Modifier `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans les variables d'environnement.

### 3. Configurer HTTPS
- Vercel et Render fournissent HTTPS automatiquement
- Vérifier que toutes les URLs utilisent `https://`

### 4. Limiter les IPs MongoDB Atlas
- Remplacer `0.0.0.0/0` par les IPs de Render
- Trouver les IPs dans la documentation Render

## 📊 Monitoring et Logs

### Render
- Onglet "Logs" : Voir les logs en temps réel
- Onglet "Metrics" : CPU, mémoire, requêtes

### Vercel
- Onglet "Logs" : Voir les builds et erreurs
- Onglet "Analytics" : Trafic et performance

## 🔄 Déploiement Continu

### Automatic Deployments
Les deux services déploient automatiquement à chaque push sur GitHub :
- **Vercel** : Déploie à chaque commit
- **Render** : Déploie à chaque commit sur la branche principale

### Preview Deployments (Vercel)
Chaque Pull Request crée un environnement de preview automatique.

## 🚨 Dépannage

### "Build failed" sur Vercel
```bash
# Vérifier localement
cd frontend
npm run build
```

### "Application error" sur Render
- Vérifier les logs dans l'onglet "Logs"
- Vérifier les variables d'environnement
- Vérifier la connexion MongoDB

### Chat ne fonctionne pas
- Vérifier `VITE_SOCKET_URL`
- Vérifier `FRONTEND_URL` dans le backend
- Vérifier les logs pour les erreurs CORS

### Images ne s'affichent pas
- Utiliser des URLs complètes (pas de chemins relatifs)
- Vérifier que les images sont accessibles publiquement
- Considérer un CDN comme Cloudinary

## 💰 Coûts

### Gratuit (pour commencer)
- MongoDB Atlas : 512 MB gratuit
- Render : 750 heures/mois gratuit
- Vercel : Illimité pour les projets personnels

### Limites du plan gratuit
- **Render** : Le service s'endort après 15 min d'inactivité
  - Solution : Utiliser un service de "ping" pour le garder actif
- **MongoDB Atlas** : Limite de 512 MB de stockage
- **Vercel** : Limite de bande passante (100 GB/mois)

## 📈 Évolution et Améliorations

### Prochaines étapes
1. Configurer un nom de domaine personnalisé
2. Ajouter Google Analytics
3. Configurer un service d'emailing (SendGrid, Mailgun)
4. Ajouter un système de paiement en ligne (Stripe, PayPal)
5. Optimiser les images (Cloudinary, ImageKit)
6. Ajouter un CDN pour les assets statiques
7. Mettre en place des backups automatiques

## 🎯 Alternatives de Déploiement

### Backend
- **Railway** : Simple et rapide, alternative à Render
- **Heroku** : Classique mais plus cher
- **DigitalOcean App Platform** : Plus de contrôle
- **AWS EC2** : Maximum de flexibilité

### Frontend
- **Netlify** : Alternative à Vercel
- **Cloudflare Pages** : CDN intégré
- **GitHub Pages** : Pour les sites statiques simples

### Base de données
- **MongoDB Cloud** : Atlas (recommandé)
- **DigitalOcean Managed MongoDB** : Alternative payante
- **AWS DocumentDB** : Compatible MongoDB

---

**Bon déploiement ! 🚀**

Si vous rencontrez des problèmes, n'hésitez pas à consulter la documentation officielle de chaque service.

