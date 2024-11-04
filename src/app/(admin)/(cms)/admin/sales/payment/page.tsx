'use client';

import React, { useEffect } from 'react';
import { useSaleContext } from '@/context/SaleContext';
import Typography from '@/components/Admin/Typography';
import NotFound from '@/components/Admin/NotFound';
import { useLayoutSeatByShowTimeId } from '@/modules/showTimes/repository';
import Loader from '@/components/Admin/Loader';
import BookingDetails from '@/components/Admin/BookingDetails';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AdminPaymentPage = () => {
    const router = useRouter();
    const { movie, showTime, selectedSeats, selectedProducts } = useSaleContext();
    const { data: layout, isLoading: isLoadingSeat } = useLayoutSeatByShowTimeId(showTime?.id || '');

    useEffect(() => {
        document.title = 'B&Q Cinema - Thanh toán';
    }, []);

    if (isLoadingSeat) {
        return <Loader />;
    }

    if (!movie || !showTime || !layout) {
        return <NotFound />;
    }

    return (
        <div className="mt-5">
            <div className="flex gap-2">
                <div className="w-4/6 bg-white rounded-lg p-3">
                    <Typography.Title level={4}>Phương thức thanh toán</Typography.Title>
                    <div className="min-h-[700px]">
                        <div className="flex flex-col gap-3">
                            <label className=" flex items-center gap-2">
                                <input type="radio" name="paymentMethod" className="!max-w-5 min-w-5 h-4 w-4" />
                                <div className="relative w-12 h-12">
                                    <Image src="/img/payment/zalopay.png" alt="Thanh toán ZaloPay" layout="fill"
                                           objectFit="contain" />
                                </div>
                                <div>Zalopay</div>
                            </label>
                            <label className=" flex items-center gap-2">
                                <input type="radio" name="paymentMethod" className="!max-w-5 min-w-5 h-4 w-4" />
                                <div className="relative w-12 h-12">
                                    <Image src="/img/payment/vnpay.png" alt="Thanh toán VNPAY" layout="fill"
                                           objectFit="contain" />
                                </div>
                                <div>VNPAY</div>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="paymentMethod" className="!max-w-5 min-w-5 h-4 w-4" />
                                <div className="relative w-12 h-12">
                                    <Image src="/img/payment/money.png" alt="Thanh toán tiền mặt" layout="fill"
                                           objectFit="contain" />
                                </div>
                                <div>Thanh toán tiền mặt</div>
                            </label>
                        </div>
                    </div>
                </div>
                <BookingDetails movie={movie} showTime={showTime}
                                selectedProducts={selectedProducts}
                                selectedSeats={selectedSeats}
                                footer={
                                    <div className="flex justify-end gap-5 items-center mt-5">
                                        <button
                                            onClick={() => router.push('/admin/sales/choose-combo')}
                                            className="text-brand-500 py-2 px-5 rounded flex items-center justify-center gap-x-2">
                                            Quay lại
                                        </button>
                                        <button
                                            className="disabled:bg-brand-200 bg-brand-500 py-2 px-5 rounded flex items-center justify-center text-white gap-x-2">
                                            Thanh toán
                                        </button>
                                    </div>
                                }
                />
            </div>
        </div>
    );
};

export default AdminPaymentPage;