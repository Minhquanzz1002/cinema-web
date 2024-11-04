import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminOrderOverview, BaseOrder, OrderResponseCreated, OrderStatus } from '@/modules/orders/interface';

export const ORDER_QUERY_KEY = 'orders';

/**
 * Get all orders
 */
interface FetchAllOrdersParams {
    page?: number;
    status?: OrderStatus;
    code?: string;
    fromDate?: string;
    toDate?: string;
}

const findAllOrders = (params: FetchAllOrdersParams): Promise<SuccessResponse<PageObject<BaseOrder>>> => {
    return httpRepository.get<PageObject<BaseOrder>>('/admin/v1/orders', {
        page: params.page?.toString() || '0',
        status: params.status,
        code: params.code,
        fromDate: params.fromDate,
        toDate: params.toDate,
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

/**
 * Create order by employee
 */
interface CreateOrderByEmployeeData {
    customerId?: string;
    seatIds: number[];
    showTimeId: string;
}

const createOrderByEmployee = (data: CreateOrderByEmployeeData): Promise<SuccessResponse<OrderResponseCreated>> => {
    return httpRepository.post<OrderResponseCreated>('/admin/v1/orders', data);
};

export const useCreateOrderByEmployee = () => {
    return useMutation({
        mutationFn: createOrderByEmployee,
    });
};

/**
 * Update products in order by employee
 */
interface UpdateProductsInOrderData {
    products: {
        id: number;
        quantity: number;
    }[];
}

const updateProductInOrderByEmployee = ({ orderId, data }: {
    orderId: string;
    data: UpdateProductsInOrderData
}): Promise<SuccessResponse<OrderResponseCreated>> => {
    return httpRepository.put<OrderResponseCreated, UpdateProductsInOrderData>(`/admin/v1/orders/${orderId}/products`, data);
};

export const useUpdateProductInOrderByEmployee = () => {
    return useMutation({
        mutationFn: updateProductInOrderByEmployee,
    });
};