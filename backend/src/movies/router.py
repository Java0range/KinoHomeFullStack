from fastapi import APIRouter, Request, Query, HTTPException, status

from src.faststream.broker import broker
from src.movies.odm import AsyncMoviesODM, AsyncRecommendationsODM
from src.movies.utils import get_movie_info_for_query, get_movie_info_for_id
from src.users.utils import permission_required
from src.movies.schemas import CreateMovieSchema


router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/info-query/{title}")
@permission_required("MODERATOR")
async def get_movie_info(request: Request, title: str):
    return  await get_movie_info_for_query(title=title)


@router.get("/info-id/{movie_id}")
@permission_required("MODERATOR")
async def get_movie_info_by_id(request: Request, movie_id: str):
    return await get_movie_info_for_id(movie_id=movie_id)


@router.post("")
@permission_required("MODERATOR")
async def create_movie(request: Request, json: CreateMovieSchema):
    movie_info = await get_movie_info_for_id(json.kinopoisk_id)
    await broker.connect()
    movie_id = await AsyncMoviesODM.insert_movie(movie_info=movie_info, name=json.name)
    await broker.publish(dict(
        id=str(movie_id),
        path=json.content_name
    ), queue="hls_convertor")


@router.delete("/{movie_id}")
@permission_required("MODERATOR")
async def delete_movie(request: Request, movie_id: str):
    await broker.connect()
    await AsyncMoviesODM.delete_movie(movie_id=movie_id)
    await broker.publish(dict(
        id=str(movie_id),
        path="delete",
    ), queue="hls_convertor")


@router.get("/genres/{movie_type}")
@permission_required("USER")
async def get_genres(request: Request, movie_type: str):
    if movie_type in ["serial", "film"]:
        return await AsyncMoviesODM.get_genres_for_movie_type(movie_type=movie_type)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный тип фильма")


@router.get("/recommendations/main-slider")
@permission_required("USER")
async def get_main_slider(request: Request):
    return await AsyncRecommendationsODM.get_main_slider()


@router.get("/{movie_id}")
@permission_required("USER")
async def get_movie_by_id(request: Request, movie_id: str):
    return await AsyncMoviesODM.get_movie_by_id(movie_id=movie_id)


@router.get("")
@permission_required("USER")
async def get_movies(
    request: Request,
    countries: list[str] = Query(None),
    genres: list[str] = Query(None),
    movie_type: str = Query(None),
    count_type: str = Query(None)
):
    return await AsyncMoviesODM.get_movies_for_filter(
        countries=countries,
        genres=genres,
        movie_type=movie_type,
        count_type=count_type
    )


@router.get("/moderator")
@permission_required("MODERATOR")
async def get_admin_movies(
    request: Request,
    countries: list[str] = Query(None),
    genres: list[str] = Query(None),
    movie_type: str = Query(None),
    count_type: str = Query(None)
):
    return await AsyncMoviesODM.get_movies_for_filter(
        countries=countries,
        genres=genres,
        movie_type=movie_type,
        count_type=count_type,
        is_admin=True
    )


@router.get("/{movie_id}")
@permission_required("USER")
async def get_movie_by_id(request: Request, movie_id: str):
    return await AsyncMoviesODM.get_movie_by_id(movie_id=movie_id)