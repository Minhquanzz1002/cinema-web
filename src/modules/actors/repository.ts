import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { Actor, ActorInsertPayload, ActorUpdatePayload } from '@/modules/actors/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BaseStatus } from '@/modules/base/interface';
import useDataFetching from '@/hook/useDataFetching';

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

/**
 * Update actor
 */
const updateActor = ({ id, payload }: {
    id: number,
    payload: ActorUpdatePayload
}): Promise<SuccessResponse<Actor>> => {
    return httpRepository.put<Actor, ActorUpdatePayload>(`/admin/v1/actors/${id}`, payload);
};

export const useUpdateActor = () => {
    return useMutation({
        mutationFn: updateActor,
        onSuccess: (res) => {
            toast.success(res.message);
        },
    });
};

/**
 * Fetch actor by code
 */
const fetchActorByCode = (code: string): Promise<SuccessResponse<Actor>> => {
    return httpRepository.get<Actor>(`/admin/v1/actors/${code}`);
};

export const useActorByCode = (code: string) => {
    return useDataFetching(
        [ACTOR_QUERY_KEY, code],
        () => fetchActorByCode(code),
        { enabled: !!code },
    );
};

/**
 * Delete actor by id
 */
const deleteActor = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/actors/${id}`);
};

export const useDeleteActor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteActor,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [ACTOR_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error('Xóa sản phẩm thất bại');
            console.error('Delete ticket price error:', error);
        },
    });
};

