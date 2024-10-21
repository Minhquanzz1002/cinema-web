import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { Actor, ActorInsertPayload } from '@/modules/actors/interface';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface FetchAllActorsParams {
    page?: number;
    code?: string;
    name?: string;
}

const fetchAllActors = (params: FetchAllActorsParams): Promise<SuccessResponse<PageObject<Actor>>> => {
    return httpRepository.get<PageObject<Actor>>('/admin/v1/actors', {
        page: params.page?.toString() || '0',
        code: params.code,
        name: params.name,
    });
};

const createActor = (payload: ActorInsertPayload): Promise<SuccessResponse<Actor>> => {
    return httpRepository.post<Actor>("/admin/v1/actors", payload);
};

export const useAllActors = (params: FetchAllActorsParams) => {
    return useQuery({
        queryKey: ['actors', params],
        queryFn: () => fetchAllActors(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });
};

export const useCreateActor = () => {
    return useMutation({
        mutationFn: createActor,
        onSuccess: () => {
            toast.success("Thêm diễn viên thành công");
        }
    });
};