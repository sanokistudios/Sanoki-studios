# Initialisation des Collections

Pour initialiser les collections de produits dans la base de données, exécutez le script d'initialisation :

## Localement

```bash
cd backend
node scripts/init-collections.js
```

## Sur Railway (Production)

1. Connectez-vous à votre projet Railway
2. Allez dans votre service backend
3. Accédez à l'onglet "Deploy Logs" ou utilisez le terminal intégré
4. Exécutez :
```bash
node scripts/init-collections.js
```

Le script créera automatiquement les collections suivantes si elles n'existent pas déjà :
- **firebloom**
- **souvenirs d'été Chic Chic**
- **tunis**
- **origami**

## Vérification

Les collections sont maintenant accessibles via :
- API : `GET /api/collections`
- Menu hamburger : Les collections apparaissent automatiquement dans le menu de navigation

## Gestion des Collections

Vous pouvez gérer les collections via l'interface admin une fois que vous aurez implémenté une page dédiée, ou directement via l'API :
- `GET /api/collections` - Liste toutes les collections
- `GET /api/collections/:id` - Récupère une collection spécifique
- `POST /api/collections` (admin) - Crée une nouvelle collection
- `PUT /api/collections/:id` (admin) - Met à jour une collection
- `DELETE /api/collections/:id` (admin) - Supprime une collection

