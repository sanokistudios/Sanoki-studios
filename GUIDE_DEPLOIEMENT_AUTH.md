# 🚀 Guide de Déploiement Railway - Système Complet

## 📋 Variables d'Environnement à Ajouter

### 🔙 Backend Service (`happy-hope-production`)

**Variables existantes à vérifier :**
- ✅ `MONGODB_URI`
- ✅ `JWT_SECRET`
- ✅ `FRONTEND_URL`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

**Nouvelles variables à ajouter :**

```env
# Mailtrap (Development/Staging)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=VOTRE_MAILTRAP_USER
MAILTRAP_PASS=VOTRE_MAILTRAP_PASSWORD

# Email Configuration
EMAIL_FROM="Boutique T-shirts <noreply@example.com>"
ADMIN_EMAIL=admin@example.com

# Node Environment
NODE_ENV=production
```

### 🎨 Frontend Service (`ecommerce-vetements-production`)

**Variables déjà configurées :**
- ✅ `VITE_API_URL` = `https://happy-hope-production.up.railway.app/api`
- ✅ `VITE_SOCKET_URL` = `https://happy-hope-production.up.railway.app`

---

## 🔄 Déploiement

### 1. Push sur GitHub

```bash
cd ecommerce-vetements
git add .
git commit -m "Feat: Système d'authentification complet"
git push origin main
```

### 2. Railway redéploie automatiquement

- Backend : 2-3 minutes
- Frontend : 3-5 minutes

### 3. Vérifier les déploiements

**Backend :**
```
https://happy-hope-production.up.railway.app/api/health
```
Devrait retourner : `{"status":"OK"}`

**Frontend :**
```
https://ecommerce-vetements-production.up.railway.app
```
Devrait afficher le site avec header "Connexion / Inscription"

---

## 🔐 Créer un Admin en Production

### Option 1 : Via API (recommandé)

```bash
curl -X POST https://happy-hope-production.up.railway.app/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@votredomaine.com","password":"VOTRE_MOT_DE_PASSE_SECURISE"}'
```

### Option 2 : Via Railway Shell

1. Railway Dashboard → Backend Service → Shell
2. Exécuter :
```bash
node scripts/create-admin.js
```

---

## 🧪 Tests en Production

### 1. Test Inscription

1. Aller sur `https://ecommerce-vetements-production.up.railway.app/inscription`
2. Créer un compte
3. ✅ Vérifier email de bienvenue dans Mailtrap
4. ✅ Vérifier connexion automatique

### 2. Test Chat Utilisateur

1. Connecté, vérifier bulle bleue en bas à droite
2. Envoyer un message
3. ✅ Message envoyé

### 3. Test Admin Messages

1. Se déconnecter
2. Aller sur `/admin/login`
3. Connexion admin
4. Aller dans "Messages"
5. ✅ Voir la conversation
6. Répondre
7. ✅ Réponse envoyée

### 4. Test Temps Réel

**Deux onglets ouverts :**
- Onglet 1 : Utilisateur connecté avec chat ouvert
- Onglet 2 : Admin dans Messages

**Action :**
- Admin envoie un message
- ✅ L'utilisateur le reçoit **instantanément** sans refresh

### 5. Test Contact (Invités)

1. Déconnecté, aller sur `/contact`
2. Envoyer un message
3. ✅ Email reçu par admin dans Mailtrap
4. ✅ Email confirmation reçu par client dans Mailtrap

### 6. Test Commande avec Compte

1. Utilisateur connecté
2. Ajouter produit au panier → Commander
3. ✅ Formulaire pré-rempli
4. Valider commande
5. ✅ Email confirmation reçu
6. ✅ Commande visible dans Profil
7. ✅ Commande visible dans Admin → Commandes

### 7. Test Reset Password

1. `/mot-de-passe-oublie`
2. Entrer email
3. ✅ Email avec lien reçu dans Mailtrap
4. Cliquer sur lien
5. Changer mot de passe
6. ✅ Connexion automatique

---

## 📧 Passer à un SMTP Réel (Production)

Quand vous êtes prêt pour la production réelle :

### 1. Choisir un provider SMTP

**Options gratuites/peu chères :**
- **SendGrid** : 100 emails/jour gratuit
- **Mailgun** : 5000 emails/mois gratuit (3 mois)
- **Amazon SES** : 0.10$/1000 emails
- **Brevo (Sendinblue)** : 300 emails/jour gratuit

### 2. Configuration SendGrid (exemple)

