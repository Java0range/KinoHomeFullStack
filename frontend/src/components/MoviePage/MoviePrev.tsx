'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import {IMovie} from "@/models/MoviesModels";
import MovieHlsPlayer from "@/components/MoviePage/MovieHlsPlayer";



interface Props {
    movie: IMovie
}



const MoviePrev = ( { movie }: Props) => {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_HLS_URL);
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const countries = Array.isArray(movie.countries) ? movie.countries.join(', ') : movie.countries;
    const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres;

    return (
        <section
            className={`relative w-full transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
        >
            {/* фон: блюр из постера + красный акцент */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl sm:rounded-3xl">
                <Image
                    src={movie.poster}
                    alt={`${movie.name} background`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover scale-110 blur-2xl opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-zinc-950/60 to-zinc-950" />
                <div className="absolute -inset-x-24 -top-28 h-56 bg-red-600/25 blur-3xl opacity-40 pointer-events-none" />
            </div>

            {/* карта-контейнер */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(220,38,38,0.20)]">
                {/* инфо: постер + мета */}
                <div className="flex items-center gap-8 max-md:flex-col">
                    <div className="shrink-0">
                        <div className="relative">
                            <Image
                                width={300}
                                height={600}
                                src={movie.poster}
                                alt="poster"
                                priority
                                className={`min-w-64 w-64 h-auto rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-red-600/30 transition-transform duration-500 ease-out ${
                                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-5">
                        <div className="flex items-start justify-between gap-4 max-sm:flex-col">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(220,38,38,0.35)]">
                                    {movie.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-100/90">
                                    <span className="px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10">{movie.year}</span>
                                    <span className="h-1 w-1 rounded-full bg-zinc-500" />
                                    <span className="px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10">{countries}</span>
                                    <span className="h-1 w-1 rounded-full bg-zinc-500" />
                                    <span className="px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10">{genres}</span>
                                    <span className="h-1 w-1 rounded-full bg-zinc-500" />
                                    <span className="px-2 py-1 rounded-md bg-red-600/20 text-red-200 ring-1 ring-red-600/30">
                    {movie.movie_type}
                  </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="min-w-16 text-center rounded-2xl bg-red-600/90 text-white px-3 py-2 shadow-[0_0_22px_rgba(220,38,38,0.45)]">
                                    <div className="text-xs uppercase tracking-wider">kp</div>
                                    <div className="font-semibold">{movie.rating.kp}</div>
                                </div>
                                <div className="min-w-16 text-center rounded-2xl bg-yellow-300 text-black px-3 py-2 shadow-[0_0_20px_rgba(252,211,77,0.45)]">
                                    <div className="text-xs uppercase tracking-wider">imdb</div>
                                    <div className="font-semibold">{movie.rating.imdb}</div>
                                </div>
                            </div>
                        </div>

                        {/* описание */}
                        {
                            movie.description && (
                                <ExpandableDescription text={movie.description} />
                            )
                        }
                    </div>
                </div>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
                <MovieHlsPlayer
                    title={movie.name}
                    src={`${process.env.NEXT_PUBLIC_HLS_URL}/${movie._id}`}
                    series_count={movie.series_count}
                />
            </div>
        </section>
    );
};

const ExpandableDescription = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="max-w-3xl text-zinc-100/90">
            <div className={`relative transition-all ${expanded ? '' : 'max-h-28 overflow-hidden'}`}>
                <p>{text}</p>
                {!expanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                )}
            </div>
            <button
                onClick={() => setExpanded(v => !v)}
                className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
                {expanded ? 'Свернуть' : 'Читать полностью'}
            </button>
        </div>
    );
};

export default MoviePrev;