import $api from '@/http'
import {IMainSliderMovies, IMovie} from "@/models/MoviesModels";
import type { AxiosResponse } from 'axios'

export default class MoviesService {
    static async getMoviesForMainSlider(): Promise<AxiosResponse<IMainSliderMovies[]>> {
        return  $api.get<IMainSliderMovies[]>('/movies/recommendations/main-slider');
    };
    static async getGenres(type: string): Promise<AxiosResponse<string[]>> {
        return $api.get<string[]>('/movies/genres/' + type);
    };
    static async getMoviesByFilters(type: string, genres: string[] | [], count_type: string): Promise<AxiosResponse<IMovie[]>> {
        return $api.get<IMovie[]>(`/movies?movie_type=${type}&count_type=${count_type}${genres.map((genre) => `&genres=${genre}`).join("")}`);
    };
    static async getAllMovies(): Promise<AxiosResponse<IMovie[]>> {
        return $api.get<IMovie[]>("/movies");
    };
    static async getModeratorMovies(): Promise<AxiosResponse<IMovie[]>> {
        return $api.get<IMovie[]>("/movies/moderator");
    };
    static async getMovieById(movie_id: string) {
        return $api.get<IMovie>(`/movies/by_id/${movie_id}`)
    }
};