import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { API_MESSAGES } from '@/variables/messages';
import { MOVIE_FILTER_QUERY_KEY, MOVIE_QUERY_KEY } from '@/modules/movies/repository';

export const PRODUCER_QUERY_KEY = 'producers';

/**
 * Create genre
 */
interface CreateProducerData {
    name: string;
}

const createProducer = (data: CreateProducerData): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateProducerData>('/admin/v1/producers', data);
};

export const useCreateProducer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [PRODUCER_QUERY_KEY, 'create'],
        mutationFn: createProducer,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [MOVIE_QUERY_KEY, MOVIE_FILTER_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.PRODUCER);
            console.error('Create genre error:', error);
        },
    });
};