import {useQuery} from "@tanstack/react-query";
import AuthService from "@/services/AuthService";

export const useLogin = (login: string, password: string) => {
    return useQuery({
        queryKey: ["login"],
        queryFn: () => AuthService.login(login, password),
        select: (({data}) => data)
    });
};

export const useGetUserInfo = () => {
    return useQuery({
        queryKey: ["login"],
        queryFn: () => AuthService.getUserInfo(),
        select: (({data}) => data)
    });
};