import type {AxiosResponse} from "axios";
import {TorrentsModel} from "@/models/TorrentsModels";
import $api from "@/http";
import {MovieSearchResult} from "@/models/MoviesModels";

interface IAddMovie {
    name: string,
    content_name: string,
    kinopoisk_id: string,
}

export default class AdminMoviesService {
    static async addMovieToConverting(json: IAddMovie): Promise<AxiosResponse> {
        return $api.post("/movies", json);
    }
    static async getMovieInfoByQuery(query: string): Promise<AxiosResponse<MovieSearchResult[]>> {
        return $api.get("/movies/info-query/" + query);
    }
}