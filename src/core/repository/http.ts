import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import CONFIG from '@/config';
import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';

export const axiosClient: AxiosInstance = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let accessToken : string | null = null;

export const setAccessTokenForAxios = (token: string | null) => {
    accessToken = token;
};

axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

class HTTPRepository {
    private handleSuccess<T>(response: AxiosResponse<SuccessResponse<T>>): SuccessResponse<T> {
        console.log(response.data);
        return response.data;
    };

    private handleError(error: AxiosError<ErrorResponse>): never {
        console.log('API Error:', error.response?.data || error.message);
        throw error.response?.data;
    };

    private createSearchParams(params: Record<string, unknown>): URLSearchParams {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => item != null && searchParams.append(key, String(item)));
            } else if (value != null) {
                searchParams.append(key, String(value));
            }
        });
        console.log('searchParams: ', searchParams.toString());
        return searchParams;
    }

    private async request<T>(config: AxiosRequestConfig): Promise<SuccessResponse<T>> {
        try {
            const response = await axiosClient.request<SuccessResponse<T>>(config);
            return this.handleSuccess(response);
        } catch (error) {
            return this.handleError(error as AxiosError<ErrorResponse>);
        }
    };

    async get<T>(path: string, params?: Record<string, unknown>): Promise<SuccessResponse<T>> {
        console.log('params 2',params);
        return this.request<T>({
            method: 'GET',
            url: path,
            params: params ? this.createSearchParams(params) : undefined,
        });
    };

    async post<T, D = any>(path: string, data?: D): Promise<SuccessResponse<T>> {
        return this.request<T>({
            method: 'POST',
            url: path,
            data,
        });
    };

    async put<T, D = any>(path: string, data?: D): Promise<SuccessResponse<T>> {
        return this.request<T>({
            method: 'PUT',
            url: path,
            data,
        });
    }

    async delete<T>(path: string, params?: Record<string, unknown>): Promise<SuccessResponse<T>> {
        return this.request<T>({
            method: 'DELETE',
            url: path,
            params: params ? this.createSearchParams(params) : undefined,
        });
    }
}

const httpRepository = new HTTPRepository();

export default httpRepository;