import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { Director } from '@/modules/directors/interface';
import { BaseStatus } from '@/modules/base/interface';

const DIRECTOR_QUERY_KEY = 'directors';

/**
 * Fetch all directors
 */
interface FetchAllDirectorParams {
    page?: number;
    search?: string;
    country?: string;
    status?: BaseStatus;
}

const fetchAllDirectors = (params: FetchAllDirectorParams): Promise<SuccessResponse<PageObject<Director>>> => {
    return httpRepository.get<PageObject<Director>>('/admin/v1/directors', {
        page: params.page?.toString() || '0',
        search: params.search,
        country: params.country,
        status: params.status,
    });
};

export const useAllDirectors = (params: FetchAllDirectorParams) => {
    return useQuery({ queryKey: [DIRECTOR_QUERY_KEY, params], queryFn: () => fetchAllDirectors(params) });
};