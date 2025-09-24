from fastapi import APIRouter, Response, Request, HTTPException, status

from src.users.schemas import LoginUserSchema, CreateOrUpdateUserSchema
from src.users.odm import AsyncUsersODM
from src.users.jwt import security

from src.users.utils import permission_required, get_user_permissions

router = APIRouter(prefix="/users", tags=["Users & Auth"])


@router.post("/login")
async def login_user(json: LoginUserSchema, response: Response):
    user_id = await AsyncUsersODM.verify(
        username=json.username,
        password=json.password
    )
    response.set_cookie(
        key="access_token",
        value=security.create_access_token(user_id=str(user_id)),
        httponly=True,
        max_age=10
    )
    response.set_cookie(
        key="refresh_token",
        value=security.create_refresh_token(user_id=str(user_id)),
        httponly=True,
        max_age=604800
    )


@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")


@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невалидный refresh токен")
    response.set_cookie(
        key="access_token",
        value=security.check_refresh_token(refresh_token=token),
        httponly=True,
        max_age=1800
    )


@router.get("/me")
async def get_user_info(request: Request):
    return {
        "permissions": await get_user_permissions(request)
    }


@router.post("")
@permission_required("ADMIN")
async def create_user(request: Request, json: CreateOrUpdateUserSchema):
    await AsyncUsersODM.insert_user(
        username=json.username,
        password=json.password,
        permissions=json.permissions
    )


@router.delete("/{user_id}")
@permission_required("ADMIN")
async def delete_user(request: Request, user_id: str):
    await AsyncUsersODM.delete_user(user_id=user_id)


@router.put("/{user_id}")
@permission_required("ADMIN")
async def update_user(request: Request, user_id: str, json: CreateOrUpdateUserSchema):
    await AsyncUsersODM.update_user(
        user_id=user_id,
        username=json.username,
        password=json.password,
        permissions=json.permissions
    )


@router.get("")
@permission_required("ADMIN")
async def get_users(request: Request):
    return await AsyncUsersODM.get_all_users()