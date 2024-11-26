import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { AdminCustomerOverview, CustomerWithNameAndPhone } from '@/modules/customers/interface';
import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { UserStatus } from '@/modules/authentication/interface';
import { PageObject } from '@/core/pagination/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { API_MESSAGES } from '@/variables/messages';

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

/**
 * Fetch all customers
 */
interface FetchAllCustomerParams {
    page?: number;
    search?: string;
    status?: UserStatus;
    phone?: string;
    email?: string;
}

const fetchAllCustomers = (params: FetchAllCustomerParams): Promise<SuccessResponse<PageObject<AdminCustomerOverview>>> => {
    return httpRepository.get<PageObject<AdminCustomerOverview>>('/admin/v1/customers', { ...params });
};

export const useAllCustomers = (params: FetchAllCustomerParams) => {
    return useQuery({ queryKey: [CUSTOMER_QUERY_KEY, params], queryFn: () => fetchAllCustomers(params) });
};

/**
 * Update customer
 */

interface UpdateCustomerData {
    name: string;
    gender: boolean;
    phone: string;
    birthday: string;
    status: UserStatus;
}

const updateCustomer = ({id, data} : {data: UpdateCustomerData; id: string}): Promise<SuccessResponse<void>> => {
    return httpRepository.put<void, UpdateCustomerData>(`/admin/v1/customers/${id}`, data);
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [CUSTOMER_QUERY_KEY, 'update'],
        mutationFn: updateCustomer,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.UPDATE.CUSTOMER);
            console.error('Update customer error:', error);
        },
    });
};

/**
 * Delete customer
 */
const deleteCustomer = (id: string): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/customers/${id}`);
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [CUSTOMER_QUERY_KEY, 'delete'],
        mutationFn: deleteCustomer,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.DELETE.CUSTOMER);
            console.error('Delete customer error:', error);
        },
    });
};