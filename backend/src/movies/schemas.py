from pydantic import BaseModel


class CreateMovieSchema(BaseModel):
    name: str
    content_name: str
    kinopoisk_id: str


class RatingSchema(BaseModel):
    kp: float
    imdb: float


class MainSliderMoviesSchema(BaseModel):
    id: str
    name: str
    poster: str
    rating: RatingSchema
    year: int


class MovieInfoRequestSchema(BaseModel):
    kinopoisk_id: int
    name: str
    year: int
    description: str
    short_description: str
    poster: str | None
    backdrop: str | None
    rating: RatingSchema
    genres: list[str]
    countries: list[str]
    movie_type: str