import React from 'react';
import { TorrentsModel } from "@/models/TorrentsModels";
import { Button } from "@/components/AdminPage/UI/Button";
import AdminTorrentsService from "@/services/AdminTorrentsService";

interface TorrentsTableProps {
    torrents: TorrentsModel[];
    refetchTorrents: () => void;
    onConvert: (torrent: TorrentsModel) => void;
}

const getStatusInfo = (status: TorrentsModel["state"]) => {
    switch (status) {
        case 'downloading':
            return { label: 'Загрузка', color: 'bg-blue-600/20 text-blue-400' };
        case 'stalledUP':
            return { label: 'Раздача', color: 'bg-green-600/20 text-green-400' };
        case 'stoppedDL':
            return { label: 'Остановлено', color: 'bg-yellow-600/20 text-yellow-400' };
        case 'queuedDL':
            return { label: 'В очереди', color: 'bg-yellow-600/20 text-yellow-400' };
        case 'stoppedUP':
            return { label: 'Завершён', color: 'bg-zinc-700 text-zinc-300' };
        case 'metaDL':
            return { label: 'Загрузка Мета-Данных', color: 'bg-purple-600/20 text-purple-400' };
        case 'stalledDL':
            return { label: 'Простаивает', color: 'bg-cyan-600/20 text-cyan-400' };
        case 'error':
            return { label: 'Ошибка', color: 'bg-red-600/20 text-red-400' };
        default:
            return { label: 'Неизвестно', color: 'bg-zinc-700 text-zinc-400' };
    }
};

export const TorrentsTable: React.FC<TorrentsTableProps> = ({
                                                                torrents,
                                                                refetchTorrents,
                                                                onConvert,
                                                            }) => {
    const handleDelete = async (hash: string) => {
        await AdminTorrentsService.deleteTorrent(hash);
        refetchTorrents();
    };

    const handlePauseButton = async (state: string, hash: string) => {
        if (state === 'stoppedDL') {
            await AdminTorrentsService.resumeTorrent(hash);
            refetchTorrents();
        } else {
            await AdminTorrentsService.pauseTorrent(hash);
            refetchTorrents();
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead>
                <tr className="border-b border-zinc-800">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Наименование
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Прогресс
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Статус
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Скорость
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Размер
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-zinc-400">
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody>
                {torrents.map((torrent, index) => {
                    const statusInfo = getStatusInfo(torrent.state);
                    return (
                        <tr
                            key={torrent.hash || index}
                            className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-zinc-500"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white truncate max-w-xs">
                                            {torrent.file_name ? torrent.file_name : torrent.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden w-32">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                torrent.state === 'error'
                                                    ? 'bg-red-600'
                                                    : torrent.progress === 100
                                                        ? 'bg-green-600'
                                                        : 'bg-red-600'
                                            }`}
                                            style={{ width: `${torrent.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-zinc-400 w-12">
                                            {torrent.progress}%
                                        </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                                    >
                                        {statusInfo.label}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-400">
                                {torrent.speed}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-400">
                                {torrent.size}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    {(torrent.state === "stoppedUP" || torrent.state === "stalledUP") && (
                                        <Button onClick={() => onConvert(torrent)}>
                                            Конвертировать
                                        </Button>
                                    )}
                                    {/* Pause/Resume Button */}
                                    <button
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                        onClick={() => handlePauseButton(torrent.state, torrent.hash)}
                                    >
                                        {torrent.state === "stoppedDL" ? (
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                            </svg>
                                        )}
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(torrent.hash)}
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
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};