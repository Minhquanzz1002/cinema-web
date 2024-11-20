import { SuccessResponse } from '@/core/repository/interface';
import { Role } from '@/modules/roles/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';

const ROLE_QUERY_KEY = 'roles';

/**
 * Fetch list roles
 */
const findListRoles = (): Promise<SuccessResponse<Role[]>> => {
    return httpRepository.get<Role[]>('/admin/v1/roles');
};

export const useListRoles = () => {
    return useDataFetching(
        [ROLE_QUERY_KEY],
        findListRoles,
    );
};