import {useQuery} from "@tanstack/react-query";
import AdminTorrentsService from "@/services/AdminTorrentsService";

export const useGetAllTorrents = () => {
    return useQuery({
        queryKey: ["AdminAllTorrents"],
        refetchInterval: 2000,
        staleTime: 0,
        gcTime: 5000,
        queryFn: () => AdminTorrentsService.getAllTorrents(),
        select: (({data}) => data)
    });
};