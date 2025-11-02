# 🔧 Résolution des Problèmes de Déploiement Railway

## ❌ Problème : Backend Crashed

### Étapes de Diagnostic

#### 1. Vérifier les Logs Railway

1. Dans Railway, ouvrez le service **Backend**
2. Allez dans l'onglet **Deployments**
3. Cliquez sur le dernier déploiement
4. Cliquez sur **View Logs**
5. **Copiez les dernières lignes d'erreur**

### Causes Courantes

#### A. MongoDB URI Incorrecte ou Cluster Inaccessible

**Symptômes** :
- Erreur : "Cannot connect to MongoDB"
- Erreur : "Authentication failed"
- Erreur : "IP not whitelisted"

**Solutions** :

1. **Vérifier le MongoDB URI** :
   - Format : `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`
   - Vérifier que le username et password sont corrects
   - Vérifier que `cluster0.xxxxx` est remplacé par l'URL réelle

2. **Vérifier l'accès réseau MongoDB** :
   - Allez dans MongoDB Atlas → **Network Access**
   - Assurez-vous que `0.0.0.0/0` est autorisé (ou les IPs de Railway)
   - Attendez 1-2 minutes après modification

3. **Vérifier que le cluster est actif** :
   - Dans MongoDB Atlas → Database
   - Vérifiez que le cluster n'est pas en pause
   - Si c'est un cluster gratuit en pause, réveillez-le

#### B. Variables d'Environnement Manquantes

**Symptômes** :
- Erreur : "MONGODB_URI is not defined"
- Erreur : "JWT_SECRET is not defined"
- Erreur : "CLOUDINARY_xxx is not defined"

**Solutions** :

1. **Vérifier toutes les variables dans Railway** :
   - Backend → Variables
   - Vérifiez que toutes les variables sont présentes :
     - ✅ `MONGODB_URI`
     - ✅ `JWT_SECRET`
     - ✅ `CLOUDINARY_CLOUD_NAME`
     - ✅ `CLOUDINARY_API_KEY`
     - ✅ `CLOUDINARY_API_SECRET`
     - ✅ `FRONTEND_URL`
     - ✅ `NODE_ENV=production`
     - ✅ `PORT=5000`

2. **Vérifier qu'il n'y a pas d'espaces** :
   - Exemple : `CLOUDINARY_CLOUD_NAME="dhgnwnkno"` (pas d'espaces avant/après)

#### C. Port ou Root Directory Incorrect

**Symptômes** :
- Erreur au démarrage
- Application ne démarre pas

**Solutions** :

1. **Vérifier Root Directory** :
   - Backend → Settings → Root Directory
   - Doit être : `backend`

2. **Vérifier Start Command** :
   - Backend → Settings → Start Command
   - Doit être : `npm start`

3. **Vérifier Build Command** :
   - Backend → Settings → Build Command
   - Doit être : `npm install` (automatique généralement)

#### D. Caractères Spéciaux dans le Mot de Passe MongoDB

**Symptômes** :
- Erreur d'authentification MongoDB
- Le username/password contient des caractères spéciaux

**Solutions** :

1. **Encoder les caractères spéciaux dans l'URI** :
   - `@` → `%40`
   - `#` → `%23`
   - ` ` (espace) → `%20`
   - `:` → `%3A`
   - etc.

2. **OU recréer l'utilisateur MongoDB avec un mot de passe simple** :
   - Sans caractères spéciaux
   - Exemple : `MonPassword123`

### Solution Rapide : Vérifier les Variables

Copiez-collez ces variables dans Railway → Backend → Variables → Raw Editor :

```env
NODE_ENV="production"
MONGODB_URI="mongodb+srv://sanoki:StanStud@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="supersecretkey_change_in_production_2024_ecommerce_sanoki_studios"
ADMIN_EMAIL="admin@sanokistudios.com"
ADMIN_PASSWORD="admin123"
CLOUDINARY_CLOUD_NAME="dhgnwnkno"
CLOUDINARY_API_KEY="571232989695956"
CLOUDINARY_API_SECRET="tKhD8-RuNN-NlT9McH7gu8oAiBc"
FRONTEND_URL="https://sanoki-studios.up.railway.app"
PORT="5000"
EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
```

⚠️ **Important** : Remplacez `cluster0.xxxxx` par l'URL réelle de votre cluster MongoDB !

---

## ⏱️ Problème : Frontend Prend Beaucoup de Temps à Se Déployer

### Causes Normales

#### 1. Build Process (Normal)
- Le build React/Vite prend généralement **3-5 minutes**
- C'est normal, surtout pour la première fois
- Railway installe les dépendances (`npm install`) puis build (`npm run build`)

#### 2. Build Cache
- La première fois, Railway n'a pas de cache
- Les déploiements suivants seront plus rapides (2-3 minutes)

### Vérifications

#### 1. Vérifier les Logs du Build

1. Frontend → Deployments → Dernier déploiement → View Logs
2. Vérifiez où ça bloque :
   - Si bloqué sur `npm install` → Normal, peut prendre 2-3 minutes
   - Si bloqué sur `npm run build` → Normal, peut prendre 1-2 minutes
   - Si erreur → Voir ci-dessous

#### 2. Vérifier les Variables Frontend

Assurez-vous que ces variables sont définies :
```env
VITE_API_URL="https://sanoki-studios-production.up.railway.app/api"
VITE_SOCKET_URL="https://sanoki-studios-production.up.railway.app"
PORT="4173"
```

#### 3. Vérifier Root Directory et Build Command

- **Root Directory** : `frontend`
- **Build Command** : `npm run build`
- **Start Command** : `npm run preview`

### Si le Build Échoue

#### Erreur : "Module not found"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez que `node_modules` n'est pas commité

#### Erreur : "Build timeout"
- Railway a une limite de temps pour le build
- Essayez de réduire la taille du build
- Vérifiez qu'il n'y a pas d'erreurs dans le code

---

## ✅ Checklist de Vérification

### Backend
- [ ] Toutes les variables d'environnement sont définies
- [ ] `MONGODB_URI` est correcte et accessible
- [ ] Root Directory = `backend`
- [ ] Start Command = `npm start`
- [ ] MongoDB cluster est actif (non en pause)
- [ ] Accès réseau MongoDB autorisé (`0.0.0.0/0`)
- [ ] Logs Railway montrent une erreur spécifique (si crash)

### Frontend
- [ ] Variables `VITE_API_URL` et `VITE_SOCKET_URL` sont définies
- [ ] Root Directory = `frontend`
- [ ] Build Command = `npm run build`
- [ ] Start Command = `npm run preview`
- [ ] Build est en cours (pas d'erreur)

---

## 🆘 Actions Immédiates

1. **Backend Crash** :
   - Ouvrez les logs Railway Backend
   - Copiez les dernières lignes d'erreur
   - Vérifiez le MongoDB URI dans les variables
   - Vérifiez que MongoDB Atlas autorise les connexions

2. **Frontend Lent** :
   - C'est normal si c'est le premier déploiement (3-5 min)
   - Surveillez les logs pour voir s'il y a des erreurs
   - Attendez la fin du build

---

## 📞 Prochaines Étapes

**Pour le Backend** : Partagez les logs d'erreur Railway pour que je puisse vous aider plus précisément.

**Pour le Frontend** : Attendez que le build se termine (peut prendre 3-5 minutes). Si ça échoue, partagez les logs.

---

**Diagnostic rapide : Vérifiez d'abord que MongoDB URI est correcte et que le cluster est accessible !** 🔍

