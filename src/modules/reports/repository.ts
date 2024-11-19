import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { EmployeeSalesReport, MovieSalesReport, PromotionSummaryReport } from '@/modules/reports/interface';

export const EMPLOYEE_SALE_REPORT_QUERY_KEY = 'employee-sale-report';
export const MOVIE_SALE_REPORT_QUERY_KEY = 'movie-sale-report';
export const PROMOTION_SUMMARY_REPORT_QUERY_KEY = 'promotion-summary-report';

/**
 * Fetch employee sales report
 */
interface DailyReportParams {
    fromDate?: string;
    toDate?: string;
    search?: string;
}

const fetchEmployeeSalesPerformanceReport = (params: DailyReportParams): Promise<SuccessResponse<EmployeeSalesReport[]>> => {
    return httpRepository.get(`/admin/v1/reports/employee-sales`, { ...params });
};

export const useEmployeeSalesPerformanceReport = (params: DailyReportParams) => {
    return useDataFetching(
        [EMPLOYEE_SALE_REPORT_QUERY_KEY, params],
        () => fetchEmployeeSalesPerformanceReport(params),
    );
};

/**
 * Fetch movie sales report
 */
interface MovieSaleReportParams {
    fromDate?: string;
    toDate?: string;
    search?: string;
}

const fetchMovieSalesPerformanceReport = (params: MovieSaleReportParams): Promise<SuccessResponse<MovieSalesReport[]>> => {
    return httpRepository.get(`/admin/v1/reports/movie-sales`, { ...params });
};

export const useMovieSalesPerformanceReport = (params: MovieSaleReportParams) => {
    return useDataFetching(
        [MOVIE_SALE_REPORT_QUERY_KEY, params],
        () => fetchMovieSalesPerformanceReport(params),
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