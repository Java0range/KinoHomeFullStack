import $api from '@/http'
import type { AxiosResponse } from 'axios'
import {UserResponse} from "@/models/UserModels";


export default class AuthService {
    static async login(username: string, password: string): Promise<AxiosResponse> {
        const json = {
            username: username,
            password: password
        }
        return $api.post("/users/login", json)
    }


    static async logout(): Promise<AxiosResponse> {
        return $api.post("/users/logout")
    }

    static getUserInfo(): Promise<AxiosResponse<UserResponse>> {
        return $api.get<UserResponse>("/users/me")
    }
}