1. Créer compte sur [sendgrid.com](https://sendgrid.com)
2. Créer une API Key
3. Dans Railway Backend → Variables, **supprimer** Mailtrap et **ajouter** :

```env
# Supprimer ces lignes Mailtrap
# MAILTRAP_HOST=...
# MAILTRAP_USER=...
# MAILTRAP_PASS=...

# Ajouter SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=VOTRE_SENDGRID_API_KEY
EMAIL_FROM="Votre Boutique <noreply@votredomaine.com>"
```

4. Redéployer backend
5. ✅ Les emails partent en production !

---

## 🔒 Sécurité Production

### 1. Changer les secrets

```env
# Générer un JWT_SECRET fort
JWT_SECRET=$(openssl rand -base64 32)
```

### 2. Configurer CORS strict

Dans `backend/server.js`, remplacer `allowedOrigins` :

```javascript
const allowedOrigins = [
  'https://ecommerce-vetements-production.up.railway.app',
  'https://votredomaine.com' // Si domaine personnalisé
];
```

### 3. Rate Limiting (recommandé)

Installer :
```bash
cd backend
npm install express-rate-limit
```

Dans `backend/server.js` :
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes max
  message: 'Trop de tentatives, réessayez dans 15 minutes'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/contact', authLimiter);
```

---

## 🌐 Domaine Personnalisé (Optionnel)

### 1. Acheter un domaine

Exemples : Namecheap, Google Domains, OVH

### 2. Configurer dans Railway

**Frontend :**
1. Railway → Frontend Service → Settings → Domains
2. Add Domain → Entrer `votredomaine.com`
3. Suivre les instructions DNS

**Backend :**
1. Railway → Backend Service → Settings → Domains
2. Add Domain → Entrer `api.votredomaine.com`

### 3. Mettre à jour les variables

**Backend :**
```env
FRONTEND_URL=https://votredomaine.com
```

**Frontend :**
```env
VITE_API_URL=https://api.votredomaine.com/api
VITE_SOCKET_URL=https://api.votredomaine.com
```

---

## 📊 Monitoring

### Logs Backend

Railway → Backend Service → Logs

**Vérifier :**
- ✅ "MongoDB connecté"
- ✅ "Socket.io activé"
- ✅ "Serveur démarré sur le port X"

**Erreurs à surveiller :**
- ❌ "MongoDB connection error" → Vérifier MONGODB_URI
- ❌ "Token invalide" → Vérifier JWT_SECRET
- ❌ "Erreur envoi email" → Vérifier SMTP config

### Logs Frontend

Railway → Frontend Service → Logs

**Vérifier :**
- ✅ "Build completed"
- ✅ "Preview server running"

---

## 🐛 Troubleshooting

### "CORS error" après déploiement

**Cause :** URL frontend mal configurée dans backend

**Solution :**
```bash
# Backend → Variables
FRONTEND_URL=https://ecommerce-vetements-production.up.railway.app

# Sans slash à la fin !
```

### Chat ne fonctionne pas en production

**Cause :** WebSocket bloqué ou authentification Socket.io

**Solution :**
1. Vérifier que Socket.io est activé (logs backend)
2. Vérifier CORS pour Socket.io (backend/server.js)
3. Tester avec `https://` (pas `http://`)

### Emails non envoyés

**Cause :** SMTP mal configuré

**Solution :**
1. Vérifier logs backend pour erreurs Nodemailer
2. Vérifier credentials Mailtrap/SendGrid
3. Tester SMTP avec :
```bash
curl -X POST https://happy-hope-production.up.railway.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","surname":"User","email":"test@example.com","message":"Test email"}'
```

### "Database operation timed out"

**Cause :** MongoDB Atlas IP whitelist

**Solution :**
1. MongoDB Atlas → Network Access
2. Add IP Address → `0.0.0.0/0` (Allow all)

---

## ✅ Checklist Déploiement

**Avant le déploiement :**
- [ ] `.env` backend configuré localement
- [ ] Tests locaux passent (voir GUIDE_DEMARRAGE_AUTH.md)
- [ ] Compte Mailtrap créé et configuré
- [ ] Admin créé en local

**Après le déploiement :**
- [ ] Variables Railway backend ajoutées
- [ ] Variables Railway frontend vérifiées
- [ ] Backend health check OK
- [ ] Frontend s'affiche
- [ ] Admin créé en production
- [ ] Test inscription OK
- [ ] Test chat utilisateur OK
- [ ] Test admin messages OK
- [ ] Test temps réel OK
- [ ] Test emails OK (Mailtrap)
- [ ] Test commande avec compte OK
- [ ] Test reset password OK

---

## 🎉 Déploiement Réussi !

Votre site e-commerce avec authentification est maintenant en ligne ! 🚀

**URLs de production :**
- 🌐 Site : `https://ecommerce-vetements-production.up.railway.app`
- 🔧 API : `https://happy-hope-production.up.railway.app/api`
- 👤 Admin : `https://ecommerce-vetements-production.up.railway.app/admin/login`

**Prochaines étapes recommandées :**
1. Passer à un SMTP réel (SendGrid/Mailgun)
2. Configurer un domaine personnalisé
3. Ajouter Google Analytics
4. Configurer les meta tags SEO
5. Ajouter un système de reviews produits

