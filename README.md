# 📦 Stock Hub - Optimisation de l'application

## 👨‍🏫 Présentation
Ce TPI consiste à optimiser la qualité, la sécurité ainsi que le déploiement d'une application existante nommée StockHub, celle-ci est composée d'un backend développé en Node.js avec Express, d'un frontend en Vue.js ainsi que d'une base de données relationnelle MySQL. l'application est déjà fonctionnelle mais nécessite des améliorations notamment en termes de couvertures de tests et de processus de déploiement (voir image de l'application ci-dessous).

<img width="1914" height="673" alt="Screenshot du tableau de bord de l'application" src="https://github.com/user-attachments/assets/31dc8158-661d-4e29-8710-a80220a25f1c" />
<br>

L'application dispose des fonctionnalités suivantes :
- **Suivi des niveaux de stock** (stock bas niveau / normal)
- **La gestion des produits** (création / modification / suppression)
- **La gestion des catégories** (création / modification / suppression)
- **La gestion des mouvements** (entrées de produits / sorties de produits)
<br>

## 💨 Lancement du projet en local
### 📃 Pré-requis
- Un environnement : Windows, macOS ou Linux
- Docker (inclut Docker Compose v2)
- Un fichier `.env` a la racine du projet qui respecte la structure du `.env.exemple`
- Les ports 80, 3000 et 3306 libres (ou modifier les ports dans `docker-compose.yaml`)
- *(Node.js 22+ et npm, pour developper hors Docker)*

### 🚗 Démarrage
1. Cloner le repository sur votre poste de travail en ligne de commande :
`git clone https://github.com/mateja-velickovic/tpi-stockhub.git`
ou en passant par l'[interface web](https://github.com/mateja-velickovic/tpi-stockhub) du repository.
<br>

2. Télécharger les images nécessaires au lancement des containers
`docker compose pull`
<br>

3. Démarrer la construction des containers ainsi que la construction des images locales de l'application (backend et frontend)
`docker compose up -d` 
<br>

4. Si besoin, remplir la base de données avec des données de test
`docker compose exec api node dist/seed.js`
<br>

5. 🏆 Profiter de l'application sur http://localhost
<br>


## 🔑 Variables d'environnement
Le fichier `.env` doit être basé sur le fichier `.env.example` à la racine du projet.

**Backend**
 - `PORT` - Port HTTP de l'API (ex: 3000)
 - `DB_HOST` - Hôte MySQL (ex: localhost ou nom du container Docker)
 - `DB_PORT` - Port MySQL (ex: 3306)
 - `DB_NAME` - Nom de la base de données
 - `DB_USER` - Nom d'utilisateur MySQL
 - `DB_PASSWORD` - Mot de passe MySQL
 - `JWT_SECRET` - Secret JWT
 - `JWT_EXPIRES_IN` - Durée de la validité des tokens (ex: 24h)


**Frontend**
- `VITE_API_URL` - Base de l'API (ex: /api)
- `VITE_DEV_PORT` - Port du dev server Vite (ex: 5173)
- `VITE_API_PROXY_TARGET` - Cible du proxy Vite (ex: http://localhost:3000)
<br>


## ✅ Workflow CI
### 🔒 Secrets
<br>

## 🚧 Workflow Staging
### 🔒 Secrets
<br>

## 🏨 Workflow Production
### 🔒 Secrets
<br>
