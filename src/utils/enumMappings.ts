import { OrderStatus, SeatType } from '@/modules/orders/interface';
import { BaseStatus } from '@/modules/base/interface';
import { MovieStatus } from '@/modules/movies/interface';

/**
 * Base
 */
const baseStatusLabels: Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'Hoạt động',
    [BaseStatus.INACTIVE]: 'Không hoạt động',
};

/**
 * Product
 */
const movieStatusLabels: Record<MovieStatus, string> = {
    [MovieStatus.ACTIVE]: 'Đang chiếu',
    [MovieStatus.INACTIVE]: 'Ngưng chiếu',
    [MovieStatus.COMING_SOON]: 'Sắp chiếu',
    [MovieStatus.SUSPENDED]: 'Tạm ngưng',
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
    movieStatusLabels,
};