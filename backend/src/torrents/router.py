from fastapi import APIRouter
from qbittorrentapi import Client

from src.torrents.schemas import TorrentResponseSchema

from src.config import config
from src.users.utils import permission_required

router = APIRouter(prefix="/torrents", tags=["Torrents"])


@permission_required("MODERATOR")
@router.get("")
async def get_all_torrents():
    with Client(**config.get_qbittorrent_params()) as qb_client:
        torrents = qb_client.torrents.info().data
        torrents_dto = []
        for row in torrents:
            torrents_dto.append(TorrentResponseSchema(
                name=row['name'],
                content_path=row['content_path'],
                save_path=row['save_path'],
                progress=int(row['progress'] * 100),
                state=row['state'],
            ))
        return torrents_dto