import React, { useRef, useState } from 'react';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { formatDateToLocalDate, formatTime, getDayOfWeek } from '@/utils/formatDate';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { groupBy, map, sumBy } from 'lodash';
import { AdminMovie } from '@/modules/movies/interface';
import { AdminShowTimeForSale, Seat } from '@/modules/showTimes/interface';
import { SelectedProduct, useSaleContext } from '@/context/SaleContext';
import Input from '@/components/Admin/Input';
import { Form, Formik } from 'formik';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { useAllCustomerWithPhone } from '@/modules/customers/repository';
import useClickOutside from '@/hook/useClickOutside';
import { NOT_FOUND_MOVIE_IMAGE } from '@/variables/images';

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
    const [phone, setPhone] = useState('');
    const { data: customers } = useAllCustomerWithPhone(phone);
    const { customer, setCustomer, totalDiscount } = useSaleContext();
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setPhone(''));

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

    const onSubmit = (values: { phone: string }) => {
        console.log(values);
        setPhone(values.phone);
    };

    return (
        <div className="flex-1 bg-white rounded-lg p-3">
            <Typography.Title level={4}>Chi tiết đặt vé</Typography.Title>
            <Formik initialValues={{ phone }} onSubmit={onSubmit} enableReinitialize>
                <Form>
                    <div className="flex gap-3 items-center">
                        <label className="mb-3" htmlFor="customer">Khách hàng:</label>
                        <div className="flex-1 relative">
                            <Input name="phone" id="customer" placeholder="Nhập số điện thoại" />
                            {
                                phone && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute top-full -mt-2 bg-white rounded shadow-lg border left-0 right-0 z-10">
                                        {
                                            customers && customers.length > 0 ? (
                                                customers.map(customer => (
                                                    <button type="button" key={customer.id}
                                                            className="py-2 px-3 block font-normal hover:bg-gray-100 w-full text-left"
                                                            onClick={() => {
                                                                setCustomer(customer);
                                                                setPhone('');
                                                            }}
                                                    >
                                                    <span
                                                        className="font-medium">{customer.phone}</span> - {customer.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="py-2 px-3">Không tìm thấy</div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <AutoSubmitForm />
                </Form>
            </Formik>
            <div>
                Đang chọn: {customer ? `${customer.phone} - ${customer.name}` : 'Khách vãng lai'}
            </div>
            <div className="my-2 border-t border-dashed border-black/50" />
            <div className="flex gap-2">
                <div className="relative w-20 h-28">
                    <Image src={movie.imagePortrait || NOT_FOUND_MOVIE_IMAGE} alt={`Ảnh của phim ${movie.title}`} fill
                           className="object-cover" />
                </div>
                <div>
                    <div className="font-medium text-lg">{movie.title}</div>
                    <div>
                                <span className="px-2 py-1 bg-brand-500 text-white rounded text-sm">
                                    {movie.ageRating}
                                </span>
                    </div>
                </div>
            </div>
            <div className="font-thin mt-5">
                <div><strong>{showTime.cinema.name}</strong> - {showTime.room.name}</div>
                <div>Suất: <strong>{formatTime(showTime.startTime)}</strong> - {getDayOfWeek(showTime.startDate)}, <strong>{formatDateToLocalDate(showTime.startDate)}</strong>
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
                                    className="text-sm">{formatNumberToCurrency(product.quantity * product.product.price!)}</strong>
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