import React, {useMemo, useState} from 'react';
import { MoviesTable } from './MoviesTable';
import {useDebounce} from "@/hooks/useDebounce";
import {useAdminMovies} from "@/hooks/AdminMoviesHooks";



export const MoviesSection: React.FC = () => {
    const handleDelete = (movieId: string) => {
        console.log('Delete movie:', movieId);
    };

    const { data: movies = [], isLoading: isMoviesLoading, refetch: refetchMovies } = useAdminMovies();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const filteredMovies = useMemo(() => {
        if (!debouncedSearch.trim()) {
            return movies;
        }

        const query = debouncedSearch.toLowerCase().trim();
        return movies.filter((movie) =>
            movie.name.toLowerCase().includes(query)
        );
    }, [movies, debouncedSearch]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Фильмы</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Управление каталогом фильмов и сериалов
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-500">Всего контента</p>
                    <p className="text-2xl font-bold text-white mt-1">{movies.length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-500">Фильмов</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{movies.filter(m => m.movie_type === "Film").length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-500">Сериалов</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">{movies.filter(m => m.movie_type === "Serial").length}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        placeholder="Поиск по названию..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg
                       text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                </div>
            </div>

            {/* Table */}
            <MoviesTable movies={filteredMovies} onDelete={handleDelete} />
        </div>
    );
};