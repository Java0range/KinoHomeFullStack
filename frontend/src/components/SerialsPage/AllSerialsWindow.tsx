"use client"



import {useEffect, useState} from "react";
import FilmCart from "@/components/HomePage/FilmCart";
import {useGenres, useMovies} from "@/hooks/MoviesHooks";
import {IMovie} from "@/models/MoviesModels";



const SerialsWindow = () => {
    const [isCategory, setIsCategory] = useState(false);
    const [serialsFiltersGenres, setSerialsFiltersGenres] = useState<string[]>([]);
    const addGenre = (genre: string) => {
        setSerialsFiltersGenres(prev =>
            prev.includes(genre)
                ? prev.filter(item => item !== genre)
                : [...prev, genre]
        );
    };
    const moviesRequest = useMovies("serial", serialsFiltersGenres, "all");
    const [movies, setMovies] = useState<IMovie[] | []>([]);

    useEffect(() => {
        if (moviesRequest.isSuccess) {
            setMovies(moviesRequest.data);
        }
    }, [moviesRequest.dataUpdatedAt])
    const SerialsGenresQuery = useGenres("serial");
    return (
        <div className="mt-3 w-full flex flex-col mb-16">
            <div className="select-none flex gap-4 w-full items-center max-md:justify-center">
                <h3 className="text-red-600 text-3xl font-bold">Сериалы</h3>
                <div
                    onClick={() => setIsCategory(!isCategory)}
                    className={`flex gap-3 items-center justify-center p-1.5 rounded-xl transition-opacity cursor-pointer border-dashed border-2 border-red-600 text-white opacity-50 ${
                        isCategory ? "bg-red-600 opacity-100" : "hover:opacity-100"
                    }`}
                >
                    <p>Категории</p>
                    <div className={`transition-all duration-700 ${isCategory ? "rotate-180" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className={`mt-3 grid grid-cols-7 max-sm:grid-cols-3 max-md:grid-cols-5 max-lg:grid-cols-6 gap-3 transition-all duration-500 ${
                isCategory ? "translate-y-3 opacity-100 visible mb-10" : "opacity-0 invisible"
            }`}>
                {SerialsGenresQuery.data?.map(genre => (
                    <div
                        onClick={() => addGenre(genre)}
                        key={genre}
                        className={`select-none p-1.5 rounded-xl text-white bg-red-600 flex justify-center cursor-pointer hover:shadow-[0_0_10px_rgb(255,255,255)] shadow-red-600 transition-all duration-500 ${
                            serialsFiltersGenres.includes(genre) && "-translate-y-2"
                        }`}
                    >
                        <p>{genre}</p>
                    </div>
                ))}
            </div>
            <div className="max-md:px-4 grid grid-cols-6 gap-8 max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4">
                {movies.map(movie => (
                    <FilmCart key={movie._id} movie={movie}/>
                ))}
            </div>
        </div>
    );
};

export default SerialsWindow;