import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { API_MESSAGES } from '@/variables/messages';
import { MOVIE_FILTER_QUERY_KEY, MOVIE_QUERY_KEY } from '@/modules/movies/repository';

export const GENRE_QUERY_KEY = 'genres';

/**
 * Create genre
 */
interface CreateGenreData {
    name: string;
}

const createGenre = (data: CreateGenreData): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateGenreData>('/admin/v1/genres', data);
};

export const useCreateGenre = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [GENRE_QUERY_KEY, 'create'],
        mutationFn: createGenre,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [MOVIE_QUERY_KEY, MOVIE_FILTER_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.GENRE);
            console.error('Create genre error:', error);
        },
    });
};