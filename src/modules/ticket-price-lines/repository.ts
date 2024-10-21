/**
 * Create ticket price detail
 */
import { AdminTicketPriceDetailOverview } from '@/modules/ticketPrices/interface';
import { BaseStatus } from '@/modules/base/interface';
import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { TICKET_PRICES_QUERY_KEY } from '@/modules/ticketPrices/repository';
import { SeatType } from '@/modules/seats/interface';

interface CreateTicketPriceDetailData {
    seatType: SeatType;
    price: number;
    status: BaseStatus;
}

const createTicketPriceDetail = ({ lineId, data }: {
    lineId: number,
    data: CreateTicketPriceDetailData
}): Promise<SuccessResponse<AdminTicketPriceDetailOverview>> => {
    return httpRepository.post<AdminTicketPriceDetailOverview, CreateTicketPriceDetailData>(`/admin/v1/ticket-price-lines/${lineId}/details`, data);
};

export const useCreateTicketPriceDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTicketPriceDetail,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success('Thêm chi tiết giá vé thành công');
        },
        onError: error => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
            console.error('Create ticket price line error:', error);
        }
    });
};