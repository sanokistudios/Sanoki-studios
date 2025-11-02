# 📋 Informations Manquantes pour Railway

Voici les informations dont j'ai besoin pour compléter les variables d'environnement Railway :

---

## ✅ Déjà Disponible

- ✅ **Cloudinary Cloud Name** : `dhgnwnkno`
- ✅ **Cloudinary API Key** : `571232989695956`
- ✅ **Cloudinary API Secret** : `tKhD8-RuNN-NlT9McH7gu8oAiBc`

---

## ❌ Informations Manquantes

### 1. MongoDB URI 🔴 (OBLIGATOIRE)

**Comment l'obtenir** :
1. Une fois le cluster MongoDB Atlas créé (en cours)
2. Créez un utilisateur (Database Access)
3. Configurez l'accès réseau (Network Access → Allow from Anywhere)
4. Récupérez l'URI : Database → Connect → Connect your application → Node.js
5. Formatez l'URI :
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

**Format attendu** :
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

### 2. JWT Secret 🔴 (OBLIGATOIRE)

**Comment le générer** :

**Option 1 : En ligne**
- Allez sur [randomkeygen.com](https://randomkeygen.com/)
- Utilisez un "CodeIgniter Encryption Keys" (256 bits)
- Copiez la clé générée

**Option 2 : Terminal**
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Exemple** :
```
JWT_SECRET=aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0
```

⚠️ **Important** : Utilisez une clé forte (32+ caractères aléatoires)

---

### 3. Frontend URL 🔴 (OBLIGATOIRE - après déploiement)

**Comment l'obtenir** :
1. Déployez d'abord le backend
2. Déployez ensuite le frontend
3. Railway génère une URL automatiquement
4. Copiez l'URL du frontend (ex: `https://frontend-production-xxxx.up.railway.app`)

**Format attendu** :
```
FRONTEND_URL=https://frontend-production-xxxx.up.railway.app
```

⚠️ **Note** : Vous devrez mettre à jour cette variable dans le backend après le déploiement du frontend.

---

### 4. Backend URL 🔴 (OBLIGATOIRE - après déploiement backend)

**Pour le Frontend** :

**Comment l'obtenir** :
1. Déployez le backend
2. Railway génère une URL automatiquement
3. Copiez l'URL du backend (ex: `https://backend-production-xxxx.up.railway.app`)

**Variables Frontend à mettre à jour** :
```
VITE_API_URL=https://backend-production-xxxx.up.railway.app/api
VITE_SOCKET_URL=https://backend-production-xxxx.up.railway.app
```

⚠️ **Note** : Utilisez la même URL pour les deux variables (avec `/api` pour VITE_API_URL, sans pour VITE_SOCKET_URL)

---

### 5. Admin Credentials 🟡 (OPTIONNEL mais recommandé)

**ADMIN_EMAIL** :
```
ADMIN_EMAIL=admin@sanokistudios.com
```

**ADMIN_PASSWORD** :
```
ADMIN_PASSWORD=votre_mot_de_passe_securise
```

⚠️ **Important** : Utilisez un mot de passe fort pour l'admin !

---

## 📝 Checklist

### Pour le Backend
- [ ] MongoDB URI récupérée et complétée
- [ ] JWT Secret généré (32+ caractères)
- [ ] Frontend URL (sera mise à jour après déploiement du frontend)
- [ ] ADMIN_EMAIL et ADMIN_PASSWORD définis (optionnel)

### Pour le Frontend
- [ ] Backend URL récupérée (sera disponible après déploiement du backend)
- [ ] VITE_API_URL configuré avec `/api` à la fin
- [ ] VITE_SOCKET_URL configuré (même URL que backend, sans `/api`)

---

## 🚀 Ordre de Déploiement

1. **D'abord** : Déployer le Backend avec MongoDB URI et JWT_SECRET
2. **Ensuite** : Déployer le Frontend avec Backend URL
3. **Enfin** : Mettre à jour FRONTEND_URL dans le Backend avec l'URL du Frontend

---

**Une fois que vous avez ces informations, je pourrai vous donner les variables complètes !** 🎯

