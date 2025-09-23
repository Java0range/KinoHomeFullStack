from beanie import PydanticObjectId
from pydantic import BaseModel


class LoginUserSchema(BaseModel):
    username: str
    password: str


class CreateOrUpdateUserSchema(BaseModel):
    username: str
    password: str
    permissions: str


class UserResponseSchema(BaseModel):
    id: PydanticObjectId
    username: str
    permissions: str