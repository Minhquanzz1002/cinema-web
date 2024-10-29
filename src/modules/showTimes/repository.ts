import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { AdminShowTime, AdminShowTimeFilters } from '@/modules/showTimes/interface';
import { BaseStatus } from '@/modules/base/interface';

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
    rooms: { name: string }[];
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