import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpRepository from '@/core/repository/http';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { AdminMovie, AgeRating, Movie, MovieFilter, MovieStatus } from '@/modules/movies/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

export const MOVIE_QUERY_KEY = 'movies';

/**
 * Fetch all movies
 */
interface FetchAllMovieParams {
    page?: number;
    country?: string;
    search?: string;
    ageRating?: AgeRating;
    status?: MovieStatus;
}

const fetchAllMovies = (params: FetchAllMovieParams): Promise<SuccessResponse<PageObject<AdminMovie>>> => {
    return httpRepository.get<PageObject<AdminMovie>>('/admin/v1/movies', {
        page: params.page?.toString() || '0',
        country: params.country,
        search: params.search,
        ageRating: params.ageRating,
        status: params.status,
    });
};

export const useAllMovies = (params: FetchAllMovieParams) => {
    return useQuery({ queryKey: [MOVIE_QUERY_KEY, params], queryFn: () => fetchAllMovies(params) });
};

/**
 * Fetch movie by code
 * @param code movie code
 */

const fetchMovieByCode = (code: string): Promise<SuccessResponse<Movie>> => {
    return httpRepository.get(`/admin/v1/movies/${code}`);
};

export const useMovieByCode = (code: string) => {
    return useDataFetching(
        ['movie', code],
        () => fetchMovieByCode(code),
        { enabled: !!code },
    );
};

/**
 * Fetch movie filters
 */

const fetchMovieFilters = (): Promise<SuccessResponse<MovieFilter>> => {
    return httpRepository.get('/admin/v1/movies/filters');
};

export const useMovieFilters = () => {
    return useQuery({ queryKey: ['movieFilters'], queryFn: fetchMovieFilters });
};

/**
 * Delete movie
 */
const deleteMovie = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/movies/${id}`);
};

export const useDeleteMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMovie,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [MOVIE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error('Xóa phim không thành công');
            console.error('Delete movie error:', error);
        },
    });
};

/**
 * Create movie
 */

interface CreateMoviePayload {
    title: string,
    trailer: string,
    duration: number,
    country: string,
    summary: string,
    imagePortrait: string,
    imageLandscape: string,
    ageRating: AgeRating,
    genres: number[],
    actors: number[],
    producers: number[],
    directors: number[],
    status: MovieStatus,
}

const createMovie = (payload: CreateMoviePayload): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateMoviePayload>('/admin/v1/movies', payload);
};

export const useCreateMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMovie,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [MOVIE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: error => {
            toast.error('Thêm phim không thành công');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Update movie
 */

interface UpdateMoviePayload {
    title: string,
    trailer: string,
    duration: number,
    country: string,
    summary: string,
    imagePortrait: string,
    imageLandscape: string,
    ageRating: AgeRating,
    genres: number[],
    actors: number[],
    producers: number[],
    directors: number[],
    status: MovieStatus,
}

const updateMovie = ({ id, payload }: { payload: UpdateMoviePayload, id: number }): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, CreateMoviePayload>(`/admin/v1/movies/${id}`, payload);
};

export const useUpdateMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMovie,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [MOVIE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: error => {
            toast.error('Cập nhật phim không thành công');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Fetch movie for sales
 */

const fetchMovieForSales = (): Promise<SuccessResponse<AdminMovie[]>> => {
    return httpRepository.get('/admin/v1/movies/sales');
};

export const useAllMoviesForSale = () => {
    return useDataFetching(
        [MOVIE_QUERY_KEY, 'sales'],
        () => fetchMovieForSales(),
    );
};