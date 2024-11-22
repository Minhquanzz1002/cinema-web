import React from 'react';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { formatDateToLocalDate, formatTime, getDayOfWeek } from '@/utils/formatDate';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { groupBy, map, sumBy } from 'lodash';
import { AdminMovie } from '@/modules/movies/interface';
import { AdminShowTimeForSale, Seat } from '@/modules/showTimes/interface';
import { SelectedProduct, useSaleContext } from '@/context/SaleContext';
import { NOT_FOUND_MOVIE_IMAGE } from '@/variables/images';
import CountdownTimer from '@/components/Admin/CountdownTimer';
import CustomerSearch from '@/components/Admin/BookingDetails/CustomerSearch';
import { IoClose } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';

interface GroupedSeat {
    type: SeatType;
    count: number;
    price: number;
    seats: string[];
}

interface BookingDetailsProps {
    movie: AdminMovie;
    showTime: AdminShowTimeForSale;
    selectedSeats: Seat[];
    selectedProducts: SelectedProduct[];
    footer?: React.ReactNode;
}

const BookingDetails = ({
                            movie,
                            showTime,
                            selectedSeats,
                            selectedProducts,
                            footer,
                        }: BookingDetailsProps) => {
    const { customer, totalDiscount, order, handleOrderExpired, handleClearCustomer } = useSaleContext();

    const groupedSeats: GroupedSeat[] = map(
        groupBy(selectedSeats, 'type'),
        (seats, type) => ({
            type: type as SeatType,
            count: seats.length,
            price: seats[0]?.price || 0,
            seats: map(seats, 'fullName'),
        }),
    );

    const totalSeatAmount = sumBy(groupedSeats, group => group.count * group.price);

    const totalProductAmount = sumBy(selectedProducts,
        product => product.quantity * product.product.price!,
    );

    const finalAmount = totalSeatAmount + totalProductAmount;

    return (
        <div className="flex-1 bg-white rounded-lg p-3">
            <Typography.Title level={4}>
                <div className="flex justify-between items-center">
                    Chi tiết đặt vé {order?.orderDate &&
                    <CountdownTimer orderDate={order.orderDate} onExpired={handleOrderExpired} />
                }
                </div>
            </Typography.Title>
            {
                customer ? (
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-2 items-center">
                            <FaRegUser size={18} />
                            <div>{customer.name} - {customer.phone}</div>
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                type="button" className="text-brand-500 hover:bg-gray-100 p-1 rounded-full"
                                onClick={handleClearCustomer}
                            >
                                <IoClose />
                            </button>
                        </div>
                    </div>
                ) : <CustomerSearch />
            }
            <div className="my-2 border-t border-dashed border-black/50" />
            <div className="flex gap-2">
                <div className="relative w-20 h-28">
                    <Image
                        src={movie.imagePortrait || NOT_FOUND_MOVIE_IMAGE}
                        alt={`Ảnh của phim ${movie.title}`} fill
                        className="object-cover"
                    />

                </div>
                <div>
                    <div className="font-medium text-lg">
                        <div>{movie.title}</div>
                        <span className="px-2 py-1 bg-brand-500 text-white rounded text-sm">
                            {movie.ageRating}
                        </span>
                    </div>
                    <div className="font-thin">
                        <div><strong>{showTime.cinema.name}</strong> - {showTime.room.name}</div>
                        <div>Suất: <strong>{formatTime(showTime.startTime)}</strong> - {getDayOfWeek(showTime.startDate)}, <strong>{formatDateToLocalDate(showTime.startDate)}</strong>
                        </div>
                    </div>
                </div>
            </div>
            {
                selectedSeats.length > 0 && (
                    <div className="my-2 border-t border-dashed border-black/50" />
                )
            }
            <div className="flex flex-col gap-2">
                {
                    groupedSeats.map((group: GroupedSeat, index) => (
                        <div key={`group-seat-${index}`} className="flex justify-between">
                            <div className="font-thin">
                                <div><strong>{group.count}x</strong> {SeatTypeVietnamese[group.type]}</div>
                                <div>
                                    <span>Ghế: </span>
                                    <strong>{group.seats.join(', ')}</strong>
                                </div>
                            </div>
                            <div>
                                <strong className="text-sm">{formatNumberToCurrency(group.count * group.price)}</strong>
                            </div>
                        </div>
                    ))
                }
            </div>

            {
                selectedProducts.length > 0 && (
                    <div className="my-2 border-t border-dashed border-black/50" />
                )
            }

            <div className="flex flex-col gap-2">
                {
                    selectedProducts.map((product) => (
                        <div key={product.product.id} className="flex justify-between py-2">
                            <div>
                                <strong>{product.quantity}x </strong>
                                <span>{product.product.name}</span>
                            </div>
                            <div>
                                <strong
                                    className="text-sm"
                                >{formatNumberToCurrency(product.quantity * product.product.price!)}</strong>
                            </div>
                        </div>
                    ))
                }
            </div>


            <div className="my-2 border-t border-dashed border-black/50" />
            <div className="flex justify-between items-center">
                <strong>Tổng tiền</strong>
                <strong className="text-brand-500">{formatNumberToCurrency(finalAmount)}</strong>
            </div>
            <div className="flex justify-between items-center">
                <strong>Giảm giá</strong>
                <strong className="text-brand-500">{formatNumberToCurrency(totalDiscount)}</strong>
            </div>
            {
                order?.promotionLine && (
                    <div className="text-gray-800 text-end">
                        ({order.promotionLine.name})
                    </div>
                )
            }
            <div className="flex justify-between items-center">
                <strong>Thành tiền</strong>
                <strong className="text-brand-500">{formatNumberToCurrency(finalAmount - totalDiscount)}</strong>
            </div>

            {
                footer
            }
        </div>
    );
};

export default BookingDetails;