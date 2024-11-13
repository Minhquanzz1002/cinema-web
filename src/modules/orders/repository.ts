import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminOrderOverview, OrderOverview, OrderResponseCreated, OrderStatus } from '@/modules/orders/interface';
import { toast } from 'react-toastify';

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

const findAllOrders = (params: FetchAllOrdersParams): Promise<SuccessResponse<PageObject<OrderOverview>>> => {
    return httpRepository.get<PageObject<OrderOverview>>('/admin/v1/orders', {
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

/**
 * Update seats in order by employee
 */
interface UpdateSeatsInOrderData {
    seatIds: number[];
}

const updateSeatInOrderByEmployee = ({ orderId, data }: {
    orderId: string;
    data: UpdateSeatsInOrderData
}): Promise<SuccessResponse<OrderResponseCreated>> => {
    return httpRepository.put<OrderResponseCreated, UpdateSeatsInOrderData>(`/admin/v1/orders/${orderId}/seats`, data);
};

export const useUpdateSeatInOrderByEmployee = () => {
    return useMutation({
        mutationFn: updateSeatInOrderByEmployee,
    });
};

/**
 * Complete order by employee
 */

const completeOrderByEmployee = (orderId: string): Promise<SuccessResponse<OrderResponseCreated>> => {
    return httpRepository.put<OrderResponseCreated, UpdateProductsInOrderData>(`/admin/v1/orders/${orderId}/complete`);
};

export const useCompleteOrderByEmployee = () => {
    return useMutation({
        mutationFn: completeOrderByEmployee,
    });
};

/**
 * Refund order by employee
 */
interface RefundOrderData {
    reason: string;
}

const refundOrder = ({ orderId, data }: {
    orderId: string;
    data: RefundOrderData
}): Promise<SuccessResponse<OrderResponseCreated>> => {
    return httpRepository.put<OrderResponseCreated, RefundOrderData>(`/admin/v1/orders/${orderId}/refund`, data);
};

export const useRefundOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: refundOrder,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Hoàn đơn không thành công. Hãy thử lại sau');
        },
    });
};

/**
 * Cancel order by employee
 */
const cancelOrderByEmployee = (orderId: string): Promise<SuccessResponse<void>> => {
    return httpRepository.delete(`/admin/v1/orders/${orderId}`);
};

export const useCancelOrderByEmployee = () => {
    return useMutation({
        mutationFn: cancelOrderByEmployee,
    });
};