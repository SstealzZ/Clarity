# Clarity - Explorateur d'Articles Technologiques

Application web minimaliste pour consulter des articles technologiques depuis une base MongoDB.

## Fonctionnalités

- Interface sombre et élégante avec effets blur
- Affichage d'articles technologiques
- Filtrage par tags et pays
- Vue détaillée des articles

## Architecture

### Backend
- FastAPI pour l'API REST
- MongoDB (SynapseOS, collection ClarityEnhanced)
- Endpoints:
  - `GET /articles` - liste tous les articles
  - `GET /articles/{id}` - affiche un article par son ID
  - `GET /tags` - liste des tags uniques
  - `GET /countries` - liste des pays uniques

### Frontend
- React + TypeScript
- Tailwind CSS pour le styling
- Radix UI pour les composants d'interface
- Design responsive et minimaliste

## Prérequis
- Python 3.8+ avec pip
- Node.js 16+ avec npm
- MongoDB (installation locale ou distante)

## Installation et Démarrage

### Configuration de MongoDB
1. Vérifiez que MongoDB fonctionne à l'adresse `localhost:27017` (sans authentification)
2. Créez une base de données nommée `SynapseOS`
3. Créez une collection nommée `ClarityEnhanced`

### Configuration des variables d'environnement

#### Backend
Créez ou modifiez le fichier `api/.env` :
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=SynapseOS
ARTICLES_COLLECTION=ClarityEnhanced
```

#### Frontend
Créez ou modifiez le fichier `frontend/.env` en vous basant sur le fichier `.env.example` :
```
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Backend

```bash
# Se placer dans le répertoire api
cd api

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur en mode développement (IP locale 127.0.0.1 pour développement)
uvicorn main:app --reload
```

L'API sera disponible sur http://localhost:8000

Ouvrez votre navigateur et accédez à http://localhost:8000/docs pour explorer la documentation interactive de l'API.

### Frontend

```bash
# Se placer dans le répertoire frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement (accessible uniquement depuis la machine locale)
npm run dev
```

## Structure des Données

Exemple de document dans la collection MongoDB:

```json
{
  "title_enhanced": "OnePlus célèbre ses 10 ans : rétrospective et perspectives",
  "summary": "Lors d'une conférence de presse le 5 décembre 2023, Liu Zuohu, fondateur de OnePlus et actuel vice-président senior chez Oppo, a célébré le dixième anniversaire de la marque...",
  "context": "OnePlus, une marque mobile fondée en 2013, est reconnue pour ses stratégies d'innovation et de marketing disruptives...",
  "insight": "L'anniversaire d'OnePlus illustre une forte tendance vers l'engagement communautaire dans les entreprises technologiques...",
  "tags": ["OnePlus", "innovation", "smartphones", "Oppo", "anniversaire"],
  "link": "https://technode.com/2023/12/08/decade-of-innovation-pete-lau-reflects-on-onepluss-tenth-anniversary/",
  "country": "ch",
  "created_at": "2025-04-20T10:06:13.058Z"
}
```

## Développement

### Modifications du backend
- Tous les modèles de données sont définis dans `api/models.py`
- La logique d'accès à la base de données se trouve dans `api/database.py`
- Les endpoints API sont définis dans `api/main.py`

### Modifications du frontend
- Les composants React sont dans `frontend/src/components/`
- Les pages se trouvent dans `frontend/src/pages/`
- Les appels API sont centralisés dans `frontend/src/api/` 