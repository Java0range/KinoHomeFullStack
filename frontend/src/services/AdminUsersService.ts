import $api from '@/http'
import type { AxiosResponse } from 'axios'
import {UserPermission, UsersResponse} from "@/models/UserModels";


export default class AdminUsersService {
    static async getUsers(): Promise<AxiosResponse<UsersResponse[]>> {
        return $api.get("/users")
    }
    static async deleteUser(id: string): Promise<AxiosResponse> {
        return $api.delete(`/users/${id}`)
    }
    static async createUser(username: string, password: string, permissions: UserPermission): Promise<AxiosResponse> {
        const json = {
            username: username,
            password: password,
            permissions: permissions
        }
        return $api.post("/users", json)
    }
    static async updateUser(id: string, username: string, password: string, permissions: UserPermission):
        Promise<AxiosResponse> {
        const json = {
            username: username,
            password: password,
            permissions: permissions
        }
        return $api.put(`/users/${id}`, json)
    }
}