from fastapi import APIRouter, HTTPException, status, Query
from qbittorrentapi import Client

from src.torrents.schemas import (
    TorrentResponseSchema,
    AddTorrentRequest,
    TorrentActionResponse,
)
from src.torrents.utils import format_size, format_speed
from src.config import config
from src.users.utils import permission_required

router = APIRouter(prefix="/torrents", tags=["Torrents"])


def get_qb_client() -> Client:
    return Client(**config.get_qbittorrent_params())


def find_torrent_or_404(qb_client: Client, torrent_hash: str):
    torrents = qb_client.torrents.info(torrent_hashes=torrent_hash)
    if not torrents:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Торрент с хешем '{torrent_hash}' не найден"
        )
    return torrents[0]


def build_torrent_response(row: dict) -> TorrentResponseSchema:
    """Преобразование сырых данных торрента в схему ответа"""
    return TorrentResponseSchema(
        hash=row['hash'],
        name=row['name'],
        file_name=row['content_path'].replace(row['save_path'], '').lstrip('/\\'),
        content_path=row['content_path'],
        save_path=row['save_path'],
        progress=int(row['progress'] * 100),
        state=row['state'],
        size=format_size(row['total_size']),
        speed=format_speed(row['dlspeed']),
    )




@permission_required("MODERATOR")
@router.get("", response_model=list[TorrentResponseSchema])
async def get_all_torrents(
        filter_state: str | None = Query(default=None)
):
    """
        Получить список всех торрентов.

        Возможные состояния (state):
        - `downloading` - скачивается
        - `seeding` - раздаётся
        - `pausedDL` - пауза (скачивание)
        - `pausedUP` - пауза (раздача)
        - `stalledDL` - ожидание пиров
        - `error` - ошибка
        """
    with get_qb_client() as qb_client:
        torrents = qb_client.torrents.info(
            status_filter=filter_state).data if filter_state else qb_client.torrents.info().data
        return [build_torrent_response(row) for row in torrents]


@permission_required("MODERATOR")
@router.get("/{torrent_hash}", response_model=TorrentResponseSchema)
async def get_torrent_by_hash(torrent_hash: str):
    """Получить информацию о торренте по хешу"""
    with get_qb_client() as qb_client:
        torrent = find_torrent_or_404(qb_client, torrent_hash)
        return build_torrent_response(torrent.info)




@permission_required("MODERATOR")
@router.post("/add", response_model=TorrentActionResponse)
async def add_torrent_by_magnet(request: AddTorrentRequest):
    """Добавить торрент по magnet-ссылке"""
    if not request.magnet_link.startswith("magnet:?"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некорректная magnet-ссылка"
        )

    with get_qb_client() as qb_client:
        add_params = {"urls": request.magnet_link}

        result = qb_client.torrents.add(**add_params)

        if result == "Ok.":
            return TorrentActionResponse(success=True, message="Торрент добавлен")

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Не удалось добавить торрент")


@permission_required("MODERATOR")
@router.post("/{torrent_hash}/pause", response_model=TorrentActionResponse)
async def pause_torrent(torrent_hash: str):
    """Поставить торрент на паузу"""
    with get_qb_client() as qb_client:
        torrent = find_torrent_or_404(qb_client, torrent_hash)

        if torrent.state == "stoppedDL":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Торрент уже на паузе")

        qb_client.torrents.pause(torrent_hashes=torrent_hash)
        return TorrentActionResponse(success=True, message=f"'{torrent.name}' на паузе", torrent_hash=torrent_hash)


@permission_required("MODERATOR")
@router.post("/{torrent_hash}/resume", response_model=TorrentActionResponse)
async def resume_torrent(torrent_hash: str):
    """Возобновить скачивание торрента"""
    with get_qb_client() as qb_client:
        torrent = find_torrent_or_404(qb_client, torrent_hash)

        if torrent.state != "stoppedDL":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Торрент не на паузе")

        qb_client.torrents.resume(torrent_hashes=torrent_hash)
        return TorrentActionResponse(success=True, message=f"'{torrent.name}' возобновлён", torrent_hash=torrent_hash)




@permission_required("MODERATOR")
@router.delete("/{torrent_hash}", response_model=TorrentActionResponse)
async def delete_torrent(
        torrent_hash: str,
        delete_files: bool = Query(default=True, description="Удалить файлы с диска")
):
    """Удалить торрент (по умолчанию вместе с файлами)"""
    with get_qb_client() as qb_client:
        torrent = find_torrent_or_404(qb_client, torrent_hash)
        torrent_name = torrent.name

        qb_client.torrents.delete(delete_files=delete_files, torrent_hashes=torrent_hash)

        msg = f"'{torrent_name}' удалён" + (" с файлами" if delete_files else "")
        return TorrentActionResponse(success=True, message=msg, torrent_hash=torrent_hash)