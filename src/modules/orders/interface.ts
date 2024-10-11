import { BaseEntity } from '@/modules/base/interface';
import { BaseProduct } from '@/modules/products/interface';

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    COMPLETED = 'COMPLETED',
}

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
    user: UserInOrder;
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

export interface AdminOrderOverview {
    id: string;
    code: string;
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
    orderDate: Date;
    status: OrderStatus;
    orderDetails: OrderDetail[];
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
            age: number;
            duration: number;
        }
    },
    user: {
        name: string;
        id: string;
        phone?: string;
        email: string;
    };
}