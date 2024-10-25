import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { Actor, ActorInsertPayload } from '@/modules/actors/interface';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BaseStatus } from '@/modules/base/interface';

export const ACTOR_QUERY_KEY = 'actors';

/**
 * Fetch all actors
 */
interface FetchAllActorsParams {
    page?: number;
    search?: string;
    country?: string;
    status?: BaseStatus;
}

const fetchAllActors = (params: FetchAllActorsParams): Promise<SuccessResponse<PageObject<Actor>>> => {
    return httpRepository.get<PageObject<Actor>>('/admin/v1/actors', {
        page: params.page?.toString() || '0',
        search: params.search,
        country: params.country,
        status: params.status,
    });
};

export const useAllActors = (params: FetchAllActorsParams) => {
    return useQuery({
        queryKey: [ACTOR_QUERY_KEY, params],
        queryFn: () => fetchAllActors(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });
};

/**
 * Create actor
 */
const createActor = (payload: ActorInsertPayload): Promise<SuccessResponse<Actor>> => {
    return httpRepository.post<Actor>('/admin/v1/actors', payload);
};

export const useCreateActor = () => {
    return useMutation({
        mutationFn: createActor,
        onSuccess: () => {
            toast.success('Thêm diễn viên thành công');
        },
    });
};