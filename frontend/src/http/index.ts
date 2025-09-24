import axios, { type AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: baseURL,
})


$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 &&
        error.response.data.detail === "Недействительный access токен" &&
        error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            await $api.post<AxiosResponse>("/users/refresh");
            return $api.request(originalRequest);
        } catch (err) {
            console.log(err);
        }
    }
    throw error;
})


export default $api;