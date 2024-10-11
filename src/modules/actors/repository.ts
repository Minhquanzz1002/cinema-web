import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { Actor } from '@/modules/actors/interface';
import { useQuery } from '@tanstack/react-query';

const fetchAllActors = (): Promise<SuccessResponse<PageObject<Actor>>> => {
    return httpRepository.execute({ path: '/admin/v1/actors' });
};

export const useAllActors = () => {
    return useQuery({ queryKey: ['actors'], queryFn: fetchAllActors });
};