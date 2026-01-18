import { useQuery } from "@tanstack/react-query";
import AdminUsersService from "@/services/AdminUsersService";
import {User, UsersResponse} from "@/models/UserModels";

export const useGetUsers = () => {
    return useQuery({
        queryKey: ["adminGetUsers"],
        queryFn: () => AdminUsersService.getUsers(),
        select: ({ data }): User[] =>
            data.map((user: UsersResponse, index: number): User => ({
                id: index + 1,
                db_id: user.id,
                username: user.username,
                permissions: user.permissions,
            })),
    });
};