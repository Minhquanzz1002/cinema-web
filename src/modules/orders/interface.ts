import { BaseEntity, BaseStatus } from '@/modules/base/interface';
import { BaseProduct } from '@/modules/products/interface';
import { AgeRating } from '@/modules/movies/interface';

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export const OrderStatusVietnamese = {
    [OrderStatus.PENDING]: 'Chờ xử lý',
    [OrderStatus.PAID]: 'Đã thanh toán',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
    [OrderStatus.CANCELLED]: 'Đã hủy',
};

export enum SeatType {
    NORMAL = 'NORMAL',
    VIP = 'VIP',
    COUPLE = 'COUPLE',
    TRIPLE = 'TRIPLE',
}

interface UserInOrder {
    id: string;
    name: string;
    email: string;
    phone: string;
}

/**
 * Order interface with base properties
 */
export interface BaseOrder extends BaseEntity {
    id: string;
    code: string;
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
    orderDate: Date;
    status: OrderStatus;
    user?: UserInOrder;
}

interface OrderDetail {
    type: 'PRODUCT' | 'TICKET';
    quantity: number;
    price: number;
    seat?: {
        name: string;
        type: SeatType;
    };
    product?: BaseProduct;
    isGift: boolean;
}

export enum RefundStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
}

export const RefundStatusVietnamese: Record<RefundStatus, string> = {
    [RefundStatus.PENDING]: 'Chờ xử lý',
    [RefundStatus.COMPLETED]: 'Hoàn thành',
};

export interface AdminOrderOverview {
    id: string;
    code: string;
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
    orderDate: Date;
    status: OrderStatus;
    orderDetails: OrderDetail[];
    cancelReason: string;
    refundAmount: number;
    refundDate: Date;
    refundStatus: RefundStatus;
    showTime: {
        id: string;
        cinemaName: string;
        roomName: string;
        startTime: string;
        endTime: string;
        startDate: Date;
        movie: {
            id: string;
            title: string;
            slug: string;
            imagePortrait: string;
            ageRating: AgeRating;
            duration: number;
        }
    },
    user?: {
        name: string;
        id: string;
        phone?: string;
        email: string;
    };
}

/**
 * Order created by employee
 */
export interface OrderResponseCreated {
    id: string;
    code: string;
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
    orderDate: Date;
    status: OrderStatus;
    orderDetails: OrderDetailInOrderCreated[]
}

export interface OrderDetailInOrderCreated {
    type: 'PRODUCT' | 'TICKET';
    quantity: number;
    price: number;
    seat?: {
        id: number;
        name: string;
        fullName: string;
        type: SeatType;
        area: number;
        columnIndex: number;
        rowIndex: number;
        status: BaseStatus;
    };
    product?: BaseProduct;
    isGift: boolean;
}