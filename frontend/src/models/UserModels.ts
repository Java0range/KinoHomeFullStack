export enum UserPermission {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    USER = 'USER'
}

export interface UserResponse {
    permissions: UserPermission
}

export interface UsersResponse {
    id: string,
    username: string,
    permissions: UserPermission
}

export interface User {
    id: number,
    db_id: string,
    username: string,
    permissions: UserPermission
}