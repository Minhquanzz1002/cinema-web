import { OrderStatus, SeatType } from '@/modules/orders/interface';
import { BaseStatus } from '@/modules/base/interface';

/**
 * Base
 */
const baseStatusLabels: Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'Hoạt động',
    [BaseStatus.INACTIVE]: 'Không hoạt động',
};

/**
 * Order
 */

const orderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Đang xử lý',
    [OrderStatus.PAID]: 'Đã thanh toán',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
};


/**
 * Seat
 */
const seatTypeLabels: Record<SeatType, string> = {
    [SeatType.NORMAL]: 'Ghế thường',
    [SeatType.VIP]: 'VIP',
    [SeatType.COUPLE]: 'Ghế đôi',
    [SeatType.TRIPLE]: 'Ghế ba',
};

export {
    orderStatusLabels,
    seatTypeLabels,
    baseStatusLabels,
};