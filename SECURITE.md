# 🔒 Guide de Sécurité - Sanoki Studios

## ⚠️ IMPORTANT : Sécurité des secrets

**JAMAIS** ne commitez de vraies informations sensibles dans Git !

## 🚫 Ce qui NE DOIT PAS être dans Git

```bash
# ❌ INTERDIT - Ne jamais commiter :
MAILTRAP_USER=abc123def456
MAILTRAP_PASS=xyz789secret
JWT_SECRET=ma_vraie_cle_secrete
CLOUDINARY_API_SECRET=mon_vrai_secret
SMTP_PASS=ma_vraie_api_key
```

## ✅ Ce qui DOIT être dans Git

```bash
# ✅ AUTORISÉ - Valeurs d'exemple génériques :
MAILTRAP_USER=remplacer_par_votre_username
MAILTRAP_PASS=remplacer_par_votre_password
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe
CLOUDINARY_API_SECRET=remplacer_par_votre_api_secret
SMTP_PASS=remplacer_par_votre_api_key_sendgrid
```

**Note** : GitGuardian peut encore alerter sur ces exemples. Dans ce cas, marquez comme "False Positive".

## 🛡️ Protection automatique

Le fichier `.gitignore` protège automatiquement :
- `.env` (tous les fichiers .env)
- `backend/.env`
- `frontend/.env`
- `*_SECRETS.txt`

## 📧 Configuration Email Sécurisée

### Développement (Mailtrap)

```env
# backend/.env (NE PAS COMMITER)
MAILTRAP_USER=votre_vrai_username
MAILTRAP_PASS=votre_vrai_password
EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
```

### Production (Railway)

Dans Railway > Variables d'environnement :
```
MAILTRAP_USER=votre_vrai_username
MAILTRAP_PASS=votre_vrai_password
EMAIL_FROM=noreply@sanokistudios.com
NODE_ENV=production
```

## 🔍 Vérification GitGuardian

GitGuardian scanne automatiquement et détecte :
- ✅ Clés API exposées
- ✅ Mots de passe en dur
- ✅ Tokens secrets
- ✅ URLs de base de données

## 🚨 Si GitGuardian alerte

1. **Ne pas paniquer** - C'est souvent un faux positif
2. **Vérifier** si c'est vraiment sensible
3. **Si sensible** : 
   - Changer immédiatement le secret
   - Supprimer du commit avec `git rebase`
   - Ajouter au `.gitignore`

## 📋 Checklist Sécurité

- [ ] Aucun `.env` dans Git
- [ ] Variables d'exemple dans docs
- [ ] Vraies valeurs dans Railway uniquement
- [ ] `.gitignore` à jour
- [ ] Pas de secrets dans le code
- [ ] Domaine correct : `sanokistudios.com`

## 🆘 En cas de problème

1. **Secret exposé** :
   ```bash
   # Changer immédiatement le secret
   # Supprimer du Git
   git rebase -i HEAD~1
   # Éditer le commit pour supprimer le secret
   ```

2. **Faux positif GitGuardian** :
   - Marquer comme "False Positive"
   - Ajouter au `.gitignore` si nécessaire

## 📚 Ressources

- [GitGuardian Docs](https://docs.gitguardian.com/)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Rappel** : La sécurité est la responsabilité de tous ! 🔒
