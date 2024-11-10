export interface CreateOrderZaloPayResponse {
    qrUrl: string;
    transId: string;
    orderUrl: string;
}

export interface GetOrderZaloPayResponse {
    status: OrderZaloPayStatus;
    message: string;
    zpTransId: string;
}

export enum OrderZaloPayStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}