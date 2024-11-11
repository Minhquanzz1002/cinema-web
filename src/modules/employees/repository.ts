import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminEmployeeOverview } from '@/modules/employees/interface';
import { toast } from 'react-toastify';
import { UserStatus } from '@/modules/authentication/interface';

export const EMPLOYEE_QUERY_KEY = 'employees';

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
            toast.error(error.message || 'Xóa nhân viên không thành công. Hãy thử lại sau');
            console.error('Delete employee error:', error);
        },
    });
};