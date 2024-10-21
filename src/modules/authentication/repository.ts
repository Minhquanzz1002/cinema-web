import { SuccessResponse } from '@/core/repository/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { LoginCredentials, LoginResponse, User } from '@/modules/authentication/interface';
import { useAuth } from '@/hook/useAuth';

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
        queryKey: ['profile'],
        queryFn: getUser,
        ...options,
        retry: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,
    });
};