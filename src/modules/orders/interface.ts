import { BaseEntity, BaseStatus } from '@/modules/base/interface';
import { BaseProduct } from '@/modules/products/interface';
import { AgeRating } from '@/modules/movies/interface';
import { SeatType } from '@/modules/seats/interface';

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

export interface OrderOverview extends BaseOrder {
    showTime: {
        startTime: string;
        startDate: Date;
        movie: {
            title: string;
        }
    }
    cancelReason?: string;
    refundAmount?: number;
    refundStatus: RefundStatus;
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

export enum PaymentMethod {
    CASH = 'CASH',
    ZALOPAY = 'ZALOPAY',
}

export const PaymentMethodVietnamese: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Tiền mặt',
    [PaymentMethod.ZALOPAY]: 'ZaloPay',
};

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
    paymentMethod: PaymentMethod;
    showTime: {
        id: string;
        cinemaName: string;
        address: string;
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
    showTime: {
        startDate: Date;
        startTime: string;
        endTime: string;
        room: {
            name: string;
        }
        cinema: {
            name: string;
            address: string;
            city: string;
            ward: string;
            district: string;
        }
        movie: {
            title: string;
        }
    }
    promotionLine?: {
        id: number;
        name: string;
        code: string;
    }
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