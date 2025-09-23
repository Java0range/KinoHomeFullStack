from pydantic import BaseModel


class RatingSchema(BaseModel):
    kp: float
    imdb: float


class MovieWatchKeysSchema(BaseModel):
    series: dict