from beanie import PydanticObjectId
from documents import MovieDocument


class AsyncMovieODM:
    @staticmethod
    async def change_movie_state(movie_id: str, series_count: int):
        movie_id = PydanticObjectId(movie_id)
        movie = await MovieDocument.find_one(MovieDocument.id == movie_id)
        movie.state = "Ready"
        movie.series_count = series_count
        await movie.save()