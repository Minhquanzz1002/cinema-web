'use client';

import React, { useEffect, useState } from 'react';
import { useSaleContext } from '@/context/SaleContext';
import Typography from '@/components/Admin/Typography';
import NotFound from '@/components/Admin/NotFound';
import { useLayoutSeatByShowTimeId } from '@/modules/showTimes/repository';
import Loader from '@/components/Admin/Loader';
import BookingDetails from '@/components/Admin/BookingDetails';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ModalCashPayment from '@/components/Admin/Pages/Sales/ModalCashPayment';
import ModalPrintBill from '@/components/Admin/Pages/Sales/ModalPrintBill';
import { useCreateOrderZaloPay } from '@/modules/payments/repository';
import ModalZaloPayPayment from '@/components/Admin/Pages/Sales/ModalZaloPayPayment';

const AdminPaymentPage = () => {
    const router = useRouter();
    const { movie, showTime, selectedSeats, selectedProducts, order, setZpAppTransId, zpAppTransId } = useSaleContext();
    /**
     * React query
     */
    const { data: layout, isLoading: isLoadingSeat } = useLayoutSeatByShowTimeId(showTime?.id || '');
    const createOrderZaloPay = useCreateOrderZaloPay();

    const [selectedPayment, setSelectedPayment] = useState<'cash' | 'vnpay' | 'zalopay'>('cash');
    const [showModalCashPayment, setShowModalCashPayment] = useState<boolean>(false);
    const [showModalZaloPayPayment, setShowModalZaloPayPayment] = useState<string | null>(null);
    const [showModalPrintBill, setShowModalPrintBill] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'B&Q Cinema - Thanh toán';
    }, []);

    if (isLoadingSeat) {
        return <Loader />;
    }

    if (!movie || !showTime || !layout || !order) {
        return <NotFound />;
    }

    const handlePayment = async () => {
        switch(selectedPayment) {
            case 'zalopay':
                const response = await createOrderZaloPay.mutateAsync({ orderId: order.id });
                setShowModalZaloPayPayment(response.data.qrUrl);
                setZpAppTransId(response.data.transId);
                break;
            case 'cash':
                setShowModalCashPayment(true);
                break;
            default:
                console.log('Vui lòng chọn phương thức thanh toán');
        }
    };

    return (
        <>
            <div className="mt-2">
                <div className="flex gap-2">
                    <div className="w-4/6 bg-white rounded-lg p-3">
                        <Typography.Title level={4}>Phương thức thanh toán</Typography.Title>
                        <div className="min-h-[700px]">
                            <div className="flex flex-col gap-3">
                                <label className=" flex items-center gap-2">
                                    <input type="radio" name="paymentMethod" value="zalopay"
                                           onChange={() => setSelectedPayment('zalopay')}
                                           className="!max-w-5 min-w-5 h-4 w-4" />
                                    <div className="relative w-12 h-12">
                                        <Image src="/img/payment/zalopay.png" alt="Thanh toán ZaloPay" fill
                                               objectFit="contain" />
                                    </div>
                                    <div>Zalopay</div>
                                </label>
                                <label className=" flex items-center gap-2">
                                    <input disabled type="radio" name="paymentMethod" value="vnpay"
                                           onChange={() => setSelectedPayment('vnpay')}
                                           className="!max-w-5 min-w-5 h-4 w-4" />
                                    <div className="relative w-12 h-12">
                                        <Image src="/img/payment/vnpay.png" alt="Thanh toán VNPAY" fill
                                               objectFit="contain" />
                                    </div>
                                    <div>VNPAY (bảo trì)</div>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="paymentMethod" value="cash"
                                           onChange={() => setSelectedPayment('cash')}
                                           className="!max-w-5 min-w-5 h-4 w-4" defaultChecked />
                                    <div className="relative w-12 h-12">
                                        <Image src="/img/payment/money.png" alt="Thanh toán tiền mặt" fill
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
                                                onClick={handlePayment}
                                                className="disabled:bg-brand-200 bg-brand-500 py-2 px-5 rounded flex items-center justify-center text-white gap-x-2">
                                                Thanh toán
                                            </button>
                                        </div>
                                    }
                    />
                </div>
            </div>
            <ModalCashPayment isOpen={showModalCashPayment} onClose={() => setShowModalCashPayment(false)} onSuccess={() => setShowModalPrintBill(true)} />
            <ModalPrintBill isOpen={showModalPrintBill} onClose={() => setShowModalPrintBill(false)} />
            {
                showModalZaloPayPayment && zpAppTransId && (
                    <ModalZaloPayPayment zpAppTransId={zpAppTransId} qrCode={showModalZaloPayPayment} onSuccess={() => setShowModalPrintBill(true)} onClose={() => setShowModalZaloPayPayment(null)} />
                )
            }
        </>
    );
};

export default AdminPaymentPage;