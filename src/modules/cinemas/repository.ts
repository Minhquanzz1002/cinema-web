import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { RoomWithIdAndName } from '@/modules/rooms/inteface';
import { BaseStatus } from '@/modules/base/interface';
import { PageObject } from '@/core/pagination/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminCinemaOverview } from '@/modules/cinemas/interface';
import { toast } from 'react-toastify';
import { API_MESSAGES } from '@/variables/messages';

export const CINEMA_QUERY_KEY = 'cinemas';

/**
 * Fetch all rooms by cinema id
 */

const findAllRoomByCinemaId = (cinemaId?: number): Promise<SuccessResponse<RoomWithIdAndName[]>> => {
    return httpRepository.get<RoomWithIdAndName[]>(`/admin/v1/cinemas/${cinemaId}/rooms`);
};

export const useAllRoomsByCinemaId = (cinemaId?: number) => {
    return useDataFetching(
        [CINEMA_QUERY_KEY, 'rooms', cinemaId],
        () => findAllRoomByCinemaId(cinemaId),
        { enabled: !!cinemaId },
    );
};

/**
 * Fetch all cinemas
 */
interface FetchAllCinemaParams {
    page?: number;
    search?: string;
    status?: BaseStatus;
}

const fetchAllCinemas = (params: FetchAllCinemaParams): Promise<SuccessResponse<PageObject<AdminCinemaOverview>>> => {
    return httpRepository.get<PageObject<AdminCinemaOverview>>('/admin/v1/cinemas', { ...params });
};

export const useAllCinemas = (params: FetchAllCinemaParams) => {
    return useQuery({ queryKey: [CINEMA_QUERY_KEY, params], queryFn: () => fetchAllCinemas(params) });
};

/**
 * Create cinema
 */

interface CinemaCreatePayload {
    name: string;
    address: string;
    ward: string;
    wardCode: string;
    district: string;
    districtCode: string;
    city: string;
    cityCode: string;
    hotline: string;
    status: BaseStatus;
    images?: string[];
}

const createCinema = (payload: CinemaCreatePayload): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CinemaCreatePayload>(`/admin/v1/cinemas`, payload);
};

export const useCreateCinema = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [CINEMA_QUERY_KEY, 'create'],
        mutationFn: createCinema,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.CINEMA);
        }
    });
};

/**
 * Update cinema
 */

interface CinemaUpdatePayload {
    name: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    hotline: string;
    status: BaseStatus;
    images?: string[];
}

const updateCinema = ({ id, payload }: {
    id: number,
    payload: CinemaUpdatePayload
}): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, CinemaUpdatePayload>(`/admin/v1/cinemas/${id}`, payload);
};

export const useUpdateCinema = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [CINEMA_QUERY_KEY, 'update'],
        mutationFn: updateCinema,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.UPDATE.CINEMA);
        }
    });
};

/**
 * Delete cinema
 */
const deleteCinema = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/cinemas/${id}`);
};

export const useDeleteCinema = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [CINEMA_QUERY_KEY, 'delete'],
        mutationFn: deleteCinema,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.DELETE.CINEMA);
            console.error('Delete cinema error:', error);
        },
    });
};

