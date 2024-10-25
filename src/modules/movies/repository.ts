import { useQuery } from '@tanstack/react-query';
import httpRepository from '@/core/repository/http';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { AdminMovie, AgeRating, Movie, MovieFilter, MovieStatus } from '@/modules/movies/interface';
import useDataFetching from '@/hook/useDataFetching';

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

const fetchMovieByCode = (code: string): Promise<SuccessResponse<Movie>> => {
    return httpRepository.get(`/admin/v1/movies/${code}`);
};

const fetchMovieFilters = (): Promise<SuccessResponse<MovieFilter>> => {
    return httpRepository.get('/admin/v1/movies/filters');
};

export const useMovieByCode = (code: string) => {
    return useDataFetching(
        ['movie', code],
        () => fetchMovieByCode(code),
        { enabled: !!code },
    );
};

export const useMovieFilters = () => {
    return useQuery({ queryKey: ['movieFilters'], queryFn: fetchMovieFilters });
};