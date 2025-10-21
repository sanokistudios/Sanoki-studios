# 🚀 Guide de Démarrage - Système d'Authentification

## 📋 Prérequis

- Node.js (v18+)
- MongoDB Atlas compte (gratuit)
- Mailtrap compte (gratuit, pour les emails en dev)

---

## 🔧 Configuration Backend

### 1. Installer les dépendances

```bash
cd backend
npm install
```

### 2. Configurer `.env`

Créez `backend/.env` :

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas (Remplacez par vos vraies credentials)
MONGODB_URI=mongodb+srv://VOTRE_USER:VOTRE_PASSWORD@cluster0.XXXXX.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=super_secret_key_change_in_production_123456789

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Mailtrap (créez un compte sur https://mailtrap.io)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=VOTRE_MAILTRAP_USER
MAILTRAP_PASS=VOTRE_MAILTRAP_PASSWORD

# Email Configuration
EMAIL_FROM="Boutique T-shirts <noreply@example.com>"
ADMIN_EMAIL=admin@example.com

# Cloudinary (Obtenez vos credentials sur cloudinary.com)
CLOUDINARY_CLOUD_NAME=VOTRE_CLOUD_NAME
CLOUDINARY_API_KEY=VOTRE_API_KEY
CLOUDINARY_API_SECRET=VOTRE_API_SECRET
```

### 3. Créer un compte admin

```bash
cd backend
node scripts/create-admin.js
```

Ou via API :
```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123"}'
```

### 4. Lancer le backend

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

---

## 🎨 Configuration Frontend

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Lancer le frontend

```bash
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`

---

## 🧪 Tests Locaux

### 1. Inscription Utilisateur

1. Aller sur `http://localhost:5173/inscription`
2. Remplir le formulaire :
   - Nom : Test User
   - Email : test@example.com
   - Téléphone : +216 XX XXX XXX
   - Mot de passe : test1234 (min 8 caractères)
3. Cliquer "S'inscrire"
4. ✅ Vous êtes connecté automatiquement

### 2. Chat Utilisateur

1. **Après connexion**, une bulle bleue apparaît en bas à droite
2. Cliquer dessus pour ouvrir le chat
3. Envoyer un message : "Bonjour, j'ai une question"
4. ✅ Le message est envoyé

### 3. Admin - Voir les messages

1. Se déconnecter (Profil → Déconnexion)
2. Aller sur `http://localhost:5173/admin/login`
3. Connexion : `admin@example.com` / `admin123`
4. Aller dans "Messages"
5. ✅ Voir la conversation avec "Test User"
6. Cliquer sur la conversation
7. ✅ Voir le message "Bonjour, j'ai une question"
8. Répondre : "Bonjour ! Comment puis-je vous aider ?"

### 4. Utilisateur - Voir la réponse

1. Se déconnecter de l'admin
2. Se reconnecter avec `test@example.com` / `test1234`
3. Ouvrir le chat (bulle bleue)
4. ✅ Voir la réponse de l'admin en temps réel

### 5. Commande avec compte

1. Connecté en tant qu'utilisateur
2. Aller dans "Boutique"
3. Cliquer sur un produit → Choisir taille → Ajouter au panier
4. Panier → Commander
5. ✅ Le formulaire est pré-rempli avec vos infos
6. Valider la commande

### 6. Historique commandes

1. Aller dans "Profil" (clic sur votre nom en haut)
2. ✅ Voir vos commandes dans "Mes commandes"

### 7. Contact (Invités)

1. Se déconnecter
2. ✅ Le lien "Contact" apparaît dans le menu
3. ✅ La bulle de chat a disparu
4. Cliquer sur "Contact"
5. Remplir le formulaire → Envoyer
6. ✅ Email envoyé (visible dans Mailtrap)

### 8. Reset Password

1. Déconnecté, aller sur `/connexion`
2. Cliquer "Mot de passe oublié ?"
3. Entrer `test@example.com`
4. ✅ Email envoyé (voir Mailtrap)
5. Copier le lien du mail
6. Coller dans le navigateur
7. Entrer nouveau mot de passe
8. ✅ Mot de passe changé et connecté automatiquement

---

## 📧 Configuration Mailtrap

1. Aller sur [mailtrap.io](https://mailtrap.io)
2. Créer un compte gratuit
3. Dans "Email Testing" → "Inboxes" → "My Inbox"
4. Cliquer "Show Credentials"
5. Copier :
   - **Host** : `sandbox.smtp.mailtrap.io`
   - **Port** : `2525`
   - **Username** : votre username
   - **Password** : votre password
6. Coller dans `backend/.env`

---

## 🔍 Vérifications

### Backend

✅ `http://localhost:5000/api/health` → `{"status":"OK"}`  
✅ `http://localhost:5000/api/products` → Liste des produits  
✅ Console backend : "MongoDB connecté", "Socket.io activé"

### Frontend

✅ Site s'affiche sur `http://localhost:5173`  
✅ Header affiche "Connexion" / "Inscription" si déconnecté  
✅ Header affiche votre nom si connecté  
✅ Bulle de chat bleue visible uniquement si connecté

---

## 🐛 Problèmes courants

### "MongoDB connection error"
- Vérifiez `MONGODB_URI` dans `.env`
- Vérifiez que votre IP est autorisée dans MongoDB Atlas (Network Access → 0.0.0.0/0)

### "Token invalide" lors de la connexion
- Vérifiez `JWT_SECRET` dans `.env`
- Videz le localStorage : F12 → Application → Local Storage → Clear

### Emails non reçus
- Vérifiez Mailtrap credentials dans `.env`
- Vérifiez les logs backend pour erreurs Nodemailer

### Chat ne fonctionne pas
- Vérifiez que Socket.io est activé (logs backend)
- Vérifiez la console navigateur (F12) pour erreurs WebSocket

---

## 🎉 Tout fonctionne ?

Si tous les tests passent, vous êtes prêt pour le déploiement Railway ! 🚀

Voir `GUIDE_DEPLOIEMENT_AUTH.md` pour les instructions de déploiement.

