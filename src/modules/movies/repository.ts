import { useQuery } from '@tanstack/react-query';
import httpRepository from '@/core/repository/http';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { AdminMovie, MovieFilter } from '@/modules/movies/interface';

const fetchAllMovies = (): Promise<SuccessResponse<PageObject<AdminMovie>>> => {
    return httpRepository.execute({ path: '/admin/v1/movies' });
};

const fetchMovieById = (id: string) => {
    return httpRepository.execute({ path: `/v1/movies/${id}` });
};

const fetchMovieFilters = (): Promise<SuccessResponse<MovieFilter>> => {
    return httpRepository.execute({ path: '/admin/v1/movies/filters' });
};

export const useAllMovies = () => {
    return useQuery({ queryKey: ['movies'], queryFn: fetchAllMovies });
};

export const useMovieById = (id?: string) => {
    return useQuery({ queryKey: ['movie', id], queryFn: () => fetchMovieById(id!), enabled: !!id });
};

export const useMovieFilters = () => {
    return useQuery({ queryKey: ['movieFilters'], queryFn: fetchMovieFilters });
};