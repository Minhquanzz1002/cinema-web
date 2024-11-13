import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { RoomWithIdAndName } from '@/modules/rooms/inteface';

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