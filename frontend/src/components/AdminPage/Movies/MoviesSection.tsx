import React from 'react';
import { MoviesTable } from './MoviesTable';
import { Button } from '../UI/Button';

// Моковые данные
const mockMovies = [
    { id: 1, title: 'Интерстеллар', type: 'movie' as const, year: 2014, rating: 8.7 },
    { id: 2, title: 'Во все тяжкие', type: 'series' as const, year: 2008, rating: 9.5 },
    { id: 3, title: 'Начало', type: 'movie' as const, year: 2010, rating: 8.8 },
    { id: 4, title: 'Игра престолов', type: 'series' as const, year: 2011, rating: 9.3 },
    { id: 5, title: 'Темный рыцарь', type: 'movie' as const, year: 2008, rating: 9.0 },
    { id: 6, title: 'Очень странные дела', type: 'series' as const, year: 2016, rating: 8.7 },
];

export const MoviesSection: React.FC = () => {
    const handleCreate = () => {
        console.log('Navigate to create movie page');
    };

    const handleDelete = (movieId: number) => {
        console.log('Delete movie:', movieId);
    };

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
                <Button onClick={handleCreate}>
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Добавить фильм
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-500">Всего контента</p>
                    <p className="text-2xl font-bold text-white mt-1">567</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-500">Фильмов</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">423</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-500">Сериалов</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">144</p>
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
                        placeholder="Поиск по названию..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg
                       text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                </div>
                <select className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-600">
                    <option>Все типы</option>
                    <option>Фильмы</option>
                    <option>Сериалы</option>
                </select>
                <select className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-600">
                    <option>Все годы</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                </select>
            </div>

            {/* Table */}
            <MoviesTable movies={mockMovies} onDelete={handleDelete} />
        </div>
    );
};