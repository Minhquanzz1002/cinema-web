import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { DailyReport } from '@/modules/reports/interface';

export const DAILY_REPORT_QUERY_KEY = 'daily-report';

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