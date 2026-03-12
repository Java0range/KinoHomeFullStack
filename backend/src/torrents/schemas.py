from pydantic import BaseModel, Field


class TorrentResponseSchema(BaseModel):
    hash: str
    name: str
    file_name: str
    content_path: str
    save_path: str
    progress: int = Field(ge=0, le=100)
    state: str
    size: str = Field(description="Размер файла (например: 2.5 GB, 150 MB)")
    speed: str = Field(description="Скорость загрузки (например: 5.2 MB/s, 800 KB/s)")


class AddTorrentRequest(BaseModel):
    magnet_link: str = Field(
        ...,
        description="Magnet-ссылка",
        examples=["magnet:?xt=urn:btih:..."]
    )


class TorrentActionResponse(BaseModel):
    success: bool
    message: str
    torrent_hash: str | None = None