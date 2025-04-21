import motor.motor_asyncio
from dotenv import load_dotenv
from bson import ObjectId
import os
import asyncio
from datetime import datetime, timedelta
import pytz

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "SynapseOS")
ARTICLES_COLLECTION = os.getenv("ARTICLES_COLLECTION", "ClarityEnhanced")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]
articles_collection = database[ARTICLES_COLLECTION]

async def get_all_articles(tag=None, country=None, today=False, date=None):
    """
    Retrieve all articles with optional filtering by tag, country, and date.
    
    Args:
        tag: Optional filter for articles containing a specific tag
        country: Optional filter for articles from a specific country
        today: When True, only returns articles published today
        date: Optional specific date to filter articles (format: YYYY-MM-DD)
        
    Returns:
        List of article documents matching the criteria
    """
    query = {}
    if tag:
        query["tags"] = tag
    if country:
        query["country"] = country
    
    # Date filtering - either today or specific date
    if date:
        # Convert the date string to datetime objects for the start and end of the day
        try:
            print(f"Date reçue du client: {date}")
            # Utiliser directement la chaîne de date pour créer des comparaisons de chaînes
            # Cela évite les problèmes de fuseau horaire
            date_start = f"{date}T00:00:00"
            date_end = f"{date}T23:59:59.999999"
            
            # Filter articles created on the specific date
            query["created_at"] = {
                "$gte": date_start,
                "$lte": date_end
            }
            
            print(f"Filtrage par date exacte: {date_start} à {date_end}")
        except ValueError as e:
            print(f"Format de date invalide: {date}. Erreur: {e}")
    elif today:
        # Pour le filtrage par jour, nous utilisons une date de début (aujourd'hui à minuit)
        # et une date de fin (aujourd'hui 23:59:59)
        today_date = datetime.now().date()
        today_str = today_date.isoformat()  # YYYY-MM-DD
        
        # Créer des chaînes ISO pour le début et la fin de la journée
        today_start = f"{today_str}T00:00:00"
        today_end = f"{today_str}T23:59:59.999999"
        
        # Filtrer les articles créés aujourd'hui
        query["created_at"] = {
            "$gte": today_start,
            "$lte": today_end
        }
        
        print(f"Filtrage par date aujourd'hui: {today_start} à {today_end}")
    
    try:
        cursor = articles_collection.find(query)
        articles = await cursor.to_list(length=100)
        
        if today or date:
            # Affichage des dates pour debug
            for article in articles[:5]:  # Limité aux 5 premiers pour éviter trop de logs
                print(f"Article date: {article.get('created_at')}")
                
        return articles
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []

async def get_article_by_id(article_id):
    """
    Retrieve a single article by its ID.
    
    Args:
        article_id: The ID of the article to retrieve
        
    Returns:
        The article document or None if not found
    """
    try:
        if isinstance(article_id, str):
            try:
                article_id = ObjectId(article_id)
            except:
                print(f"Invalid ObjectId format: {article_id}")
                return None
        
        article = await articles_collection.find_one({"_id": article_id})
        return article
    except Exception as e:
        print(f"Error fetching article by ID: {e}")
        return None

async def get_unique_tags():
    """
    Get a list of all unique tags across all articles.
    
    Returns:
        List of unique tag strings
    """
    try:
        tags = await articles_collection.distinct("tags")
        return tags
    except Exception as e:
        print(f"Error fetching tags: {e}")
        return []

async def get_unique_countries():
    """
    Get a list of all unique countries across all articles.
    
    Returns:
        List of unique country codes
    """
    try:
        countries = await articles_collection.distinct("country")
        return countries
    except Exception as e:
        print(f"Error fetching countries: {e}")
        return []

# Fonction pour vérifier la connexion à la base de données
async def check_database_connection():
    """
    Check if the MongoDB connection is working properly.
    
    Returns:
        True if the connection is successful, False otherwise
    """
    try:
        await database.command("ping")
        return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False 