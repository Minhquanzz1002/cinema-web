import { AdminOrderOverview, RefundStatus } from '@/modules/orders/interface';

export enum RefundMethod {
    CASH = 'CASH',
}

export const RefundMethodVietnamese: Record<RefundMethod, string> = {
    [RefundMethod.CASH]: 'Tiền mặt',
};

export interface AdminRefundOverview {
    id: string;
    code: string;
    reason: string;
    amount: number;
    status: RefundStatus;
    refundMethod: RefundMethod;
    refundDate?: Date;
    order: {
        code: string;
    }
}

export interface AdminRefundDetail {
    id: string;
    code: string;
    reason: string;
    amount: number;
    status: RefundStatus;
    refundMethod: RefundMethod;
    refundDate?: Date;
    order: AdminOrderOverview;
}