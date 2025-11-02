# Instructions pour Pousser le Code sur le Repository du Client

## ⚠️ Problème de Permissions

Pour pousser le code sur `https://github.com/sanokistudios/Sanoki-studios.git`, vous devez avoir les droits d'accès.

---

## 🔑 Option 1 : Être ajouté comme Collaborateur (Recommandé)

### Le client doit faire :
1. Aller sur https://github.com/sanokistudios/Sanoki-studios
2. Cliquer sur **Settings** (si vous avez les droits admin)
3. Aller dans **Collaborators** → **Add people**
4. Ajouter votre GitHub username (`samizouari`) avec les droits **Write**
5. Vous recevrez une invitation par email

### Vous devez faire :
1. Accepter l'invitation GitHub
2. Puis pousser le code :
   ```bash
   git remote add client https://github.com/sanokistudios/Sanoki-studios.git
   git push client main
   ```

---

## 🔑 Option 2 : Utiliser un Token d'Accès Personnel (PAT)

Si vous préférez utiliser un token :

### 1. Créer un token sur GitHub
1. Allez sur GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez sur **Generate new token** → **Generate new token (classic)**
3. Donnez un nom (ex: "Sanoki Studios Push")
4. Cochez **repo** (accès complet aux repositories)
5. Cliquez sur **Generate token**
6. **COPIEZ LE TOKEN** (il ne sera plus visible après)

### 2. Utiliser le token pour pousser
```bash
git remote add client https://<TOKEN>@github.com/sanokistudios/Sanoki-studios.git
git push client main
```

**OU** configurer Git pour utiliser le token :
```bash
git remote set-url client https://<TOKEN>@github.com/sanokistudios/Sanoki-studios.git
git push client main
```

---

## 🔑 Option 3 : Le Client Clone et Push Lui-même

Si vous préférez que le client le fasse :

### Instructions pour le client :

1. **Cloner le repository actuel** :
   ```bash
   git clone https://github.com/samizouari/ecommerce-vetements.git
   cd ecommerce-vetements
   ```

2. **Ajouter le remote vers son repository** :
   ```bash
   git remote add origin https://github.com/sanokistudios/Sanoki-studios.git
   ```

3. **Pousser le code** :
   ```bash
   git push -u origin main
   ```

---

## 🔑 Option 4 : Fork et Pull Request (si le repo n'est pas vide)

Si le repository du client n'est pas vide :

1. **Forker le repository du client** sur GitHub
2. **Cloner votre fork** :
   ```bash
   git clone https://github.com/VOTRE_USERNAME/Sanoki-studios.git
   cd Sanoki-studios
   ```

3. **Ajouter le code** :
   ```bash
   # Copier tous les fichiers du projet actuel dans ce dossier
   # Puis :
   git add .
   git commit -m "Initial commit - Site e-commerce complet"
   git push origin main
   ```

4. **Créer une Pull Request** vers le repository du client

---

## ✅ Vérifications Avant de Pousser

Assurez-vous que :

- [ ] **RAILWAY_SECRETS.txt** n'est PAS tracké (dans .gitignore)
- [ ] **Tous les fichiers .env** sont exclus (dans .gitignore)
- [ ] **Aucun secret** dans le code source
- [ ] **node_modules/** est exclu (dans .gitignore)
- [ ] **frontend/dist/** est exclu (dans .gitignore)

Vérification rapide :
```bash
git status
# Vérifier qu'aucun fichier sensible n'apparaît

git ls-files | findstr /i "SECRETS .env"
# Ne doit rien retourner
```

---

## 🚀 Une Fois les Permissions Obtenues

```bash
# Ajouter le remote (si pas déjà fait)
git remote add client https://github.com/sanokistudios/Sanoki-studios.git

# Pousser le code
git push client main

# OU si le repository du client a une branche différente :
git push client main:main
```

---

## 🆘 En Cas de Problème

### Erreur : "Permission denied"
➡️ Vérifiez que vous avez été ajouté comme collaborateur ou utilisez un PAT

### Erreur : "Repository not found"
➡️ Vérifiez l'URL du repository
➡️ Assurez-vous que le repository existe bien

### Erreur : "Branch protection"
➡️ Le client doit vous donner les droits d'admin ou désactiver la protection de branche temporairement

---

**Une fois le code poussé, le client peut suivre `GUIDE_TRANSITION_CLIENT.md` pour configurer Railway, Cloudinary et MongoDB.**

