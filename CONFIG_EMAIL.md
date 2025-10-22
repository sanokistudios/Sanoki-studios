# 📧 Configuration Email - Sanoki Studios

## 📝 Vue d'ensemble

Le système d'email est déjà configuré et prêt à l'emploi ! Il envoie automatiquement un email de confirmation après chaque commande.

## ✅ Ce qui est déjà fait

1. ✅ **Configuration Nodemailer** : `/backend/utils/email.js`
2. ✅ **Template email professionnel** : HTML + texte brut
3. ✅ **Envoi automatique** : À chaque nouvelle commande
4. ✅ **Gestion des erreurs** : L'email échoue sans bloquer la commande

## 🔧 Configuration requise

### Variables d'environnement (backend/.env)

```env
# Email - Mailtrap (Développement)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=votre_user_mailtrap
MAILTRAP_PASS=votre_password_mailtrap

# Email - Informations
EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
ADMIN_EMAIL=admin@sanokistudios.com
```

## 🧪 Configuration Mailtrap (Développement)

Mailtrap est un service de test d'emails qui capture tous les emails en développement.

### Étapes :

1. **Créer un compte** : [https://mailtrap.io](https://mailtrap.io)
2. **Créer une inbox** : "Sanoki Studios - Dev"
3. **Copier les identifiants SMTP** :
   - Host : `sandbox.smtp.mailtrap.io`
   - Port : `2525`
   - Username : (dans Mailtrap)
   - Password : (dans Mailtrap)
4. **Ajouter dans `/backend/.env`**

## 📬 Template Email

L'email envoyé contient :

- ✅ **En-tête** : Logo Sanoki Studios
- ✅ **Informations commande** : Numéro, date, statut
- ✅ **Tableau produits** : Nom, taille, quantité, prix
- ✅ **Total** : Avec devise TND
- ✅ **Adresse livraison** : Complète
- ✅ **Info paiement** : Cash on Delivery
- ✅ **Délai livraison** : 2-3 jours
- ✅ **Notes client** : Si présentes

## 🚀 Test

### 1. Configurer Mailtrap

```bash
# Dans /backend/.env
MAILTRAP_USER=votre_username_mailtrap
MAILTRAP_PASS=votre_password_mailtrap
EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
```

**⚠️ IMPORTANT** : Remplacez les valeurs par vos vraies identifiants Mailtrap !

### 2. Passer une commande

1. Aller sur `http://localhost:5173`
2. Ajouter un produit au panier
3. Passer une commande (remplir email valide)
4. Vérifier la console backend : `✅ Email de confirmation envoyé à ...`

### 3. Vérifier l'email

1. Aller sur Mailtrap
2. Ouvrir l'inbox
3. L'email devrait apparaître ! 🎉

## 📊 Logs Backend

Succès :
```
✅ Email de confirmation envoyé à client@example.com
📧 Email envoyé: <message-id>
```

Erreur :
```
⚠️ Erreur lors de l'envoi de l'email de confirmation: <erreur>
```

**Note** : Si l'email échoue, la commande est quand même créée ! ✅

## 🌐 Production (SMTP réel)

Pour la production, remplacer Mailtrap par un vrai SMTP :

### Options recommandées :

1. **SendGrid** (gratuit jusqu'à 100 emails/jour)
2. **Mailgun** (gratuit jusqu'à 5000 emails/mois)
3. **Gmail SMTP** (limité, pas idéal pour prod)
4. **Amazon SES** (pay-as-you-go)

### Configuration :

```env
NODE_ENV=production

# Retirer les variables MAILTRAP

# Ajouter :
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=votre_api_key_sendgrid_ici

EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
ADMIN_EMAIL=admin@sanokistudios.com
```

## 🎨 Personnalisation Email

Pour modifier le template, éditer `/backend/utils/email.js` :

```javascript
exports.sendOrderConfirmation = async (order) => {
  // Modifier ici
  const html = `...`;
  const text = `...`;
}
```

## 📋 Checklist déploiement

- [ ] Créer compte Mailtrap (dev) ou SendGrid (prod)
- [ ] Ajouter variables d'environnement dans Railway
- [ ] Tester avec une vraie commande
- [ ] Vérifier logs Railway : `✅ Email de confirmation envoyé`
- [ ] Configurer EMAIL_FROM avec domaine réel (optionnel)

## 🆘 Problèmes courants

### Email non envoyé

- ✅ Vérifier variables d'environnement
- ✅ Vérifier console backend (logs)
- ✅ Vérifier identifiants SMTP
- ✅ Vérifier firewall/port bloqué

### Email dans spam

En production :
- ✅ Configurer SPF/DKIM sur domaine
- ✅ Utiliser SendGrid/Mailgun (bonne réputation)
- ✅ Éviter mots-clés spam dans sujet/corps

### Format cassé

- ✅ Tester dans Mailtrap (Preview)
- ✅ Vérifier HTML inline CSS
- ✅ Éviter JavaScript/CSS externe

---

**Questions ?** Ouvre une issue ou contacte le support technique ! 💬

