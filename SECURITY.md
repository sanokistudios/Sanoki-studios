# 🔒 Incident de Sécurité - Credentials Exposées

## ⚠️ Alerte GitGuardian

**Date :** $(date)  
**Gravité :** ÉLEVÉE  
**Statut :** EN COURS DE RÉSOLUTION

---

## 🚨 Credentials Exposées

Les credentials suivantes ont été accidentellement commitées dans les fichiers de documentation :

1. **MongoDB Atlas**
   - User : `[REDACTED]`
   - Password : `[REDACTED]` ❌ EXPOSÉ
   - Cluster : `[REDACTED]`

2. **Cloudinary**
   - Cloud Name : `[REDACTED]` ❌ EXPOSÉ
   - API Key : `[REDACTED]` ❌ EXPOSÉ
   - API Secret : `[REDACTED]` ❌ EXPOSÉ

---

## ✅ Actions Prises

### 1. Suppression des Credentials du Code

- [x] Fichier `GUIDE_DEMARRAGE_AUTH.md` nettoyé
- [x] Remplacé par des placeholders
- [x] Commit de correction créé

### 2. Rotation des Secrets (À FAIRE IMMÉDIATEMENT)

#### MongoDB Atlas

1. Aller sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Database Access** → Trouver votre utilisateur → **Edit**
3. **Edit Password** → Générer un nouveau mot de passe
4. Copier le nouveau mot de passe
5. Mettre à jour :
   - `backend/.env` (local)
   - Railway Backend → Variables → `MONGODB_URI`

**Nouveau format :**
```
mongodb+srv://VOTRE_USER:NOUVEAU_PASSWORD@VOTRE_CLUSTER.mongodb.net/?retryWrites=true&w=majority
```

#### Cloudinary

1. Aller sur [cloudinary.com/console](https://cloudinary.com/console)
2. **Settings** → **Security**
3. **API Keys** → Cliquer sur l'icône de rotation (🔄)
4. Générer une nouvelle API Secret
5. Mettre à jour :
   - `backend/.env` (local)
   - Railway Backend → Variables :
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

### 3. Vérification Logs d'Accès

**MongoDB Atlas :**
- Vérifier **Metrics** → **Real-Time** pour accès suspects
- Vérifier **Activity Feed** pour connexions non autorisées

**Cloudinary :**
- Vérifier **Reports** → **Usage** pour uploads suspects
- Vérifier **Activity Log** pour actions non autorisées

---

## 🔐 Mesures Préventives Ajoutées

### 1. `.gitignore` Vérifié

Fichiers protégés :
```
.env
.env.local
.env.production
*.env
RAILWAY_SECRETS.txt
```

### 2. Documentation Mise à Jour

- ✅ Tous les exemples utilisent des placeholders
- ✅ Instructions claires pour obtenir ses propres credentials

### 3. Bonnes Pratiques

**À SUIVRE :**
- ❌ **JAMAIS** commiter des fichiers `.env`
- ❌ **JAMAIS** mettre de vraies credentials dans la documentation
- ✅ **TOUJOURS** utiliser des variables d'environnement
- ✅ **TOUJOURS** vérifier avant de `git add`

---

## 📋 Checklist de Résolution

### Immédiat (< 30 minutes)

- [ ] Changer mot de passe MongoDB Atlas
- [ ] Régénérer API Secret Cloudinary
- [ ] Mettre à jour `.env` local
- [ ] Mettre à jour variables Railway
- [ ] Vérifier que le site fonctionne toujours

### Court terme (< 24 heures)

- [ ] Vérifier logs MongoDB Atlas (dernières 24h)
- [ ] Vérifier logs Cloudinary (dernières 24h)
- [ ] Vérifier aucune commande/upload suspect
- [ ] Vérifier Railway logs pour erreurs

### Moyen terme (< 1 semaine)

- [ ] Activer 2FA sur MongoDB Atlas
- [ ] Activer 2FA sur Cloudinary
- [ ] Configurer IP Whitelist MongoDB (si possible)
- [ ] Activer alertes sécurité MongoDB
- [ ] Scanner le repository avec [GitGuardian](https://www.gitguardian.com/)

---

## 🛡️ Sécurité Future

### 1. Pre-commit Hook

Installer `git-secrets` pour scanner avant commit :

```bash
npm install -g git-secrets
git secrets --install
git secrets --register-aws
```

### 2. GitHub Secret Scanning

Activer dans :
```
Repository Settings → Security → Secret scanning
```

### 3. Variables Environnement

**Structure recommandée :**

```
backend/
  .env.example         ✅ Commité (placeholders)
  .env                 ❌ JAMAIS commité (vraies credentials)
  .env.local           ❌ JAMAIS commité
  .env.production      ❌ JAMAIS commité
```

---

## 📞 Contact

En cas de découverte de credentials exposées :

1. **NE PAS** créer d'issue publique
2. Changer IMMÉDIATEMENT les credentials
3. Notifier l'équipe par canal sécurisé
4. Documenter dans ce fichier

---

## 📚 Ressources

- [MongoDB Atlas Security Best Practices](https://www.mongodb.com/docs/atlas/security/)
- [Cloudinary Security](https://cloudinary.com/documentation/solution_overview#security)
- [GitGuardian Documentation](https://docs.gitguardian.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## ✅ Résolution

**Date de résolution :** _À compléter après rotation des secrets_

**Confirmé par :**
- [ ] Nouveau mot de passe MongoDB fonctionne
- [ ] Nouvelle API Secret Cloudinary fonctionne
- [ ] Site en production opérationnel
- [ ] Aucun accès suspect détecté

---

**Note :** Ce fichier doit être mis à jour après chaque incident de sécurité.

