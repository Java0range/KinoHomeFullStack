import React from 'react';
import {IMovie} from "@/models/MoviesModels";
import Image from "next/image";


interface MoviesTableProps {
    movies: IMovie[];
    onDelete: (movieId: string) => void;
}

export const MoviesTable: React.FC<MoviesTableProps> = ({
                                                            movies,
                                                            onDelete,
                                                        }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead>
                <tr className="border-b border-zinc-800">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Название
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Тип
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Состояние
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Год
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Рейтинг
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-zinc-400">
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody>
                {movies.map((movie) => (
                    <tr
                        key={movies.indexOf(movie) + 1}
                        className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
                    >
                        <td className="px-6 py-4 text-sm text-zinc-500">#{movies.indexOf(movie) + 1}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-14 bg-zinc-800 rounded flex items-center justify-center">
                                    <Image
                                        className="inline-flex h-15 w-15 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]"
                                        src={movie.poster}
                                        alt="Poster"
                                        width={150}
                                        height={225}
                                    />
                                </div>
                                <span className="text-sm font-medium text-white">
                    {movie.name}
                  </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        movie.movie_type === 'Film'
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-purple-600/20 text-purple-400'
                    }`}
                >
                  {movie.movie_type === 'Film' ? 'Фильм' : 'Сериал'}
                </span>
                        </td>
                        <td className="px-10 py-4 text-sm text-zinc-400">
                            {movie.state === "Converting" ? "Конвертируется" : "Готов"}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{movie.year}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span className="text-sm font-medium text-white">
                    {movie.rating?.kp ? movie.rating.kp : movie.rating?.imdb ? movie.rating.imdb : 'N/A'}
                  </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                                {/* Delete Button */}
                                <button
                                    onClick={() => onDelete(movie._id)}
                                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};