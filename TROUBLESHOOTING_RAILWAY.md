# 🔧 Résolution de Problèmes Railway

Guide pour résoudre les problèmes courants lors du déploiement sur Railway.

---

## ❌ Problème : Repository GitHub non trouvé dans Railway

### Symptômes
- Le repository `sanokistudios/Sanoki-studios` n'apparaît pas dans la liste Railway
- Railway ne trouve pas le repository lors de la création d'un nouveau projet

---

## ✅ Solutions

### Solution 1 : Vérifier la connexion GitHub

1. **Dans Railway**, allez sur votre profil (icône en haut à droite)
2. Allez dans **Settings** → **Connections**
3. Vérifiez que **GitHub** est connecté
4. Si ce n'est pas le cas :
   - Cliquez sur **Connect GitHub**
   - Autorisez Railway à accéder à vos repositories GitHub

### Solution 2 : Vérifier les permissions GitHub

Si le repository est privé, vérifiez que Railway a les droits :

1. **Sur GitHub** :
   - Allez sur le repository : `https://github.com/sanokistudios/Sanoki-studios`
   - Settings → **Collaborators**
   - Assurez-vous que votre compte Railway/GitHub est dans la liste
   - OU : Settings → **Secrets and variables** → **Actions** → Vérifiez les permissions

### Solution 3 : Reconnecter GitHub avec les bons comptes

1. **Dans Railway** :
   - Settings → **Connections**
   - Cliquez sur **Disconnect** pour GitHub
   - Cliquez sur **Connect GitHub** à nouveau
   - Assurez-vous de vous connecter avec le **bon compte GitHub**
   - Si vous avez plusieurs comptes, choisissez celui qui a accès au repository

### Solution 4 : Vérifier que le repository existe

1. **Vérifiez sur GitHub** :
   - Le repository existe : `https://github.com/sanokistudios/Sanoki-studios`
   - Le repository n'est pas vide (il contient du code)
   - Le repository est visible avec votre compte GitHub

### Solution 5 : Utiliser un Fork ou Clone

Si Railway ne peut toujours pas accéder au repository, vous pouvez :

#### Option A : Fork le repository

1. **Sur GitHub**, forkez le repository vers votre propre compte
2. Dans Railway, connectez-vous avec votre compte GitHub personnel
3. Déployez depuis votre fork

#### Option B : Déployer depuis un clone local (Railway CLI)

1. **Installez Railway CLI** :
   ```bash
   npm install -g @railway/cli
   ```

2. **Connectez-vous** :
   ```bash
   railway login
   ```

3. **Initialisez Railway dans le projet** :
   ```bash
   cd ecommerce-vetements
   railway init
   ```

4. **Liez au projet Railway** :
   - Railway vous demandera de créer ou sélectionner un projet
   - Suivez les instructions

5. **Déployez** :
   ```bash
   railway up
   ```

---

## 🔄 Solution Alternative : Déployer sans GitHub

Si vous ne pouvez pas connecter GitHub, vous pouvez déployer directement :

### 1. Créer un projet Railway vide

1. Dans Railway, cliquez sur **New Project**
2. Choisissez **Empty Project**
3. Donnez un nom au projet : "Sanoki Studios"

### 2. Créer le service Backend

1. Dans le projet, cliquez sur **+ New**
2. Choisissez **Empty Service**
3. Renommez-le : **Backend**

### 3. Configurer le déploiement

Dans le service Backend :

1. **Settings** → **Source**
2. Choisissez **GitHub Repo** OU **Railway CLI**

#### Si GitHub Repo :
- Collez l'URL du repository : `https://github.com/sanokistudios/Sanoki-studios`
- Railway devrait le détecter si vous avez les permissions

#### Si Railway CLI :
1. Utilisez Railway CLI comme expliqué dans "Solution 5 - Option B"

### 4. Configurer le Root Directory

Dans **Settings** → **Root Directory**, mettez :
- **Backend** : `backend`
- **Frontend** : `frontend` (créé séparément)

---

## 🔍 Vérifications à Faire

### Checklist

- [ ] Votre compte Railway est connecté à GitHub
- [ ] Le repository `sanokistudios/Sanoki-studios` existe sur GitHub
- [ ] Le repository est visible avec votre compte GitHub
- [ ] Vous avez les permissions nécessaires sur le repository
- [ ] Railway a accès au repository (Settings → Connections → GitHub)

---

## 📋 Alternative : Configuration Manuelle via Railway CLI

Si GitHub ne fonctionne pas, voici comment déployer via CLI :

### 1. Installation Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Connexion

```bash
railway login
```

### 3. Dans le projet local

```bash
cd ecommerce-vetements

# Initialiser Railway
railway init

# Créer un nouveau projet ou lier à un existant
railway link  # Si projet existe déjà
# OU
# Railway créera un nouveau projet automatiquement
```

### 4. Configurer le service Backend

```bash
# Créer le service backend
railway add

# Spécifier le root directory
railway variables set RAILWAY_ROOT_DIR=backend

# Déployer
railway up --service backend
```

### 5. Configurer les variables d'environnement

```bash
# Backend variables
railway variables set CLOUDINARY_CLOUD_NAME=dhgnwnkno --service backend
railway variables set CLOUDINARY_API_KEY=571232989695956 --service backend
railway variables set CLOUDINARY_API_SECRET=tKhD8-RuNN-NlT9McH7gu8oAiBc --service backend
railway variables set MONGODB_URI=mongodb+srv://... --service backend
railway variables set JWT_SECRET=... --service backend
railway variables set NODE_ENV=production --service backend
railway variables set PORT=5000 --service backend
```

### 6. Déployer

```bash
railway up
```

---

## 🆘 Si Rien ne Fonctionne

### Option Finale : Déployer depuis le repository que vous avez

Si vous avez accès à `https://github.com/samizouari/ecommerce-vetements` :

1. Dans Railway, connectez ce repository
2. Déployez depuis là
3. Les deux repositories pointent vers le même code, donc ça fonctionnera

Ensuite, vous pourrez transférer la configuration Railway au client une fois que tout fonctionne.

---

## 💡 Astuce

**Pour vérifier les permissions GitHub dans Railway** :

1. Allez sur Railway → Settings → Connections
2. Cliquez sur **GitHub**
3. Vous devriez voir la liste des repositories auxquels Railway a accès
4. Si `sanokistudios/Sanoki-studios` n'est pas dans la liste, vous devez :
   - Vous assurer d'être connecté au bon compte GitHub
   - Vous assurer d'avoir les permissions sur le repository

---

**Besoin d'aide ?** Vérifiez d'abord que Railway est bien connecté à GitHub avec le bon compte !

