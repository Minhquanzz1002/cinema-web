interface Response {
    code: number;
    status: string;
    message: string;
}

export interface SuccessResponse<T> extends Response {
    data: T;
}

export interface ErrorResponse extends Response {
    errors: any;
}
