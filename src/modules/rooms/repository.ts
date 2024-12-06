import { BaseStatus } from '@/modules/base/interface';
import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { CINEMA_QUERY_KEY } from '@/modules/cinemas/repository';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_MESSAGES } from '@/variables/messages';

export const ROOM_QUERY_KEY = 'rooms';

/**
 * Create cinema
 */
interface RoomCreatePayload {
    name: string;
    status: BaseStatus;
    cinemaId: number;
}

const createRoom = (payload: RoomCreatePayload): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, RoomCreatePayload>(`/admin/v1/rooms`, payload);
};

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [ROOM_QUERY_KEY, 'create'],
        mutationFn: createRoom,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.ROOM);
        },
    });
};

/**
 * Update room
 */
interface RoomUpdatePayload {
    name: string;
    status: BaseStatus;
}

const updateRoom = ({id, payload} : {id: number; payload: RoomUpdatePayload}): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, RoomUpdatePayload>(`/admin/v1/rooms/${id}`, payload);
};

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [ROOM_QUERY_KEY, 'update'],
        mutationFn: updateRoom,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.ROOM);
        },
    });
};

/**
 * Delete room
 */
const deleteRoom = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/rooms/${id}`);
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [ROOM_QUERY_KEY, 'delete'],
        mutationFn: deleteRoom,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CINEMA_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.DELETE.ROOM);
            console.error('Delete cinema error:', error);
        },
    });
};