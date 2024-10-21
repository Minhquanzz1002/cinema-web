import { useQuery } from '@tanstack/react-query';
import httpRepository from '@/core/repository/http';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { AdminMovie, Movie, MovieFilter } from '@/modules/movies/interface';
import useDataFetching from '@/hook/useDataFetching';

const fetchAllMovies = (): Promise<SuccessResponse<PageObject<AdminMovie>>> => {
    return httpRepository.get<PageObject<AdminMovie>>('/admin/v1/movies');
};

const fetchMovieByCode = (code: string): Promise<SuccessResponse<Movie>> => {
    return httpRepository.get(`/admin/v1/movies/${code}`);
};

const fetchMovieFilters = (): Promise<SuccessResponse<MovieFilter>> => {
    return httpRepository.get('/admin/v1/movies/filters');
};

export const useAllMovies = () => {
    return useQuery({ queryKey: ['movies'], queryFn: fetchAllMovies });
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