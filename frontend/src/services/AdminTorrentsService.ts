import $api from '@/http'
import type { AxiosResponse } from 'axios'
import {TorrentsModel} from "@/models/TorrentsModels";


export default class AdminTorrentsService {
    static async getAllTorrents(): Promise<AxiosResponse<TorrentsModel[]>> {
        return $api.get<TorrentsModel[]>("/torrents")
    }
    static async deleteTorrent(hash: string): Promise<AxiosResponse> {
        return $api.delete(`/torrents/${hash}`)
    }
    static async addTorrent(magnetLink: string): Promise<AxiosResponse> {
        const json = {
            "magnet_link": magnetLink
        }
        return $api.post("/torrents/add", json)
    }
    static async pauseTorrent(hash: string): Promise<AxiosResponse> {
        return $api.post(`/torrents/${hash}/pause`)
    }
    static async resumeTorrent(hash: string): Promise<AxiosResponse> {
        return $api.post(`/torrents/${hash}/resume`)
    }
}