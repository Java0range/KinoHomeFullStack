import {useQuery} from "@tanstack/react-query";
import MoviesService from "@/services/MoviesService";

export const useGenres = (type: string) => {
    return useQuery({
        queryKey: ["genres", type],
        queryFn: () => MoviesService.getGenres(type),
        select: (({data}) => data),
        staleTime: 60_000,
    });
};

export const useMainSlider = () => {
    return useQuery({
        queryKey: ["slider", "main"],
        queryFn: () => MoviesService.getMoviesForMainSlider(),
        select: (({data}) => data)
    });
}

export const useMovies = (type: string, genres: string[] | [], count_type: string) => {
    const normalized = [...genres].sort();
    return useQuery({
        queryKey: ["movies", type, count_type, { genres: normalized}],
        queryFn: () => MoviesService.getMoviesByFilters(type, normalized, count_type),
        select: (({data}) => data)
    });
};

export const useAllMovies = () => {
    return useQuery({
        queryKey: ["allMovies"],
        queryFn: () => MoviesService.getAllMovies(),
        select: (({data}) => data)
    });
};

export const useMovie = (movie_id: string) => {
    return useQuery({
        queryKey: ["movie", movie_id],
        queryFn: () => MoviesService.getMovieById(movie_id),
        select: (({data}) => data)
    });
}