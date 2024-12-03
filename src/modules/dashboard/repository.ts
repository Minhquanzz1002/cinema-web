import { SuccessResponse } from '@/core/repository/interface';
import { MovieRevenue, Stats } from '@/modules/dashboard/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';


export const DASHBOARD_QUERY_KEY = 'dashboard';

/**
 * Get stats
 */
const fetchDashboardStats = (): Promise<SuccessResponse<Stats>> => {
    return httpRepository.get<Stats>(`/admin/v1/dashboard/stats`);
};

export const useDashboardStats = () => {
    return useDataFetching(
        [DASHBOARD_QUERY_KEY, 'stats'],
        () => fetchDashboardStats(),
    );
};

/**
 * Get movie revenue
 */
interface FetchDashboardMovieRevenueParams {
    startDate: string;
    endDate: string;
}

const fetchDashboardMovieRevenue = (params: FetchDashboardMovieRevenueParams): Promise<SuccessResponse<MovieRevenue[]>> => {
    return httpRepository.get<MovieRevenue[]>(`/admin/v1/dashboard/movie-revenue`, {...params});
};

export const useDashboardMovieRevenue = (params: FetchDashboardMovieRevenueParams) => {
    return useDataFetching(
        [DASHBOARD_QUERY_KEY, 'movie-revenue', params],
        () => fetchDashboardMovieRevenue(params),
    );
};