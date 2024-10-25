import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { AdminOrderOverview, BaseOrder, OrderStatus } from '@/modules/orders/interface';

export const ORDER_QUERY_KEY = 'orders';

/**
 * Get all orders
 */
interface FetchAllOrdersParams {
    page?: number;
    status?: OrderStatus;
    code?: string;
}

const findAllOrders = (params: FetchAllOrdersParams): Promise<SuccessResponse<PageObject<BaseOrder>>> => {
    return httpRepository.get<PageObject<BaseOrder>>('/admin/v1/orders', {
        page: params.page?.toString() || '0',
        status: params.status,
        code: params.code,
    });
};

export const useAllOrders = (params: FetchAllOrdersParams) => {
    return useQuery({ queryKey: [ORDER_QUERY_KEY, params], queryFn: () => findAllOrders(params) });
};

/**
 * Find order by code
 */
const findOrderByCode = (code: string): Promise<SuccessResponse<AdminOrderOverview>> => {
    return httpRepository.get<AdminOrderOverview>(`/admin/v1/orders/${code}`);
};

export const useOrderDetail = (code: string) => {
    return useQuery({ queryKey: ['orders', code], queryFn: () => findOrderByCode(code), enabled: !!code });
};