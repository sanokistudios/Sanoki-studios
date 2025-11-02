# 📊 Guide Complet MongoDB Atlas

Guide étape par étape pour configurer MongoDB Atlas et récupérer l'URI de connexion.

---

## 🎯 Étape 1 : Créer un Utilisateur de Base de Données

Avant de pouvoir vous connecter, vous devez créer un utilisateur MongoDB.

### 1.1 Accéder à Database Access

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Connectez-vous à votre compte
3. Dans le menu de gauche, cliquez sur **Database Access**

### 1.2 Créer un nouvel utilisateur

1. Cliquez sur **Add New Database User**
2. **Authentication Method** : Choisissez **Password**
3. **Username** : Entrez un nom (ex: `admin` ou `sanoki-admin`)
4. **Password** : 
   - Cliquez sur **Autogenerate Secure Password** (recommandé)
   - OU créez votre propre mot de passe fort
5. **Database User Privileges** : Choisissez **Atlas admin** (ou "Read and write to any database")
6. Cliquez sur **Add User**

⚠️ **IMPORTANT** : Copiez le mot de passe généré ! Il ne sera plus visible après.

---

## 🌐 Étape 2 : Configurer l'Accès Réseau

Pour que Railway puisse se connecter à MongoDB, vous devez autoriser les connexions.

### 2.1 Accéder à Network Access

1. Dans le menu de gauche, cliquez sur **Network Access**

### 2.2 Ajouter une IP

1. Cliquez sur **Add IP Address**

### 2.3 Autoriser les connexions

**Option A : Autoriser toutes les IPs (développement/test)** :
1. Cliquez sur **Allow Access from Anywhere**
2. Cela ajoute automatiquement `0.0.0.0/0`
3. Cliquez sur **Confirm**

⚠️ **Note** : Moins sécurisé, mais pratique pour Railway qui change d'IP.

**Option B : IPs spécifiques (production recommandé)** :
1. Choisissez **Add Current IP Address** (pour votre IP)
2. Pour Railway, vous devrez ajouter les IPs de Railway (si disponibles)
3. Cliquez sur **Confirm**

---

## 🔗 Étape 3 : Récupérer l'URI de Connexion

Une fois l'utilisateur créé et l'accès réseau configuré :

### 3.1 Retourner à Database

1. Dans le menu de gauche, cliquez sur **Database**
2. Sélectionnez votre cluster (ex: `Cluster0`)

### 3.2 Se connecter

1. Cliquez sur le bouton **Connect**
2. Choisissez **Connect your application** (Drivers)
3. Sélectionnez **Node.js** (version la plus récente)
4. Copiez l'URI qui apparaît :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 3.3 Compléter l'URI

1. **Remplacez `<username>`** par le nom d'utilisateur créé à l'étape 1
2. **Remplacez `<password>`** par le mot de passe créé à l'étape 1
3. **Ajoutez le nom de la base de données** après le nom du cluster :
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

⚠️ **Attention aux caractères spéciaux dans le mot de passe** :
- Si votre mot de passe contient des caractères spéciaux (`, @, #, etc.), vous devez les encoder en URL :
  - `@` devient `%40`
  - `#` devient `%23`
  - ` ` (espace) devient `%20`
  - etc.

**Exemple** :
- Mot de passe : `Mon@Password#123`
- Encodé : `Mon%40Password%23123`

---

## ✅ Exemple d'URI Complète

```
mongodb+srv://sanoki-admin:MonPassword123@cluster0.abc123.mongodb.net/ecommerce?retryWrites=true&w=majority
```

**Décomposition** :
- `sanoki-admin` = Username
- `MonPassword123` = Password
- `cluster0.abc123.mongodb.net` = Cluster MongoDB
- `ecommerce` = Nom de la base de données
- `?retryWrites=true&w=majority` = Options de connexion

---

## 🚂 Étape 4 : Configurer dans Railway

### 4.1 Ajouter la variable MONGODB_URI

1. Dans Railway, ouvrez le service **Backend**
2. Allez dans **Variables**
3. Cliquez sur **+ New Variable**
4. **Name** : `MONGODB_URI`
5. **Value** : Collez l'URI complète (remplie avec username/password)
6. Cliquez sur **Add**

### 4.2 Vérifier la connexion

Une fois Railway déployé :
1. Ouvrez les **Logs** du service Backend
2. Vous devriez voir : `✅ MongoDB connecté: cluster0.xxxxx.mongodb.net`

---

## 🆘 Problèmes Courants

### Erreur : "Authentication failed"

**Causes possibles** :
- Le username ou password est incorrect
- Le password contient des caractères spéciaux non encodés
- L'utilisateur n'existe pas

**Solution** :
- Vérifiez le username et password
- Réencodez le password si nécessaire
- Recréez l'utilisateur si besoin

### Erreur : "IP not whitelisted"

**Cause** : L'IP de Railway n'est pas autorisée

**Solution** :
- Allez dans **Network Access**
- Ajoutez `0.0.0.0/0` (autorise toutes les IPs)
- Attendez 1-2 minutes pour que les changements prennent effet

### Erreur : "Connection timeout"

**Causes possibles** :
- Le cluster est en pause (tier gratuit)
- Problème de réseau

**Solution** :
- Vérifiez que le cluster est actif (non en pause)
- Attendez quelques minutes et réessayez

---

## 🔒 Sécurité

### Bonnes Pratiques

1. ✅ **Utilisez un mot de passe fort** (générez-en un automatiquement)
2. ✅ **Limitez les IPs autorisées** si possible (en production)
3. ✅ **Ne partagez jamais l'URI complète** publiquement
4. ✅ **Changez régulièrement les mots de passe**
5. ✅ **Utilisez des utilisateurs avec des privilèges limités** pour des cas spécifiques

### En Production

- Limitez les IPs autorisées aux IPs de Railway uniquement (si possible)
- Utilisez un utilisateur avec des privilèges limités (pas "Atlas admin")
- Activez le chiffrement des données en transit

---

## 📝 Checklist MongoDB Atlas

Avant d'utiliser l'URI dans Railway :

- [ ] Utilisateur de base de données créé
- [ ] Mot de passe généré et sauvegardé
- [ ] Accès réseau configuré (IPs autorisées)
- [ ] URI de connexion récupérée
- [ ] URI complétée avec username/password
- [ ] Nom de la base de données ajouté (`/ecommerce?`)
- [ ] URI testée (si possible localement)
- [ ] URI ajoutée dans Railway Variables

---

**Votre URI MongoDB est prête pour Railway ! 🚀**

