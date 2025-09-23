export enum UserPermission {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    USER = 'USER'
}

export interface UserResponse {
    permissions: UserPermission
}