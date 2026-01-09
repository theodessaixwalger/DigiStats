# DigiStats - Configuration MongoDB

## 🚀 Configuration Initiale

### 1. Créer votre fichier `.env`

Copiez le fichier `.env.example` et renommez-le en `.env` :

```bash
cp .env.example .env
```

### 2. Configurer MongoDB Atlas

1. **Créer un compte** sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. **Créer un cluster gratuit** (M0)
3. **Créer un utilisateur de base de données** :
   - Aller dans "Database Access"
   - Créer un utilisateur avec mot de passe
   - Donner les privilèges "Read and write to any database"
4. **Autoriser l'accès réseau** :
   - Aller dans "Network Access"
   - Ajouter `0.0.0.0/0` (pour autoriser Vercel)
5. **Obtenir la chaîne de connexion** :
   - Cliquer sur "Connect" sur votre cluster
   - Choisir "Connect your application"
   - Copier la chaîne de connexion

### 3. Configurer votre `.env`

Éditez le fichier `.env` et remplacez la valeur de `MONGODB_URI` :

```env
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster.mongodb.net/digistats?retryWrites=true&w=majority
PORT=5000
```

**Remplacez :**
- `votre_username` par votre nom d'utilisateur MongoDB
- `votre_password` par votre mot de passe
- `cluster` par le nom de votre cluster

## 📦 Installation

```bash
npm install
```

## 🔄 Migration des Données (Optionnel)

Si vous avez des données existantes dans `db.json`, vous pouvez les migrer vers MongoDB :

```bash
node migrate.js
```

## 🏃 Démarrage

```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:5000`

## 🧪 Vérification

Testez que tout fonctionne :

```bash
curl http://localhost:5000/api/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "database": "connected"
}
```

## 🌐 Déploiement sur Vercel

### 1. Préparer le projet

Assurez-vous que `.env` est dans `.gitignore` (déjà fait ✅)

### 2. Pousser sur GitHub

```bash
git add .
git commit -m "Migrate to MongoDB"
git push
```

### 3. Configurer Vercel

1. Connectez votre repository GitHub à Vercel
2. Allez dans **Settings → Environment Variables**
3. Ajoutez la variable :
   - **Name:** `MONGODB_URI`
   - **Value:** votre chaîne de connexion MongoDB
4. Déployez !

## ⚠️ Important

- **Ne commitez JAMAIS le fichier `.env`** sur Git
- La chaîne de connexion MongoDB contient vos identifiants
- Utilisez des mots de passe forts pour MongoDB

## 🆘 Dépannage

### Erreur de connexion MongoDB

```
❌ MongoDB connection error
```

**Solutions :**
1. Vérifiez que votre chaîne de connexion est correcte
2. Vérifiez que votre IP est autorisée dans MongoDB Atlas
3. Vérifiez que votre utilisateur a les bonnes permissions

### Le serveur ne démarre pas

```
Error: Cannot find module 'dotenv'
```

**Solution :** Réinstallez les dépendances
```bash
npm install
```
