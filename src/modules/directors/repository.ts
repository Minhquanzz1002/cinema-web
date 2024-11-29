import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Director } from '@/modules/directors/interface';
import { BaseStatus } from '@/modules/base/interface';
import { toast } from 'react-toastify';
import { API_MESSAGES } from '@/variables/messages';
import useDataFetching from '@/hook/useDataFetching';

const DIRECTOR_QUERY_KEY = 'directors';

/**
 * Fetch all directors
 */
interface FetchAllDirectorParams {
    page?: number;
    search?: string;
    country?: string;
    status?: BaseStatus;
}

const fetchAllDirectors = (params: FetchAllDirectorParams): Promise<SuccessResponse<PageObject<Director>>> => {
    return httpRepository.get<PageObject<Director>>('/admin/v1/directors', {
        page: params.page?.toString() || '0',
        search: params.search,
        country: params.country,
        status: params.status,
    });
};

export const useAllDirectors = (params: FetchAllDirectorParams) => {
    return useQuery({ queryKey: [DIRECTOR_QUERY_KEY, params], queryFn: () => fetchAllDirectors(params) });
};

/**
 * Create director
 */
interface CreateDirectorData {
    name: string;
    birthday?: string;
    country?: string;
    image?: string;
    bio?: string;
    status: BaseStatus;
}

const createDirector = (data: CreateDirectorData): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateDirectorData>('/admin/v1/directors', data);
};

export const useCreateDirector = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [DIRECTOR_QUERY_KEY, 'create'],
        mutationFn: createDirector,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [DIRECTOR_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.DIRECTOR);
            console.error('Create genre error:', error);
        },
    });
};

/**
 * Fetch director by code
 */
const fetchDirectorByCode = (code: string): Promise<SuccessResponse<Director>> => {
    return httpRepository.get<Director>(`/admin/v1/directors/${code}`);
};

export const useDirectorByCode = (code: string) => {
    return useDataFetching(
        [DIRECTOR_QUERY_KEY, code],
        () => fetchDirectorByCode(code),
        { enabled: !!code },
    );
};

/**
 * Update director
 */
interface ActorUpdateData {
    name: string;
    birthday?: string;
    country?: string;
    image?: string;
    bio?: string;
    status?: BaseStatus;
}

const updateDirector = ({ id, data }: {
    id: number,
    data: ActorUpdateData
}): Promise<SuccessResponse<Director>> => {
    return httpRepository.put<Director, ActorUpdateData>(`/admin/v1/directors/${id}`, data);
};

export const useUpdateDirector = () => {
    return useMutation({
        mutationFn: updateDirector,
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.UPDATE.DIRECTOR);
            console.error('Update director error:', error);
        }
    });
};

/**
 * Delete director by id
 */
const deleteDirector = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/directors/${id}`);
};

export const useDeleteDirector = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [DIRECTOR_QUERY_KEY, 'delete'],
        mutationFn: deleteDirector,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [DIRECTOR_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.DELETE.DIRECTOR);
            console.error('Delete director error:', error);
        },
    });
};