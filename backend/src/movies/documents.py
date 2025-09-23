from typing import Optional, List

from beanie import Document

from src.movies.schemas import RatingSchema, MainSliderMoviesSchema


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


class RecommendationsDocument(Document):
    main_slider: List[MainSliderMoviesSchema] | None = None
    class Settings:
        name = "recommendations"