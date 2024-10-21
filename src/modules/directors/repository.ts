import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { Director } from '@/modules/directors/interface';

const fetchAllDirectors = (): Promise<SuccessResponse<PageObject<Director>>> => {
    return httpRepository.get<PageObject<Director>>('/admin/v1/directors');
};

export const useAllDirectors = () => {
    return useQuery({ queryKey: ['directors'], queryFn: fetchAllDirectors });
};