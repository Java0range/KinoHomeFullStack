from typing import Optional, List
from schemas import RatingSchema, MovieWatchKeysSchema
from beanie import Document


class MovieDocument(Document):
    state: str
    movie_type: str
    series_count: int
    name: str
    year: int
    description: str
    short_description: str
    poster: str
    backdrop: Optional[str] = None
    rating: RatingSchema
    genres: List[str]
    countries: List[str]
    class Settings:
        name = "movies"