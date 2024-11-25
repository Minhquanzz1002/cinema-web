import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { LoginCredentials, LoginResponse, User } from '@/modules/authentication/interface';
import { useAuth } from '@/hook/useAuth';
import { toast } from 'react-toastify';
import { API_MESSAGES } from '@/variables/messages';

export const PROFILE_QUERY_KEY = 'profile';

const loginAsync = (credentials: LoginCredentials): Promise<SuccessResponse<LoginResponse>> => {
    return httpRepository.post<LoginResponse, LoginCredentials>('/admin/v1/auth/login', credentials);
};

const getUser = (): Promise<SuccessResponse<User>> => {
    return httpRepository.get<User>('/admin/v1/auth/profile');
};

export const useLogin = () => {
    const { login } = useAuth();
    return useMutation({
        mutationFn: loginAsync,
        onSuccess: (response) => {
            const { data } = response;
            login(data);
        },
    });
};

export const useGetUser = (options?: Omit<UseQueryOptions<SuccessResponse<User>, Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
        queryKey: [PROFILE_QUERY_KEY],
        queryFn: getUser,
        ...options,
        retry: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,
    });
};

/**
 * Update user profile
 */
interface UpdateProfilePayload {
    name: string;
    phone: string;
    birthday: string;
    gender: boolean;
}

const updateProfile = (payload: UpdateProfilePayload): Promise<SuccessResponse<User>> => {
    return httpRepository.put<User, UpdateProfilePayload>(`/admin/v1/auth/profile`, payload);
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { updateUser } = useAuth();
    return useMutation({
        mutationFn: updateProfile,
        mutationKey: [PROFILE_QUERY_KEY, 'update'],
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
            updateUser(res.data);
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || API_MESSAGES.ERROR.UPDATE.PROFILE);
            console.error('Update profile error:', error);
        },
    });
};