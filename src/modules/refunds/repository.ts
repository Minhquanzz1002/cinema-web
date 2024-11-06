import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { AdminRefundDetail, AdminRefundOverview } from '@/modules/refunds/interface';
import useDataFetching from '@/hook/useDataFetching';

export const REFUND_QUERY_KEY = 'refunds';

/**
 * Get all refunds
 */
interface FetchAllRefundParams {
    page?: number;
    refundCode?: string;
    orderCode?: string;
}

const findAllRefunds = (params: FetchAllRefundParams): Promise<SuccessResponse<PageObject<AdminRefundOverview>>> => {
    return httpRepository.get<PageObject<AdminRefundOverview>>('/admin/v1/refunds', { ...params });
};

export const useAllRefunds = (params: FetchAllRefundParams) => {
    return useQuery({ queryKey: [REFUND_QUERY_KEY, params], queryFn: () => findAllRefunds(params) });
};

/**
 * Find refund by code
 */
const findRefundByCode = (code: string): Promise<SuccessResponse<AdminRefundDetail>> => {
    return httpRepository.get<AdminRefundDetail>(`/admin/v1/refunds/${code}`);
};

export const useRefundDetail = (code: string) => {
    return useDataFetching(
        [REFUND_QUERY_KEY, code],
        () => findRefundByCode(code),
        { enabled: !!code },
    );
};