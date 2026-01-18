import React from 'react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

interface TorrentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TorrentModal: React.FC<TorrentModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                          }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Добавить торрент">
            <form className="space-y-4">
                <Input
                    label="Magnet-ссылка"
                    placeholder="magnet:?xt=urn:btih:..."
                />

                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 mb-2">Или загрузите .torrent файл</p>
                    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-red-600/50 transition-colors cursor-pointer">
                        <svg
                            className="w-8 h-8 text-zinc-500 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-sm text-zinc-400">
                            Перетащите файл сюда или{' '}
                            <span className="text-red-500">выберите</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Отмена
                    </Button>
                    <Button type="submit" className="flex-1">
                        Добавить
                    </Button>
                </div>
            </form>
        </Modal>
    );
};