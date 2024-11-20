import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminEmployeeOverview } from '@/modules/employees/interface';
import { toast } from 'react-toastify';
import { UserStatus } from '@/modules/authentication/interface';
import { BaseStatus } from '@/modules/base/interface';
import { API_MESSAGES } from '@/variables/messages';

export const EMPLOYEE_QUERY_KEY = 'employees';

/**
 * Create employee
 */

interface CreateEmployeeData {
    name: string;
    gender: boolean;
    email: string;
    phone: string;
    password: string;
    birthday: string;
    status: BaseStatus;
}

const createEmployee = (data: CreateEmployeeData): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateEmployeeData>('/admin/v1/employees', data);
};

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.CREATE.EMPLOYEE);
            console.error('Create employee error:', error);
        },
    });
};

/**
 * Fetch all employees
 */
interface FetchAllEmployeeParams {
    page?: number;
    search?: string;
    status?: UserStatus;
}

const fetchAllEmployees = (params: FetchAllEmployeeParams): Promise<SuccessResponse<PageObject<AdminEmployeeOverview>>> => {
    return httpRepository.get<PageObject<AdminEmployeeOverview>>('/admin/v1/employees', { ...params });
};

export const useAllEmployees = (params: FetchAllEmployeeParams) => {
    return useQuery({ queryKey: [EMPLOYEE_QUERY_KEY, params], queryFn: () => fetchAllEmployees(params) });
};

/**
 * Delete employee
 */
const deleteEmployee = (id: string): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/employees/${id}`);
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEmployee,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.DELETE.EMPLOYEE);
            console.error('Delete employee error:', error);
        },
    });
};