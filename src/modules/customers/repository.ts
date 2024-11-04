import { SuccessResponse } from '@/core/repository/interface';
import { CustomerWithNameAndPhone } from '@/modules/customers/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';

export const CUSTOMER_QUERY_KEY = 'customers';

/**
 * Fetch all customer with phone
 */

const findAllCustomerWithPhone = (phone: string): Promise<SuccessResponse<CustomerWithNameAndPhone[]>> => {
    return httpRepository.get<CustomerWithNameAndPhone[]>(`/admin/v1/customers/phone/${phone}`);
};

export const useAllCustomerWithPhone = (phone: string) => {
    return useDataFetching(
        [CUSTOMER_QUERY_KEY, phone],
        () => findAllCustomerWithPhone(phone),
        { enabled: !!phone },
    );
};