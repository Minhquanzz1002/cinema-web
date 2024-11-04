import { BaseStatus } from '@/modules/base/interface';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { AdminProductPriceOverview } from '@/modules/productPrices/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';

export const PRODUCT_PRICE_QUERY_KEY = 'product-prices';

/**
 * Fetch all product price
 */
interface FetchAllProductPriceParams {
    page?: number;
    search?: string;
    status?: BaseStatus;
    startDate?: string;
    endDate?: string;
}

const findAllProductPrices = (params: FetchAllProductPriceParams): Promise<SuccessResponse<PageObject<AdminProductPriceOverview>>> => {
    return httpRepository.get<PageObject<AdminProductPriceOverview>>(`/admin/v1/product-prices`, {
        ...params
    });
};

export const useAllProductPrices = (params: FetchAllProductPriceParams) => {
    return useQuery({
        queryKey: [PRODUCT_PRICE_QUERY_KEY, params],
        queryFn: () => findAllProductPrices(params),
    });
};