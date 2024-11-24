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
 * Delete cinema
 */
const deleteCinema = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/cinemas/${id}`);
};

export const useDeleteCinema = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCinema,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY, 'delete'] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.DELETE.CINEMA);
            console.error('Delete cinema error:', error);
        },
    });
};