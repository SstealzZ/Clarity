"""
Script pour initialiser la base de données avec des exemples d'articles.
"""
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "SynapseOS")
ARTICLES_COLLECTION = os.getenv("ARTICLES_COLLECTION", "ClarityEnhanced")

# Exemples d'articles pour initialiser la base de données
SAMPLE_ARTICLES = [
    {
        "title_enhanced": "OnePlus célèbre ses 10 ans : rétrospective et perspectives",
        "summary": "Lors d'une conférence de presse le 5 décembre 2023, Liu Zuohu, fondateur de OnePlus et actuel vice-président senior chez Oppo, a célébré le dixième anniversaire de la marque...",
        "context": "OnePlus, une marque mobile fondée en 2013, est reconnue pour ses stratégies d'innovation et de marketing disruptives...",
        "insight": "L'anniversaire d'OnePlus illustre une forte tendance vers l'engagement communautaire dans les entreprises technologiques...",
        "tags": ["OnePlus", "innovation", "smartphones", "Oppo", "anniversaire"],
        "link": "https://technode.com/2023/12/08/decade-of-innovation-pete-lau-reflects-on-onepluss-tenth-anniversary/",
        "country": "ch",
        "created_at": datetime.fromisoformat("2023-12-05T10:06:13.058")
    },
    {
        "title_enhanced": "La nouvelle IA de Google peut générer des vidéos à partir de texte",
        "summary": "Google Research a dévoilé Imagen Video 2, un nouveau modèle d'IA capable de générer des vidéos de haute qualité à partir de simples descriptions textuelles...",
        "context": "Le domaine de la génération vidéo par IA connaît une progression fulgurante depuis l'introduction des modèles de diffusion en 2021...",
        "insight": "La démocratisation des outils de génération vidéo par IA va probablement transformer l'industrie créative et médiatique dans les prochaines années...",
        "tags": ["IA", "Google", "génération vidéo", "intelligence artificielle", "deep learning"],
        "link": "https://blog.research.google/2023/12/imagen-video-2-scaling-text-to-video.html",
        "country": "us",
        "created_at": datetime.fromisoformat("2023-12-01T15:30:00.000")
    },
    {
        "title_enhanced": "Les technologies de réalité augmentée bouleversent l'industrie manufacturière",
        "summary": "De nouvelles solutions de réalité augmentée industrielle permettent d'améliorer significativement la productivité et la précision des opérations de fabrication complexes...",
        "context": "La réalité augmentée industrielle combine des lunettes connectées avec des logiciels spécialisés pour guider les techniciens étape par étape...",
        "insight": "L'adoption de la réalité augmentée dans l'industrie représente une étape majeure vers la transformation numérique des usines et l'Industrie 4.0...",
        "tags": ["réalité augmentée", "industrie 4.0", "manufacture", "technologie", "productivité"],
        "link": "https://www.manufacturing-technology-insights.com/news/how-augmented-reality-is-transforming-manufacturing-nid-2342.html",
        "country": "fr",
        "created_at": datetime.fromisoformat("2023-11-25T09:15:42.123")
    },
]

async def seed_database():
    """
    Fonction pour initialiser la base de données avec des exemples d'articles.
    """
    # Connexion à MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    collection = db[ARTICLES_COLLECTION]
    
    # Vérifier si la collection existe déjà et contient des données
    count = await collection.count_documents({})
    
    if count > 0:
        print(f"La collection {ARTICLES_COLLECTION} contient déjà {count} documents.")
        choice = input("Voulez-vous ajouter des exemples supplémentaires? (o/n): ")
        if choice.lower() != 'o':
            print("Opération annulée.")
            return
    
    # Insérer les exemples d'articles
    result = await collection.insert_many(SAMPLE_ARTICLES)
    print(f"{len(result.inserted_ids)} articles ont été ajoutés à la base de données.")
    
    # Afficher les articles ajoutés
    for i, article_id in enumerate(result.inserted_ids):
        print(f"Article {i+1} ajouté avec l'ID: {article_id}")

if __name__ == "__main__":
    asyncio.run(seed_database()) 