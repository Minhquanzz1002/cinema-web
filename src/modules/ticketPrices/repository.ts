import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminTicketPriceLineOverview, AdminTicketPriceOverview, ApplyForDay } from '@/modules/ticketPrices/interface';
import { toast } from 'react-toastify';
import { BaseStatus } from '@/modules/base/interface';

export const TICKET_PRICES_QUERY_KEY = 'ticketPrices';

interface FetchAllTicketPriceParams {
    page?: number;
    name?: string;
}

const fetchAllTicketPrices = (params: FetchAllTicketPriceParams): Promise<SuccessResponse<PageObject<AdminTicketPriceOverview>>> => {
    return httpRepository.get<PageObject<AdminTicketPriceOverview>>('/admin/v1/ticket-prices', {
        page: params.page?.toString() || '0',
        name: params.name,
    });
};

interface CreateTicketPriceParams {
    name: string;
    startDate: string;
    endDate: string;
    status: BaseStatus;
}

const createTicketPrice = (data: CreateTicketPriceParams): Promise<SuccessResponse<AdminTicketPriceOverview>> => {
    return httpRepository.post<AdminTicketPriceOverview, CreateTicketPriceParams>('/admin/v1/ticket-prices', data);
};

interface CreateTicketPriceLineParams {
    applyForDays: ApplyForDay[];
    startTime: string;
    endTime: string;
    status: BaseStatus;
}

const createTicketPriceLine = ({ ticketPriceId, data }: {
    ticketPriceId: number,
    data: CreateTicketPriceLineParams
}): Promise<SuccessResponse<AdminTicketPriceLineOverview>> => {
    return httpRepository.post<AdminTicketPriceLineOverview, CreateTicketPriceLineParams>(`/admin/v1/ticket-prices/${ticketPriceId}/lines`, data);
};

export const useCreateTicketPriceLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTicketPriceLine,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success('Thêm thành công');
        },
        onError: error => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
            console.error('Create ticket price line error:', error);
        }
    });
};

const deleteTicketPrice = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/ticket-prices/${id}`);
};

export const useAllTicketPrices = (params: FetchAllTicketPriceParams) => {
    return useQuery({
        queryKey: [TICKET_PRICES_QUERY_KEY, params],
        queryFn: () => fetchAllTicketPrices(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });
};

export const useCreateTicketPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTicketPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success('Thêm khuyến mãi thành công');
        },
    });
};

export const useDeleteTicketPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTicketPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success('Xóa khuyến mãi thành công');
        },
        onError: (error) => {
            toast.error('Xóa khuyến mãi thất bại');
            console.error('Delete ticket price error:', error);
        },
    });
};

/**
 * Update ticket price
 */

interface UpdateTicketPriceData {
    name: string;
    startDate: string;
    endDate: string;
    status: BaseStatus;
}

const updateTicketPrice = ({ id, data }: {
    id: number,
    data: UpdateTicketPriceData
}): Promise<SuccessResponse<AdminTicketPriceOverview>> => {
    return httpRepository.put<AdminTicketPriceOverview, UpdateTicketPriceData>(`/admin/v1/ticket-prices/${id}`, data);
};

export const useUpdateTicketPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTicketPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success('Cập nhật giá vé thành công');
        },
        onError: (error) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
            console.error('Create ticket price line error:', error);
        },
    });
};
