import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { TorrentsModel } from '@/models/TorrentsModels';
import { MovieSearchResult } from "@/models/MoviesModels";
import { useGetSearchMovies } from "@/hooks/AdminMoviesHooks";
import AdminMoviesService from "@/services/AdminMoviesService";

interface ConvertModalProps {
    isOpen: boolean;
    onClose: () => void;
    torrent: TorrentsModel | null;
}

export const ConvertModal: React.FC<ConvertModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              torrent,
                                                          }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(null);
    const [customTitle, setCustomTitle] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

    const {
        data: searchResults = [],
        isLoading: isSearchLoading
    } = useGetSearchMovies(debouncedSearch);

    const handleSelectMovie = (movie: MovieSearchResult) => {
        setSelectedMovie(movie);
        setCustomTitle(movie.name);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    const handleClearSelection = () => {
        setSelectedMovie(null);
        setCustomTitle('');
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedMovie(null);
        setCustomTitle('');
        setIsSearchFocused(false);
        onClose();
    };

    const handleConvert = async () => {
        if (selectedMovie && torrent) {
            const json = {
                name: customTitle,
                content_name: torrent.file_name,
                kinopoisk_id: selectedMovie.kinopoisk_id.toString(),
            }
            await AdminMoviesService.addMovieToConverting(json);
            handleClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Конвертировать в фильм">
            <div className="space-y-6">
                {/* Информация о торренте */}
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 mb-1">Торрент</p>
                    <p className="text-sm text-white truncate">{torrent?.file_name}</p>
                    <div className="flex gap-4 mt-2">
                        <span className="text-xs text-zinc-400">Размер: {torrent?.size}</span>
                    </div>
                </div>

                {/* Поиск фильма */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                        Найти фильм в базе данных
                    </label>
                    <div className="relative">
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            placeholder="Начните вводить название..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg
                                       text-white placeholder-zinc-500 focus:outline-none focus:border-red-600
                                       focus:ring-1 focus:ring-red-600 transition-all"
                        />

                        {/* Индикатор загрузки */}
                        {isSearchLoading && isSearchFocused && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg
                                    className="w-5 h-5 text-zinc-500 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Выпадающий список результатов */}
                        {isSearchFocused && !isSearchLoading && searchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                                {searchResults.map((movie) => (
                                    <button
                                        key={searchResults.indexOf(movie) + 1}
                                        type="button"
                                        onClick={() => handleSelectMovie(movie)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors text-left"
                                    >
                                        {/* Постер */}
                                        <div className="w-10 h-14 bg-zinc-800 rounded flex-shrink-0 overflow-hidden">
                                            {movie.poster ? (
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-zinc-500"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {/* Информация */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {movie.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-zinc-500">{movie.year}</span>
                                                <span className="text-xs text-zinc-600">•</span>
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        className="w-3 h-3 text-yellow-500"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                    <span className="text-xs text-zinc-400">
                                                        {movie.rating?.kp || movie.rating?.imdb || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Загрузка */}
                        {isSearchFocused && isSearchLoading && debouncedSearch && (
                            <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-zinc-500 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    <p className="text-sm text-zinc-400">Поиск...</p>
                                </div>
                            </div>
                        )}

                        {/* Нет результатов */}
                        {isSearchFocused && !isSearchLoading && debouncedSearch && searchResults.length === 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 text-center">
                                <p className="text-sm text-zinc-400">Фильмы не найдены</p>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Попробуйте другой запрос
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Выбранный фильм - превью */}
                {selectedMovie && (
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-zinc-400">Выбранный фильм</p>
                            <button
                                type="button"
                                onClick={handleClearSelection}
                                className="text-xs text-red-500 hover:text-red-400 transition-colors"
                            >
                                Отменить выбор
                            </button>
                        </div>
                        <div className="flex gap-4">
                            {/* Постер */}
                            <div className="w-24 h-36 bg-zinc-700 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {selectedMovie.poster ? (
                                    <img
                                        src={selectedMovie.poster}
                                        alt={selectedMovie.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="w-8 h-8 text-zinc-500"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                                    </svg>
                                )}
                            </div>
                            {/* Информация о фильме */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-white">
                                    {selectedMovie.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm text-zinc-400">{selectedMovie.year}</span>
                                    <div className="flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4 text-yellow-500"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                        <span className="text-sm font-medium text-white">
                                            {selectedMovie.rating?.kp || selectedMovie.rating?.imdb || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                {/* Жанры */}
                                {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {selectedMovie.genres.slice(0, 3).map((genre, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-zinc-700 rounded text-xs text-zinc-300"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Кастомное название */}
                <Input
                    label="Название файла"
                    placeholder="Введите название для сохранения"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                />

                {/* Действия */}
                <div className="flex gap-3 pt-2">
                    <Button variant="ghost" onClick={handleClose} className="flex-1">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleConvert}
                        className="flex-1"
                        disabled={selectedMovie == null}
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Конвертировать
                    </Button>
                </div>
            </div>
        </Modal>
    );
};