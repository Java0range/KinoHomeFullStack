from beanie import PydanticObjectId
from fastapi import HTTPException, status
from random import sample

from src.movies.documents import MovieDocument, RecommendationsDocument
from src.movies.schemas import MovieInfoRequestSchema, MainSliderMoviesSchema


class AsyncMoviesODM:
    @staticmethod
    async def insert_movie(
            movie_info: MovieInfoRequestSchema,
            name: str,
    ):
        movie = MovieDocument(
            state="Converting",
            movie_type=movie_info.movie_type,
            series_count=0,
            name=name,
            year=movie_info.year,
            description=movie_info.description,
            short_description=movie_info.short_description,
            poster=movie_info.poster,
            backdrop=movie_info.backdrop,
            rating=movie_info.rating,
            genres=movie_info.genres,
            countries=movie_info.countries
        )
        await movie.insert()
        return movie.id

    @staticmethod
    async def get_movies_for_filter(genres: list[str] | None, countries: list[str] | None, movie_type: str | None, count_type: str = "all"):
        def genre_filter(movie):
            return len(set(movie.genres) & set(genres)) > 0
        def country_filter(movie):
            return len(set(movie.countries) & set(countries)) > 0
        if movie_type == "film":
            movies = await MovieDocument.find(MovieDocument.movie_type == "Film").to_list()
        elif movie_type == "serial":
            movies = await MovieDocument.find(MovieDocument.movie_type == "Serial").to_list()
        else:
            movies = await MovieDocument.find_all().to_list()
        if genres:
            movies = list(filter(genre_filter, movies))
        if countries:
            movies = list(filter(country_filter, movies))
        match count_type:
            case "all":
                pass
            case "lg":
                movies = movies[:11]
            case "md":
                movies = movies[:8]
            case "sm":
                movies = movies[:3]
        return movies

    @staticmethod
    async def get_movie_by_id(movie_id: str):
        try:
            movie_id = PydanticObjectId(movie_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный id фильма"
            )
        movie = await MovieDocument.find_one(MovieDocument.id == movie_id)
        return movie

    @staticmethod
    async def delete_movie(movie_id: str):
        try:
            movie_id = PydanticObjectId(movie_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный id фильма"
            )
        movie = await MovieDocument.find_one(MovieDocument.id == movie_id)
        if movie:
            await movie.delete()

    @staticmethod
    async def get_genres_for_movie_type(movie_type: str):
        if movie_type == "film":
            movies = await MovieDocument.find(MovieDocument.movie_type == "Film").to_list()
        else:
            movies = await MovieDocument.find(MovieDocument.movie_type == "Serial").to_list()
        genres = []
        for movie in movies:
            genres.extend(movie.genres)
        return sorted(list(set(genres)))

    @staticmethod
    async def get_random_movies_for_slider():
        movies = await MovieDocument.find_all().to_list()
        return sample(movies, min(6, len(movies)))


class AsyncRecommendationsODM:
    @staticmethod
    async def init_recommendations():
        recommendations = await RecommendationsDocument.find().to_list()
        if not recommendations:
            await RecommendationsDocument(main_slider=None).insert()
            await AsyncRecommendationsODM.insert_main_slider_for_movies(
                await AsyncMoviesODM.get_random_movies_for_slider()
            )
        elif len(recommendations) > 1:
            await RecommendationsDocument.delete_all()
            await RecommendationsDocument(main_slider=None).insert()
            await AsyncRecommendationsODM.insert_main_slider_for_movies(
                await AsyncMoviesODM.get_random_movies_for_slider()
            )

    @staticmethod
    async def insert_main_slider_for_movie_id(movies_id: list[str]):
        slider = []
        for movie_id in movies_id:
            slider.append(
                MainSliderMoviesSchema.model_validate(
                    await AsyncMoviesODM.get_movie_by_id(movie_id),
                    from_attributes=True
                )
            )
        recommendations = await RecommendationsDocument.find_one()
        recommendations.main_slider = slider
        await recommendations.save()

    @staticmethod
    async def insert_main_slider_for_movies(movies):
        slider = [
            MainSliderMoviesSchema.model_validate({
                "id": str(movie.id),
                "name": movie.name,
                "poster": movie.poster,
                "rating": movie.rating,
                "year": movie.year,
            })
            for movie in movies
        ]
        recommendations = await RecommendationsDocument.find_one()
        recommendations.main_slider = slider
        await recommendations.save()

    @staticmethod
    async def get_main_slider():
        recommendations = await RecommendationsDocument.find_one()
        return recommendations.main_slider