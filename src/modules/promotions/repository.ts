import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { AdminPromotionOverview } from '@/modules/promotions/interface';

interface FetchAllPromotionParams {
    page?: number;
    code?: string;
    name?: string;
}

const fetchAllPromotions = (params: FetchAllPromotionParams): Promise<SuccessResponse<PageObject<AdminPromotionOverview>>> => {
    return httpRepository.get<PageObject<AdminPromotionOverview>>('/admin/v1/promotions', {
        page: params.page?.toString() || '0',
        code: params.code,
        name: params.name,
    });
};

export const useAllPromotions = (params: FetchAllPromotionParams) => {
    return useQuery({
        queryKey: ['promotions', params],
        queryFn: () => fetchAllPromotions(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });
};
