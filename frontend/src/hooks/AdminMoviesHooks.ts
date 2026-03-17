import { useQuery } from "@tanstack/react-query";
import AdminMoviesService from "@/services/AdminMoviesService";
import MoviesService from "@/services/MoviesService";

export const useGetSearchMovies = (query: string) => {
    return useQuery({
        queryKey: ["adminSearchMovies", query],
        queryFn: () => AdminMoviesService.getMovieInfoByQuery(query),
        select: ({ data }) => data,
        enabled: query.trim().length > 0, // Не делать запрос если query пустой
    });
};

export const useModeratorMovies = () => {
    return useQuery({
        queryKey: ["AdminAllMovies"],
        queryFn: () => MoviesService.getModeratorMovies(),
        select: (({data}) => data)
    });
};