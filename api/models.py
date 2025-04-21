from pydantic import BaseModel, Field, field_serializer, BeforeValidator
from typing import List, Optional, Any, Annotated
from datetime import datetime
from bson import ObjectId

# Création d'un type PyObjectId pour gérer les ObjectId MongoDB
class PyObjectId(str):
    """
    Custom type for handling MongoDB ObjectId fields in Pydantic models.
    Compatible with Pydantic v2.
    """
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId) and not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)
        
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# Fonction pour valider les ObjectId
def validate_object_id(v: Any) -> ObjectId:
    """
    Validate that the value can be converted to an ObjectId.
    """
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str) and ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")


# Création d'un type annoté pour les ID MongoDB
MongoId = Annotated[str, BeforeValidator(lambda x: str(validate_object_id(x)))]


class Article(BaseModel):
    """
    Pydantic model for an article document.
    
    Attributes:
        id: The MongoDB ObjectId as string
        title_enhanced: The enhanced title of the article
        summary: A brief summary of the article content
        context: Additional context about the article topic
        insight: Key insight provided by the article
        tags: List of tags categorizing the article
        link: URL to the original article
        country: Country code where the article was published
        created_at: Timestamp when the article was created
    """
    id: Optional[MongoId] = Field(default=None, alias="_id")
    title_enhanced: str
    summary: str
    context: str
    insight: str
    tags: List[str]
    link: str
    country: str
    created_at: datetime
    
    # Configuration du modèle
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "title_enhanced": "OnePlus célèbre ses 10 ans",
                "summary": "Lors d'une conférence de presse...",
                "context": "OnePlus, une marque mobile fondée en 2013...",
                "insight": "L'anniversaire d'OnePlus illustre une forte tendance...",
                "tags": ["OnePlus", "innovation", "smartphones"],
                "link": "https://example.com/article",
                "country": "ch",
                "created_at": "2023-12-10T10:00:00Z"
            }
        }
    }
    
    # Sérialisation des ObjectId
    @field_serializer('id')
    def serialize_id(self, id: Any) -> str:
        if id is None:
            return None
        return str(id)


class ArticleList(BaseModel):
    """
    Pydantic model for a list of articles.
    
    Attributes:
        articles: List of article objects
    """
    articles: List[Article]


class TagList(BaseModel):
    """
    Pydantic model for a list of tags.
    
    Attributes:
        tags: List of unique tag strings
    """
    tags: List[str]


class CountryList(BaseModel):
    """
    Pydantic model for a list of countries.
    
    Attributes:
        countries: List of unique country codes
    """
    countries: List[str] 