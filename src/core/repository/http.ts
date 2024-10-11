import axios, { AxiosInstance, AxiosResponse } from 'axios';
import CONFIG from '@/config';

export const axiosClient: AxiosInstance = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    return config;
}, (error) => Promise.reject(error));

export interface IParamsHTTP {
    method?: 'get' | 'post' | 'put' | 'delete';
    path: string;
    payload?: any;
    params?: any;
}

class HTTPRepository {
    private handleSuccess<T>(response: AxiosResponse<T>) : T {
        console.log(response.data);
        return response.data;
    }

    private handleError(error: any) {
        return Promise.reject(error);
    }

    async execute<T>({ method = 'get', path, params }: IParamsHTTP): Promise<T> {
        let args: Array<any>;
        switch (method) {
            case 'get':
                if (params) {
                    const paramsData: URLSearchParams = Object.keys(params).reduce((url, key) => {
                        if (Array.isArray(params[key])) {
                            params[key].forEach(element => {
                                if (element != undefined) {
                                    url.append(key, element);
                                }
                            });
                        } else if (params[key] != undefined) {
                            url.append(key, params[key]);
                        }
                        return url;
                    }, new URLSearchParams());
                    args = [
                        path,
                        {
                            params: paramsData,
                        },
                    ];
                } else {
                    args = [path];
                }
                break;
            case 'delete':
                break;
            case 'post':
            case 'put':
                break;
            default:
                break;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return axiosClient[method](...args)
            .then(res => this.handleSuccess(res))
            .catch(err => this.handleError(err));
    };
}

const httpRepository = new HTTPRepository();

export default httpRepository;