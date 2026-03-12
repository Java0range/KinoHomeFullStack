import React, { useMemo, useState } from 'react';
import { TorrentsTable } from './TorrentsTable';
import { TorrentModal } from './TorrentModal';
import { ConvertModal } from './ConvertModal';
import { Button } from '../UI/Button';
import { useGetAllTorrents } from "@/hooks/AdminTorrentsHooks";
import { useDebounce } from "@/hooks/useDebounce";
import { TorrentsModel } from "@/models/TorrentsModels";

export const TorrentsSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [selectedTorrent, setSelectedTorrent] = useState<TorrentsModel | null>(null);

    const { data: torrents = [], isLoading: isTorrentsLoading, refetch: refetchTorrents } = useGetAllTorrents();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const filteredTorrents = useMemo(() => {
        if (!debouncedSearch.trim()) {
            return torrents;
        }

        const query = debouncedSearch.toLowerCase().trim();
        return torrents.filter((torrent) =>
            torrent.file_name.toLowerCase().includes(query)
        );
    }, [torrents, debouncedSearch]);

    const handleConvert = (torrent: TorrentsModel) => {
        setSelectedTorrent(torrent);
        setIsConvertModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Торренты</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Управление загрузками торрентов
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
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
                    Добавить торрент
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Загружается</p>
                            <p className="text-xl font-bold text-white">{torrents.filter(t => t.state === 'downloading').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5-5-5 5h3v4h4v-4h3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Раздаётся</p>
                            <p className="text-xl font-bold text-white">{torrents.filter(t => t.state === 'stalledUP').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-zinc-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Завершено</p>
                            <p className="text-xl font-bold text-white">{torrents.filter(t => t.state === 'stoppedUP').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg
                                   text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                </div>
            </div>

            {/* Table */}
            <TorrentsTable
                torrents={filteredTorrents}
                refetchTorrents={refetchTorrents}
                onConvert={handleConvert}
            />

            {/* Add Torrent Modal */}
            <TorrentModal
                isOpen={isModalOpen}
                refetchTorrents={refetchTorrents}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Convert Modal */}
            <ConvertModal
                isOpen={isConvertModalOpen}
                onClose={() => setIsConvertModalOpen(false)}
                torrent={selectedTorrent}
            />
        </div>
    );
};