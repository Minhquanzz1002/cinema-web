import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    AdminTicketPriceLineOverview,
    AdminTicketPriceOverview,
    ApplyForDay,
} from '@/modules/ticketPrices/interface';
import { toast } from 'react-toastify';
import { BaseStatus } from '@/modules/base/interface';

export const TICKET_PRICES_QUERY_KEY = 'ticketPrices';

/**
 * Get all ticket prices
 */
interface FetchAllTicketPriceParams {
    page?: number;
    name?: string;
    startDate?: string;
    endDate?: string;
    status?: BaseStatus;
}

const fetchAllTicketPrices = (params: FetchAllTicketPriceParams): Promise<SuccessResponse<PageObject<AdminTicketPriceOverview>>> => {
    return httpRepository.get<PageObject<AdminTicketPriceOverview>>('/admin/v1/ticket-prices', {
        page: params.page?.toString() || '0',
        name: params.name,
        startDate: params.startDate,
        endDate: params.endDate,
        status: params.status,
    });
};

export const useAllTicketPrices = (params: FetchAllTicketPriceParams) => {
    return useQuery({
        queryKey: [TICKET_PRICES_QUERY_KEY, params],
        queryFn: () => fetchAllTicketPrices(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });
};

/**
 * Create ticket price
 */

interface CreateTicketPriceParams {
    name: string;
    startDate: string;
    endDate: string;
    status: BaseStatus;
}

const createTicketPrice = (data: CreateTicketPriceParams): Promise<SuccessResponse<AdminTicketPriceOverview>> => {
    return httpRepository.post<AdminTicketPriceOverview, CreateTicketPriceParams>('/admin/v1/ticket-prices', data);
};

export const useCreateTicketPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTicketPrice,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message);
            console.error('Create ticket price error:', error);
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
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Đã có lỗi xảy ra. Hãy thử lại sau');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Delete ticket price
 */

const deleteTicketPrice = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/ticket-prices/${id}`);
};

export const useDeleteTicketPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTicketPrice,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error('Xóa khuyến mãi không thành công');
            console.error('Delete ticket price error:', error);
        },
    });
};

/**
 * Create ticket price line
 */

interface CreateTicketPriceLineParams {
    applyForDays: ApplyForDay[];
    startTime: string;
    endTime: string;
    status: BaseStatus;
    normalPrice: number;
    vipPrice: number;
    couplePrice: number;
    triplePrice: number;
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
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Đã có lỗi xảy ra. Hãy thử lại sau');
            console.error('Create ticket price line error:', error);
        },
    });
};


/**
 * Update ticket price line
 */

interface UpdateTicketPriceLinePayload {
    applyForDays: ApplyForDay[];
    startTime: string;
    endTime: string;
    status: BaseStatus;
    normalPrice: number;
    vipPrice: number;
    couplePrice: number;
    triplePrice: number;
}

const updateTicketPriceLine = ({ ticketPriceId, ticketPriceLineId, data }: {
    ticketPriceId: number,
    ticketPriceLineId: number,
    data: UpdateTicketPriceLinePayload
}): Promise<SuccessResponse<AdminTicketPriceLineOverview>> => {
    return httpRepository.put<AdminTicketPriceLineOverview, UpdateTicketPriceLinePayload>(`/admin/v1/ticket-prices/${ticketPriceId}/lines/${ticketPriceLineId}`, data);
};

export const useUpdateTicketPriceLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTicketPriceLine,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Có lỗi xảy ra. Hãy thử lại sau');
            console.error('Update ticket price line error:', error);
        },
    });
};

/**
 * Delete ticket price line
 */

const deleteTicketPriceLine = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/ticket-price-lines/${id}`);
};

export const useDeleteTicketPriceLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTicketPriceLine,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Xóa không thành công. Hãy thử lại sau');
            console.error('Delete ticket price error:', error);
        },
    });
};