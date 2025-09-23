from pydantic import BaseModel


class TorrentResponseSchema(BaseModel):
    name: str
    content_path: str
    save_path: str
    progress: int
    state: str