# 📦 StockHub - Guide d'utilisation et de déploiement

## 👨‍🏫 Présentation

Ce projet TPI consiste à optimiser la qualité, la sécurité et le déploiement de l'application **StockHub**. L'application est composée d'un **backend Node.js / Express**, d'un **frontend Vue.js** et d'une **base de données MySQL**.

L'application était déjà fonctionnelle au début du projet, mais elle nécessitait plusieurs améliorations : renforcement des tests, mise en place d'une chaîne CI/CD, conteneurisation avec Docker, déploiement automatisé et ajout d'un monitoring applicatif.

<img width="1914" height="673" alt="Screenshot du tableau de bord de l'application" src="https://github.com/user-attachments/assets/31dc8158-661d-4e29-8710-a80220a25f1c" />

## ✅ Fonctionnalités principales

StockHub permet de gérer différents éléments liés au stock :

- **Suivi des niveaux de stock** : visualisation des produits en stock normal ou en stock bas.
- **Gestion des produits** : création, modification et suppression de produits.
- **Gestion des catégories** : création, modification et suppression de catégories.
- **Gestion des mouvements** : enregistrement des entrées et sorties de produits.
- **Connexion utilisateur** : accès sécurisé à l'application via un système d'authentification.

---

## 💨 Lancement du projet en local

### 📃 Prérequis

Avant de lancer le projet, il faut disposer des éléments suivants :

- Un environnement Windows, macOS ou Linux.
- Docker avec Docker Compose v2.
- Un fichier `.env` placé à la racine du projet.
- Un fichier `.env` respectant la structure du fichier `.env.example`.
- Les ports nécessaires disponibles, notamment `80`, `3000` et `3306`.
- Node.js 22+ et npm uniquement si le développement est effectué hors Docker.

> Si le port `80` est déjà utilisé, par exemple par IIS sur Windows, il est possible de modifier le port exposé dans le fichier `docker-compose.yaml`.

Exemple :

```yaml
ports:
  - "127.0.0.1:8080:80"
```

Dans ce cas, l'application sera accessible à l'adresse suivante :

```text
http://127.0.0.1:8080
```

---

## 🚗 Démarrage

### 1. Cloner le repository

Cloner le projet en ligne de commande :

```bash
git clone https://github.com/mateja-velickovic/tpi-stockhub.git
```

Il est aussi possible de passer par l'interface web du repository GitHub.

### 2. Se placer dans le dossier du projet

```bash
cd tpi-stockhub
```

### 3. Créer le fichier d'environnement

Créer un fichier `.env` à la racine du projet en se basant sur le fichier `.env.example`.

Exemple :

```bash
cp .env.example .env
```

Les valeurs doivent ensuite être adaptées selon l'environnement utilisé.

### 4. Télécharger les images nécessaires

```bash
docker compose pull
```

Cette commande récupère les images externes nécessaires, par exemple l'image MySQL.

### 5. Construire et démarrer les conteneurs

```bash
docker compose up -d
```

Cette commande construit les images locales du frontend et du backend, puis démarre les conteneurs en arrière-plan.

### 6. Vérifier les conteneurs

```bash
docker ps
```

Les conteneurs attendus sont notamment :

- `web` pour le frontend.
- `api` pour le backend.
- `db` pour la base de données MySQL.

### 7. Remplir la base de données avec des données de test

Si nécessaire, exécuter le script de seed :

```bash
docker compose exec api node dist/seed.js
```

### 8. Accéder à l'application

Par défaut, l'application est disponible à l'adresse suivante :

```text
http://localhost
```

ou :

```text
http://127.0.0.1
```

Si un autre port a été configuré, il faut l'ajouter dans l'URL, par exemple :

```text
http://127.0.0.1:8080
```

---

## 🔑 Variables d'environnement

Le fichier `.env` doit être basé sur le fichier `.env.example` à la racine du projet.

### Backend

| Variable      | Description                                     |
| ------------- | ----------------------------------------------- |
| `PORT`        | Port HTTP de l'API, par exemple `3000`.         |
| `DB_HOST`     | Hôte MySQL, par exemple `database` dans Docker. |
| `DB_PORT`     | Port MySQL, par exemple `3306`.                 |
| `DB_NAME`     | Nom de la base de données.                      |
| `DB_USER`     | Nom d'utilisateur MySQL.                        |
| `DB_PASSWORD` | Mot de passe MySQL.                             |

---

## 🧪 Tests

Les tests permettent de vérifier le bon fonctionnement de l'application et de limiter les régressions.

