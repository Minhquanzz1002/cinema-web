import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminPromotionLineOverview, AdminPromotionOverview, PromotionLineType } from '@/modules/promotions/interface';
import useDataFetching from '@/hook/useDataFetching';
import { BaseStatus } from '@/modules/base/interface';
import { toast } from 'react-toastify';
import { SeatType } from '@/modules/seats/interface';

export const PROMOTION_QUERY_KEY = 'promotions';

/**
 * Fetch all promotions
 */

interface FetchAllPromotionParams {
    page?: number;
    search?: string;
    status?: BaseStatus;
    startDate?: string;
    endDate?: string;
}

const fetchAllPromotions = (params: FetchAllPromotionParams): Promise<SuccessResponse<PageObject<AdminPromotionOverview>>> => {
    return httpRepository.get<PageObject<AdminPromotionOverview>>('/admin/v1/promotions', {
        page: params.page?.toString() || '0',
        search: params.search,
        status: params.status,
        startDate: params.startDate,
        endDate: params.endDate,
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

/**
 * Fetch promotion by code
 * @param code promotion code
 */

const findPromotionByCode = (code: string): Promise<SuccessResponse<AdminPromotionOverview>> => {
    return httpRepository.get<AdminPromotionOverview>(`/admin/v1/promotions/${code}`);
};

export const usePromotionByCode = (code: string) => {
    return useDataFetching(
        [PROMOTION_QUERY_KEY, code],
        () => findPromotionByCode(code),
        { enabled: !!code },
    );
};

/**
 * Create promotion
 */

interface CreatePromotionPayload {
    code?: string;
    name: string;
    status: BaseStatus;
    startDate: string;
    endDate: string;
}

const createPromotion = (data: CreatePromotionPayload): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreatePromotionPayload>('/admin/v1/promotions', data);
};

export const useCreatePromotion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPromotion,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Thêm khuyến mãi không thành công');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Delete promotion
 */
const deletePromotion = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/promotions/${id}`);
};

export const useDeletePromotion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePromotion,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Xóa khuyến mãi thất bại');
            console.error('Delete promotion error:', error);
        },
    });
};

/**
 * Update promotion
 */
interface UpdatePromotionPayload {
    name: string;
    status: BaseStatus;
    startDate: string;
    endDate: string;
}

const updatePromotion = ({ id, payload }: {
    id: number,
    payload: UpdatePromotionPayload
}): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, UpdatePromotionPayload>(`/admin/v1/promotions/${id}`, payload);
};

export const useUpdatePromotion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePromotion,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Cập nhật khuyến mãi thất bại. Hãy thử lại sau');
            console.error('Update promotion error:', error);
        },
    });
};

/**
 * Fetch all promotion lines
 */
interface FetchAllPromotionLinesParams {
    id?: number;
    page?: number;
    status?: BaseStatus;
}

const findAllPromotionLines = ({
                                   id,
                                   page = 0,
                                   status,
                               }: FetchAllPromotionLinesParams): Promise<SuccessResponse<PageObject<AdminPromotionLineOverview>>> => {
    return httpRepository.get<PageObject<AdminPromotionLineOverview>>(`/admin/v1/promotions/${id}/lines`, {
        page,
        status,
    });
};

export const useAllPromotionLines = (params: FetchAllPromotionLinesParams) => {
    return useQuery({
        queryKey: [PROMOTION_QUERY_KEY, params],
        queryFn: () => findAllPromotionLines(params),
        enabled: !!params.id,
    });
};

/**
 * Create promotion line
 */

interface CreatePromotionLinePayload {
    code?: string;
    name: string;
    type: PromotionLineType;
    status: BaseStatus;
    startDate: string;
    endDate: string;
    promotionDetails: Array<{
        discountValue?: number;
        minOrderValue?: number;
        usageLimit?: number;
        maxDiscountValue?: number;
        requiredSeatType?: SeatType;
        requiredSeatQuantity?: number;
        giftSeatType?: SeatType;
        giftSeatQuantity?: number;
        giftProduct?: number;
        giftQuantity?: number;
    }>;
}

const createPromotionLine = ({ promotionId, payload }: {
    payload: CreatePromotionLinePayload,
    promotionId: number
}): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreatePromotionLinePayload>(`/admin/v1/promotions/${promotionId}/lines`, payload);
};

export const useCreatePromotionLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPromotionLine,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Thêm chương trình khuyến mãi không thành công');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Fetch promotion line by code
 * @param code
 */
const findPromotionLineByCode = (code: string): Promise<SuccessResponse<AdminPromotionLineOverview>> => {
    return httpRepository.get<AdminPromotionLineOverview>(`/admin/v1/promotion-lines/${code}`);
};

export const usePromotionLineByCode = (code: string) => {
    return useDataFetching(
        [PROMOTION_QUERY_KEY, code],
        () => findPromotionLineByCode(code),
        { enabled: !!code },
    );
};


/**
 * Create promotion detail
 */

interface CreatePromotionDetailPayload {
    discountValue?: number;
    minOrderValue?: number;
    usageLimit?: number;
    maxDiscountValue?: number;
    requiredSeatType?: SeatType;
    requiredSeatQuantity?: number;
    giftSeatType?: SeatType;
    giftSeatQuantity?: number;
    giftProduct?: number;
    giftQuantity?: number;
}

const createPromotionDetail = ({ promotionLineId, payload }: {
    payload: CreatePromotionDetailPayload,
    promotionLineId: number
}): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreatePromotionDetailPayload>(`/admin/v1/promotion-lines/${promotionLineId}/details`, payload);
};

export const useCreatePromotionDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPromotionDetail,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: error => {
            toast.error('Thêm chi tiết khuyến mãi không thành công');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Update promotion detail
 */

interface UpdatePromotionDetailPayload {
    discountValue?: number;
    minOrderValue?: number;
    usageLimit?: number;
    maxDiscountValue?: number;
    requiredSeatType?: SeatType;
    requiredSeatQuantity?: number;
    giftSeatType?: SeatType;
    giftSeatQuantity?: number;
    giftProduct?: number;
    giftQuantity?: number;
}

const updatePromotionDetail = ({id, payload} : {id: number; payload: UpdatePromotionDetailPayload} ): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, CreatePromotionDetailPayload>(`/admin/v1/promotion-details/${id}`, payload);
};

export const useUpdatePromotionDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePromotionDetail,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Cập nhật chi tiết khuyến mãi không thành công');
            console.error('Create ticket price line error:', error);
        },
    });
};

/**
 * Delete promotion line
 */
const deletePromotionLine = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/promotion-lines/${id}`);
};

export const useDeletePromotionLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePromotionLine,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Xóa khuyến mãi không thành công. Hãy thử lại sau');
            console.error('Delete promotion error:', error);
        },
    });
};

/**
 * Update promotion
 */
interface UpdatePromotionLinePayload {
    name: string;
    status: BaseStatus;
    startDate: string;
    endDate: string;
}

const updatePromotionLine = ({ id, payload }: {
    id: number,
    payload: UpdatePromotionLinePayload
}): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, UpdatePromotionLinePayload>(`/admin/v1/promotion-lines/${id}`, payload);
};

export const useUpdatePromotionLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePromotionLine,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Cập nhật chương trình khuyến mãi không thành công. Hãy thử lại sau');
            console.error('Update promotion error:', error);
        },
    });
};

/**
 * Delete promotion detail
 */
const deletePromotionDetail = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/promotion-details/${id}`);
};

export const useDeletePromotionDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePromotionDetail,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Xóa chi tiết khuyến mãi không thành công. Hãy thử lại sau');
            console.error('Delete promotion error:', error);
        },
    });
};