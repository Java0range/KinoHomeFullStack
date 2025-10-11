from aiohttp import ClientSession
from src.config import config
from src.movies.schemas import MovieInfoRequestSchema, RatingSchema


async def get_movie_info_for_query(title: str):
    async with ClientSession() as session:
        url = f"https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=10&query={title}"
        headers = {"X-API-KEY": config.get_kino_poisk_api_key()}
        async with session.get(url=url, headers=headers) as response:
            movies = await response.json()
            if response.status == 200:
                return [MovieInfoRequestSchema(
                    kinopoisk_id=movie["id"],
                    name=movie.get("name", "") if movie.get("name", "") else movie.get("enName", ""),
                    year=movie["year"],
                    description=str(movie.get("description")) if movie.get("description") is not None else "",
                    short_description=str(movie.get("shortDescription")) if movie.get(
                        "shortDescription") is not None else "",
                    poster=movie["poster"]["url"] if movie["poster"] else "",
                    backdrop=movie["backdrop"]["url"] if movie["backdrop"] else "",
                    rating=RatingSchema(kp=movie["rating"]["kp"], imdb=movie["rating"]["imdb"]),
                    genres=[genre["name"].capitalize() for genre in movie["genres"]],
                    countries=[country["name"].capitalize() for country in movie["countries"]],
                    movie_type="Serial" if movie["isSeries"] else "Film"
                ) for movie in movies["docs"]]


async def get_movie_info_for_id(movie_id: str):
    async with ClientSession() as session:
        url = f"https://api.kinopoisk.dev/v1.4/movie/{movie_id}"
        headers = {"X-API-KEY": config.get_kino_poisk_api_key()}
        async with session.get(url=url, headers=headers) as response:
            movie = await response.json()
            if response.status == 200:
                return MovieInfoRequestSchema(
                    kinopoisk_id=movie["id"],
                    name=movie.get("name", "") if movie.get("name", "") else movie.get("enName", ""),
                    year=movie["year"],
                    description=str(movie.get("description")) if movie.get("description") is not None else "",
                    short_description=str(movie.get("shortDescription")) if movie.get("shortDescription") is not None else "",
                    poster=movie["poster"]["url"] if movie["poster"] else "",
                    backdrop=movie["backdrop"]["url"] if "backdrop" in movie.keys() else "",
                    rating=RatingSchema(kp=movie["rating"]["kp"], imdb=movie["rating"]["imdb"]),
                    genres=[genre["name"].capitalize() for genre in movie["genres"]],
                    countries=[country["name"].capitalize() for country in movie["countries"]],
                    movie_type="Serial" if movie["isSeries"] else "Film"
                )