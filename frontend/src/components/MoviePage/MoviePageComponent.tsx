'use client';



import MoviePrev from "@/components/MoviePage/MoviePrev";
import Header from "@/components/HomePage/Header";
import {useMovie} from "@/hooks/MoviesHooks";



interface Props {
    movie_id: string;
}



export default function MoviePageComponent( { movie_id }: Props ) {
    const movieQuery = useMovie(movie_id);
    return (
        <>
            {
                movieQuery.isSuccess ? (
                    <div>
                        <div
                            className="fixed inset-0 m-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black flex justify-center overflow-y-auto overflow-x-hidden">
                            <div className="w-3/5 max-xl:w-4/5 max-lg:w-full px-6 sm:px-10 pt-6 sm:pt-10 pb-16">
                                <Header/>
                                <MoviePrev movie={movieQuery.data}/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="fixed h-full w-full flex items-center justify-center bg-zinc-900">
                        <div className="flex flex-col justify-center items-center w-full h-[600px] gap-3">
                            <h3 className="text-white text-md font-bold">Загрузка...</h3>
                            <div
                                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-red-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}