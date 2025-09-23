from fastapi import Request, HTTPException, status
from typing import Callable, Coroutine, Any
from src.users.jwt import security
from src.users.odm import AsyncUsersODM
from functools import wraps


class Permissions:
    def __init__(self, permissions: str):
        match permissions:
            case "ADMIN":
                self.permissions = 3
            case "MODERATOR":
                self.permissions = 2
            case "USER":
                self.permissions = 1

    def __ge__(self, other):
        return self.permissions >= other.permissions

    def __le__(self, other):
        return self.permissions <= other.permissions



async def check_permissions(permissions: str, request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недействительный access токен")
    user_id = security.check_access_token(access_token)
    if "Error" in user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недействительный access токен")
    user_permissions = await AsyncUsersODM.check_user_permissions(user_id)
    if Permissions(user_permissions) >= Permissions(permissions):
        return True
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")


async def get_user_permissions(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недействительный access токен")
    user_id = security.check_access_token(access_token)
    if "Error" in user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недействительный access токен")
    return await AsyncUsersODM.check_user_permissions(user_id)


def permission_required(required_permissions: str):
    """
    Декоратор для проверки прав пользователя перед выполнением эндпоинта.
    Требуемые права передаются как аргумент декоратора.

    Пример использования:
    @router.post("/secure-route")
    @require_permissions("admin")
    async def secure_endpoint(request: Request):
        ...
    """
    def decorator(endpoint: Callable[..., Coroutine[Any, Any, Any]]):
        @wraps(endpoint)
        async def wrapper(request: Request, *args, **kwargs) -> Any:
            # Выполняем проверку прав
            await check_permissions(required_permissions, request)

            # Если проверка пройдена - выполняем основной эндпоинт
            return await endpoint(request, *args, **kwargs)

        return wrapper

    return decorator
