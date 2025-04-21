import motor.motor_asyncio
from dotenv import load_dotenv
from bson import ObjectId
import os
import asyncio

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "SynapseOS")
ARTICLES_COLLECTION = os.getenv("ARTICLES_COLLECTION", "ClarityEnhanced")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]
articles_collection = database[ARTICLES_COLLECTION]

async def get_all_articles(tag=None, country=None):
    """
    Retrieve all articles with optional filtering by tag and country.
    
    Args:
        tag: Optional filter for articles containing a specific tag
        country: Optional filter for articles from a specific country
        
    Returns:
        List of article documents matching the criteria
    """
    query = {}
    if tag:
        query["tags"] = tag
    if country:
        query["country"] = country
    
    try:
        cursor = articles_collection.find(query)
        articles = await cursor.to_list(length=100)
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