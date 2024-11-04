import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminShowTime, AdminShowTimeFilters, AdminShowTimeForSale, Layout } from '@/modules/showTimes/interface';
import { BaseStatus } from '@/modules/base/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';

export const SHOW_TIME_QUERY_KEY = 'showTimes';

/**
 * Fetch all show times
 */
interface FetchAllShowTimeParams {
    cinemaId: number;
    movieId?: number;
    status?: BaseStatus;
    startDate?: string;
}

interface AdminShowTimeResponse {
    showTimes: AdminShowTime[];
    rooms: { name: string, id: number }[];
}

const findAllShowTimes = (params: FetchAllShowTimeParams): Promise<SuccessResponse<AdminShowTimeResponse>> => {
    return httpRepository.get<AdminShowTimeResponse>(`/admin/v1/show-times`, {
        cinemaId: params.cinemaId,
        movieId: params.movieId,
        status: params.status,
        startDate: params.startDate,
    });
};

export const useAllShowTimes = (params: FetchAllShowTimeParams) => {
    return useQuery({
        queryKey: [SHOW_TIME_QUERY_KEY, params],
        queryFn: () => findAllShowTimes(params!),
        enabled: !!params?.cinemaId,
    });
};

/**
 * Fetch show time by id
 */
const findAllShowTimeFilters = (): Promise<SuccessResponse<AdminShowTimeFilters>> => {
    return httpRepository.get<AdminShowTimeFilters>(`/admin/v1/show-times/filters`);
};

export const useAllShowTimeFilters = () => {
    return useQuery({
        queryKey: [SHOW_TIME_QUERY_KEY, 'filters'],
        queryFn: findAllShowTimeFilters,
    });
};

/**
 * Create show time
 */

interface CreateShowTimePayload {
    movieId: number;
    cinemaId: number;
    roomId: number;
    startTime: string;
    endTime: string;
    startDate: string;
    status: BaseStatus;
}

const createShowTime = (payload: CreateShowTimePayload): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateShowTimePayload>('/admin/v1/show-times', payload);
};

export const useCreateShowTime = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createShowTime,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [SHOW_TIME_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message);
            console.error('Create show time error:', error);
        },
    });
};

/**
 * Delete show time
 */
const deleteShowTime = (id: string): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/show-times/${id}`);
};

export const useDeleteShowTime = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteShowTime,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [SHOW_TIME_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Xóa suất chiếu không thành công. Hãy thử lại sau');
            console.error('Delete ticket price error:', error);
        },
    });
};

/**
 * Update show time
 */
interface UpdateShowTimePayload {
    movieId: number;
    cinemaId: number;
    roomId: number;
    startTime: string;
    endTime: string;
    startDate: string;
    status: BaseStatus;
}

const updateShowTime = ({ id, payload }: {
    id: string,
    payload: UpdateShowTimePayload
}): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, UpdateShowTimePayload>(`/admin/v1/show-times/${id}`, payload);
};

export const useUpdateShowTime = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateShowTime,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [SHOW_TIME_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Cập nhật suất chiếu không thành công. Hãy thử lại sau');
            console.error('Update show time error:', error);
        },
    });
};

/**
 * Fetch show time by for sale
 */
interface FetchShowTimeForSaleParams {
    cinemaId?: number;
    startDate?: string;
    movieId?: number;
}

const findAllShowTimesForSale = (params: FetchShowTimeForSaleParams): Promise<SuccessResponse<AdminShowTimeForSale[]>> => {
    return httpRepository.get<AdminShowTimeForSale[]>(`/admin/v1/show-times/sales`, {
        ...params,
    });
};

export const useAllShowTimesForSale = (params: FetchShowTimeForSaleParams) => {
    return useDataFetching(
        [SHOW_TIME_QUERY_KEY, 'sales', params],
        () => findAllShowTimesForSale(params),
        {
            enabled: !!params.movieId,
        },
    );
};

/**
 * Fetch layout seat by show time id
 */
const findLayoutSeatByShowTimeId = (showTimeId: string): Promise<SuccessResponse<Layout>> => {
    return httpRepository.get<Layout>(`/v1/show-times/${showTimeId}/seat-layout`);
};

export const useLayoutSeatByShowTimeId = (showTimeId: string) => {
    return useDataFetching(
        [SHOW_TIME_QUERY_KEY, 'seat-layout', showTimeId],
        () => findLayoutSeatByShowTimeId(showTimeId),
        {
            enabled: !!showTimeId,
        },
    );
};