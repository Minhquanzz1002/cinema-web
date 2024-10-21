import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { AdminShowTime } from '@/modules/showTimes/interface';

interface Params {
    page?: number;
}

const findAllShowTimes = (params: Params): Promise<SuccessResponse<PageObject<AdminShowTime>>> => {
    return httpRepository.get<PageObject<AdminShowTime>>(`/admin/v1/show-times`, {
        page: params.page?.toString() || '0',
    });
};

export const useAllShowTimes = (params: Params) => {
    return useQuery({
        queryKey: ['showTimes', params],
        queryFn: () => findAllShowTimes(params),
    });
};