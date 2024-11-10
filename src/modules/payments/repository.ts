/**
 * create order zalopay
 */
import { CreateOrderZaloPayResponse, GetOrderZaloPayResponse, OrderZaloPayStatus } from '@/modules/payments/interface';
import httpRepository from '@/core/repository/http';
import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const PAYMENT_QUERY_KEY = 'payments';


/**
 * Create order zalopay
 */
interface CreateOrderZaloPayPayload {
    orderId: string;
}

const createOrderZaloPay = (body: CreateOrderZaloPayPayload): Promise<SuccessResponse<CreateOrderZaloPayResponse>> => {
    return httpRepository.post<CreateOrderZaloPayResponse, CreateOrderZaloPayPayload>(`/admin/v1/payments/zalo-pay`, body);
};

export const useCreateOrderZaloPay = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrderZaloPay,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PAYMENT_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Tạo đơn hàng không thành công. Hãy thử lại');
            console.error('Create order zalopay error:', error);
        },
    });
};

/**
 * get status order zalopay
 */
const getOrderZaloPay = (appTransId: string): Promise<SuccessResponse<GetOrderZaloPayResponse>> => {
    return httpRepository.get<GetOrderZaloPayResponse>(`/admin/v1/payments/zalo-pay`, {
        transId: appTransId,
    });
};

export const useGetOrderZaloPay = (appTransId: string) => {
    return useQuery({
        queryKey: ['zalopay-order', appTransId],
        queryFn: () => getOrderZaloPay(appTransId),
        refetchInterval: (query) => {
            const status = query.state.data?.data?.status;
            if (status === OrderZaloPayStatus.SUCCESS || status === OrderZaloPayStatus.FAILED) {
                return false;
            }
            return 7000;
        },
        enabled: !!appTransId,
        refetchIntervalInBackground: false,
        select: (data) => data.data,
    });
};
