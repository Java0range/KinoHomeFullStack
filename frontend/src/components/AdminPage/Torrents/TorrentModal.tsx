import React, {useState} from 'react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import AdminTorrentsService from "@/services/AdminTorrentsService";

interface TorrentModalProps {
    isOpen: boolean;
    refetchTorrents: () => void;
    onClose: () => void;
}

export const TorrentModal: React.FC<TorrentModalProps> = ({
                                                              isOpen,
                                                              refetchTorrents,
                                                              onClose,
                                                          }) => {
    const [magnetLink, setMagnetLink] = useState('');

    const AddTorrent = async () => {
        await AdminTorrentsService.addTorrent(magnetLink);
        refetchTorrents();
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Добавить торрент">
            <form className="space-y-4">
                <Input
                    onChange={(e) => setMagnetLink(e.target.value)}
                    value={magnetLink}
                    label="Magnet-ссылка"
                    placeholder="magnet:?xt=urn:btih:..."
                />

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Отмена
                    </Button>
                    <Button onClick={AddTorrent} type="submit" className="flex-1">
                        Добавить
                    </Button>
                </div>
            </form>
        </Modal>
    );
};