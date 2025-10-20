# 📸 Configuration de Cloudinary pour l'Upload d'Images

## 🎯 Pourquoi Cloudinary ?

- ✅ **Gratuit** : 25 GB de stockage + 25 GB de bande passante/mois
- ✅ **CDN rapide** : Images chargées depuis le monde entier
- ✅ **Optimisation automatique** : Redimensionnement et compression
- ✅ **Compatible Railway** : Pas de perte de fichiers
- ✅ **Facile à utiliser** : Configuration en 5 minutes

## 🚀 Étape par Étape

### 1. Créer un compte Cloudinary

1. Aller sur : https://cloudinary.com/users/register/free
2. S'inscrire avec un email (ou Google/GitHub)
3. Confirmer l'email

### 2. Récupérer les identifiants

Une fois connecté, vous arrivez sur le **Dashboard** :

1. **Cloud Name** : Visible en haut (ex: `dxxxxxxxxx`)
2. **API Key** : Visible dans la section "Account Details"
3. **API Secret** : Cliquer sur "Show" pour le révéler

### 3. Configurer le projet

Ouvrez le fichier `backend\.env` et remplacez :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Par vos **vraies valeurs** :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Redémarrer le serveur

```powershell
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer :
cd C:\Users\sami\Desktop\Etudes\Freelance\ecommerce-vetements
npm run dev
```

### 5. Tester l'upload

1. Ouvrir http://localhost:5173/admin
2. Se connecter
3. Aller dans "Produits"
4. Cliquer sur "Ajouter un produit"
5. Dans la section "Images du produit", cliquer sur "Choisir des images"
6. Sélectionner une ou plusieurs images
7. Les images sont automatiquement uploadées sur Cloudinary ! ✅

## 📂 Organisation des Images

Les images sont stockées dans le dossier `ecommerce-vetements` sur Cloudinary :
- Accessible depuis votre Dashboard Cloudinary
- Organisées automatiquement
- Optimisées (max 1000x1000px, qualité auto)

## 🔧 Pour Railway (Déploiement)

Quand vous déployez sur Railway, ajoutez ces **variables d'environnement** :

```
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## 💡 Astuce Hybride

L'interface permet **deux méthodes** :
1. **Upload direct** : Bouton "Choisir des images"
2. **URL externe** : Saisir une URL d'image (Unsplash, etc.)

## 📊 Limites du Plan Gratuit

- **Stockage** : 25 GB
- **Bande passante** : 25 GB/mois
- **Transformations** : 25 crédits/mois

**Pour 99% des projets, c'est largement suffisant !**

Exemple :
- 1 image = ~500 KB
- 25 GB = ~50 000 images ! 🚀

## 🆘 Problèmes Courants

### Erreur "Invalid credentials"
➡️ Vérifiez que vous avez bien copié les 3 valeurs correctement

### Erreur "Upload failed"
➡️ Vérifiez que l'image fait moins de 5 MB

### Images ne s'affichent pas
➡️ Vérifiez l'URL dans le Dashboard Cloudinary

## 🎯 Résultat

Une fois configuré :
- ✅ Upload instantané depuis l'admin
- ✅ Images optimisées automatiquement
- ✅ CDN mondial (chargement rapide)
- ✅ Pas de limite sur Railway
- ✅ Prévisualisation avant sauvegarde

---

**Prêt à uploader vos premières images ! 📸**

