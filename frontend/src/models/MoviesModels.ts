export interface IMainSliderMovies {
    id: string;
    name: string;
    poster: string;
    rating: IRating;
    year: number;
}

interface IRating {
    kp: number,
    imdb: number
}

export interface IMovie {
    _id: string,
    state: string,
    movie_type: string,
    series_count: number,
    name: string,
    year: number,
    description: string | null,
    short_description: string | null,
    poster: string,
    backdrop: string | null,
    rating: IRating,
    genres: string[] | [],
    countries: string[] | []
}

interface IRating {
    kp: number,
    imdb: number
}

export interface MovieSearchResult {
    kinopoisk_id: number
    name: string;
    year: number;
    description: string;
    short_description: string;
    poster: string;
    backdrop: string;
    rating: IRating;
    genres: string[];
    countries: string[];
    movie_type: "Film" | "Serial";
}