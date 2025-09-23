from beanie import PydanticObjectId

from src.users.documents import UsersDocument
from fastapi import HTTPException, status

from src.users.schemas import UserResponseSchema

from dataclasses import dataclass
from passlib.context import CryptContext
import bcrypt



@dataclass
class SolveBugBcryptWarning:
    __version__: str = getattr(bcrypt, "__version__")


setattr(bcrypt, "__about__", SolveBugBcryptWarning())


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


class AsyncUsersODM:
    @staticmethod
    async def insert_user(
            username: str,
            password: str,
            permissions: str
    ):
        users = await UsersDocument.find(UsersDocument.username == username).to_list()
        if users:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Имя пользователя уже занято")
        hashed_password = await get_password_hash(password)
        user = UsersDocument(
            username=username,
            password=hashed_password,
            permissions=permissions
        )
        await user.insert()

    @staticmethod
    async def verify(username: str, password: str):
        user = await UsersDocument.find_one(UsersDocument.username == username)
        if user:
            if await verify_password(plain_password=password, hashed_password=user.password):
                return user.id
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Неверный логин или пароль")

    @staticmethod
    async def check_user_permissions(user_id: str) -> str:
        try:
            user_id = PydanticObjectId(user_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный id пользователя"
            )
        user = await UsersDocument.find_one(UsersDocument.id == user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь не найден")
        return user.permissions

    @staticmethod
    async def delete_user(user_id: str):
        try:
            user_id = PydanticObjectId(user_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный id пользователя"
            )
        user = await UsersDocument.find_one(UsersDocument.id == user_id)
        if user:
            await user.delete()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь не найден")

    @staticmethod
    async def update_user(
            user_id: str,
            username: str,
            password: str,
            permissions: str
    ):
        try:
            user_id = PydanticObjectId(user_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный id пользователя"
            )
        user = await UsersDocument.find_one(UsersDocument.id == user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь не найден")
        if username != user.username:
            user.username = username
        if password != user.password:
            user.password = await get_password_hash(password)
        if permissions != user.permissions:
            user.permissions = permissions
        await user.save()

    @staticmethod
    async def get_all_users():
        users = await UsersDocument.find().to_list()
        return [UserResponseSchema.model_validate(user, from_attributes=True) for user in users]