### Tests backend

```bash
cd backend
npm install
npm run test
```

### Tests frontend

```bash
cd frontend
npm install
npm run test
```

Les tests sont également exécutés automatiquement dans le workflow CI lors des modifications du code.

---

## ✅ Workflow CI

<img width="226" height="481" alt="workflow ci" src="https://github.com/user-attachments/assets/8fed8328-fdd9-4b96-8b18-1b0855f06888" />

Le workflow CI est exécuté automatiquement lors des modifications du code. Il permet de contrôler la qualité du projet avant un déploiement.

Il effectue notamment :

- L'installation des dépendances.
- L'exécution des tests backend et frontend.
- La génération de la couverture de tests.
- L'analyse des dépendances.
- La vérification du build de l'application.

### 🔒 Secret utilisé

| Secret          | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `CODECOV_TOKEN` | Jeton utilisé pour envoyer les rapports de couverture vers Codecov. |

---

## 🚧 Workflow Staging

<img width="286" height="481" alt="workflow staging" src="https://github.com/user-attachments/assets/2ec9fc83-d20a-45fd-ad82-d8799bbc7d86" />

Le workflow de staging permet de déployer automatiquement l'application sur l'environnement de validation.

Il effectue notamment :

- La construction des images Docker du backend et du frontend.
- La publication des images dans la GitHub Container Registry.
- La connexion SSH à l'instance de staging.
- Le téléchargement des nouvelles images.
- Le redémarrage des services Docker sur l'instance distante.

### 🔒 Secrets utilisés

| Secret                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `STAGING_HOST`         | Adresse IP ou nom d'hôte du serveur de staging. |
| `SSH_STAGING_USERNAME` | Utilisateur SSH du serveur de staging.          |
| `SSH_STAGING_PORT`     | Port SSH du serveur de staging.                 |
| `SSH_PRIVATE_KEY`      | Clé privée SSH utilisée par le workflow.        |
| `GITHUB_TOKEN`         | Permet au workflow d'interagir avec GitHub.     |

---

## 🏨 Workflow Production

<img width="286" height="481" alt="prod" src="https://github.com/user-attachments/assets/7ca09d45-faca-4ee8-898a-1316615e6e42" />

Le workflow de production permet de déployer une version stable de l'application sur l'environnement final.

Contrairement au staging, le déploiement de production est lancé manuellement afin de garder un contrôle sur la mise en ligne.

Il effectue notamment :

- La construction ou la récupération des images Docker.
- La publication des images dans la GitHub Container Registry.
- La connexion au serveur de production.
- Le redémarrage contrôlé des services.
- L'exposition sécurisée de l'application en HTTPS.

### 🔒 Secrets utilisés

| Secret                    | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `PRODUCTION_HOST`         | Adresse IP ou nom d'hôte du serveur de production. |
| `SSH_PRODUCTION_USERNAME` | Utilisateur SSH du serveur de production.          |
| `SSH_PRODUCTION_PORT`     | Port SSH du serveur de production.                 |
| `SSH_PRIVATE_KEY`         | Clé privée SSH utilisée par le workflow.           |
| `GITHUB_TOKEN`         | Permet au workflow d'interagir avec GitHub.           |

---

## 🐳 Commandes Docker utiles

### Afficher les conteneurs actifs

```bash
docker ps
```

### Afficher les logs d'un conteneur

```bash
docker logs <nom_du_conteneur>
```

Exemples :

```bash
docker logs web
docker logs api
docker logs db
```

### Arrêter les services

```bash
docker compose down
```

### Reconstruire entièrement l'application

```bash
docker compose up -d
```

---

## 🛠️ Problèmes fréquents

### Le port 80 est déjà utilisé

Si l'application ne démarre pas à cause du port `80`, il faut soit libérer le port, soit modifier le port exposé dans `docker-compose.yaml`.

Exemple :

```yaml
ports:
  - "127.0.0.1:8080:80"
```

L'application sera ensuite disponible sur :

```text
http://127.0.0.1:8080
```

### La base de données ne démarre pas

Vérifier les variables suivantes dans le fichier `.env` :

```env
DB_NAME=
DB_USER=
DB_PASSWORD=
```

Puis consulter les logs :

```bash
docker logs {container}
```

---

## 📡 Monitoring

Le monitoring de l'application est assuré avec Sentry. Il permet de détecter les erreurs côté backend et côté frontend.

En cas d'erreur, Sentry centralise les informations utiles au diagnostic, comme le message d'erreur, la stack trace et l'environnement concerné.
