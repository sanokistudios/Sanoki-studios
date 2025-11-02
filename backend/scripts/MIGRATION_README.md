# Guide de Migration de Base de Données

Ce guide explique comment migrer vos données de votre base MongoDB locale/actuelle vers la base MongoDB Atlas du client.

## 📋 Prérequis

1. Avoir accès aux deux bases de données MongoDB :
   - Votre base **SOURCE** (celle avec vos produits)
   - La base **DESTINATION** du client (MongoDB Atlas)

2. Avoir les URI de connexion MongoDB :
   - Votre URI actuelle (ex: `mongodb://localhost:27017/ecommerce` ou votre URI MongoDB Atlas)
   - L'URI du client (ex: `mongodb+srv://sanoki:StanStud@cluster0.xxxxx.mongodb.net/ecommerce`)

## 🚀 Méthode 1 : Script de Migration (Recommandé)

### Étape 1 : Configurer les variables d'environnement

Créez un fichier `.env.migration` dans le dossier `backend/` avec :

```env
# Votre base de données SOURCE (celle avec vos produits)
SOURCE_MONGODB_URI="mongodb://localhost:27017/ecommerce"

# La base de données DESTINATION du client (MongoDB Atlas)
DEST_MONGODB_URI="mongodb+srv://sanoki:StanStud@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority"
```

**OU** modifiez directement les variables dans le script `migrate-db.js`.

### Étape 2 : Lancer le script de migration

```bash
cd backend
node scripts/migrate-db.js
```

Le script va :
- ✅ Se connecter aux deux bases de données
- ✅ Exporter tous les produits de votre base
- ✅ Exporter toutes les collections
- ✅ Exporter les hero images
- ✅ Exporter les peintures
- ✅ Les importer dans la base du client (sans créer de doublons)

### ⚠️ Important

- **Les utilisateurs (User) ne sont PAS migrés** pour des raisons de sécurité
- **Les commandes (Order) ne sont PAS migrées** (le client recommence à zéro)
- **Les contacts ne sont PAS migrés**

## 🔄 Méthode 2 : Export/Import avec MongoDB Compass

### Étape 1 : Exporter depuis votre base

1. Ouvrez **MongoDB Compass**
2. Connectez-vous à votre base **SOURCE**
3. Pour chaque collection (products, collections, heroimages, paintings) :
   - Cliquez sur la collection
   - Cliquez sur "Export Collection"
   - Sélectionnez "JSON"
   - Enregistrez le fichier (ex: `products.json`)

### Étape 2 : Importer dans la base du client

1. Connectez-vous à la base **DESTINATION** du client dans MongoDB Compass
2. Pour chaque fichier JSON :
   - Créez une collection (si elle n'existe pas)
   - Cliquez sur "Import Collection"
   - Sélectionnez votre fichier JSON
   - Cliquez sur "Import"

## 🔄 Méthode 3 : Export/Import avec mongo shell (avancé)

### Export depuis votre base :

```bash
# Exporter toutes les collections
mongodump --uri="mongodb://localhost:27017/ecommerce" --out=./backup

# Ou exporter une collection spécifique
mongoexport --uri="mongodb://localhost:27017/ecommerce" --collection=products --out=products.json
```

### Import dans la base du client :

```bash
# Importer toutes les collections
mongorestore --uri="mongodb+srv://sanoki:StanStud@cluster0.xxxxx.mongodb.net/ecommerce" ./backup/ecommerce

# Ou importer une collection spécifique
mongoimport --uri="mongodb+srv://sanoki:StanStud@cluster0.xxxxx.mongodb.net/ecommerce" --collection=products --file=products.json
```

## 📝 Collections migrées

Le script migre automatiquement :
- ✅ **Products** (Produits)
- ✅ **Collections** (Collections)
- ✅ **HeroImages** (Images d'accueil)
- ✅ **Paintings** (Peintures)

## ⚠️ Collections NON migrées

Ces collections ne sont **PAS** migrées pour des raisons de sécurité/conformité :
- ❌ **Users** (Les utilisateurs doivent se réinscrire)
- ❌ **Orders** (Les commandes restent dans l'ancien système)
- ❌ **Contacts** (Les messages de contact)
- ❌ **Conversations** (Les conversations)
- ❌ **Messages** (Les messages)

## 🔍 Vérification après migration

1. Connectez-vous à MongoDB Atlas (base du client)
2. Vérifiez que les collections existent :
   - `products`
   - `collections`
   - `heroimages`
   - `paintings`
3. Vérifiez le nombre de documents dans chaque collection
4. Testez sur le site web du client que les produits s'affichent correctement

## ❓ Problèmes courants

### Erreur de connexion à la source
- Vérifiez que votre MongoDB local est démarré
- Vérifiez l'URI de connexion

### Erreur de connexion à la destination
- Vérifiez l'URI MongoDB Atlas
- Assurez-vous que votre IP est autorisée dans MongoDB Atlas (Network Access)
- Vérifiez les identifiants (username/password)

### Doublons créés
- Le script vérifie les doublons basés sur `_id`
- Si vous avez déjà des données dans la destination, les anciens documents avec le même `_id` seront ignorés

## 🎯 Recommandation

**Utilisez la Méthode 1 (Script de Migration)** car elle :
- ✅ Automatise tout le processus
- ✅ Évite les doublons
- ✅ Fournit des logs détaillés
- ✅ Gère les erreurs automatiquement

