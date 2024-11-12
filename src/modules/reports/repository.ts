import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { DailyReport, PromotionSummaryReport } from '@/modules/reports/interface';

export const DAILY_REPORT_QUERY_KEY = 'daily-report';
export const PROMOTION_SUMMARY_REPORT_QUERY_KEY = 'promotion-summary-report';

/**
 * Fetch daily report
 */
interface DailyReportParams {
    fromDate?: string;
    toDate?: string;
}

const fetchDailyReport = (params: DailyReportParams): Promise<SuccessResponse<DailyReport[]>> => {
    return httpRepository.get(`/admin/v1/reports/daily`, { ...params });
};

export const useDailyReport = (params: DailyReportParams) => {
    return useDataFetching(
        [DAILY_REPORT_QUERY_KEY, params],
        () => fetchDailyReport(params),
    );
};

/**
 * Fetch promotion report
 */
interface PromotionSummaryReportParams {
    fromDate?: string;
    toDate?: string;
}

const fetchPromotionSummaryReport = (params: PromotionSummaryReportParams): Promise<SuccessResponse<PromotionSummaryReport[]>> => {
    return httpRepository.get<PromotionSummaryReport[]>(`/admin/v1/reports/promotion`, { ...params });
};

export const usePromotionSummaryReport = (params: PromotionSummaryReportParams) => {
    return useDataFetching(
        [PROMOTION_SUMMARY_REPORT_QUERY_KEY, params],
        () => fetchPromotionSummaryReport(params),
    );
};