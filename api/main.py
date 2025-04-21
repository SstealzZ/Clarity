from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import List, Optional

from models import Article, ArticleList, TagList, CountryList
import database

app = FastAPI(
    title="Clarity API",
    description="API pour consulter des articles technologiques",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Idéalement, restreindre aux origines de votre frontend en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vérification de la connexion à la base de données
@app.get("/healthcheck", tags=["System"])
async def healthcheck():
    """
    Vérifie si l'API et la connexion à la base de données fonctionnent correctement.
    """
    db_connected = await database.check_database_connection()
    return {
        "status": "ok" if db_connected else "error",
        "database_connected": db_connected,
        "api_version": "1.0.0"
    }

# Dépendance pour vérifier la connexion à la base de données
async def verify_db_connection():
    if not await database.check_database_connection():
        raise HTTPException(
            status_code=503, 
            detail="La connexion à la base de données n'est pas disponible"
        )
    return True

@app.get("/articles", response_model=List[Article], tags=["Articles"])
async def get_articles(
    tag: Optional[str] = Query(None, description="Filtrer par tag"),
    country: Optional[str] = Query(None, description="Filtrer par pays"),
    today: bool = Query(False, description="Filtrer pour n'obtenir que les articles d'aujourd'hui"),
    date: Optional[str] = Query(None, description="Filtrer par une date spécifique (format: YYYY-MM-DD)"),
    db_connected: bool = Depends(verify_db_connection)
):
    """
    Retrieve a list of all articles with optional filtering.
    
    Args:
        tag: Optional query parameter to filter articles by tag
        country: Optional query parameter to filter articles by country
        today: When True, only returns articles published today
        date: Optional query parameter to filter articles by specific date
        
    Returns:
        List of articles matching the filter criteria
    """
    articles = await database.get_all_articles(tag, country, today, date)
    return articles

@app.get("/articles/{article_id}", response_model=Article, tags=["Articles"])
async def get_article(
    article_id: str,
    db_connected: bool = Depends(verify_db_connection)
):
    """
    Retrieve a specific article by its ID.
    
    Args:
        article_id: The ID of the article to retrieve
        
    Returns:
        The article with the specified ID
        
    Raises:
        HTTPException: If the article is not found
    """
    article = await database.get_article_by_id(article_id)
    
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    return article

@app.get("/tags", response_model=TagList, tags=["Metadata"])
async def get_tags(db_connected: bool = Depends(verify_db_connection)):
    """
    Retrieve a list of all unique tags from the articles collection.
    
    Returns:
        List of unique tag strings
    """
    tags = await database.get_unique_tags()
    return {"tags": tags}

@app.get("/countries", response_model=CountryList, tags=["Metadata"])
async def get_countries(db_connected: bool = Depends(verify_db_connection)):
    """
    Retrieve a list of all unique countries from the articles collection.
    
    Returns:
        List of unique country codes
    """
    countries = await database.get_unique_countries()
    return {"countries": countries}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 