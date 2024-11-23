import React, { useEffect, useState } from 'react';
import Modal from '@/components/Admin/Modal';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { useGetOrderZaloPay } from '@/modules/payments/repository';
import { OrderZaloPayStatus } from '@/modules/payments/interface';
import { IoCheckmarkCircle } from 'react-icons/io5';
import dayjs from 'dayjs';
import { useCompleteOrderByEmployee } from '@/modules/orders/repository';
import { useSaleContext } from '@/context/SaleContext';

type ModalZaloPayPaymentProps = {
    onClose: () => void;
    onSuccess: () => void;
    qrCode: string;
    zpAppTransId: string;
}

const ModalZaloPayPayment = ({ qrCode, onClose, onSuccess, zpAppTransId }: ModalZaloPayPaymentProps) => {
    const { data: orderStatus } = useGetOrderZaloPay(zpAppTransId);
    const { order, updateOrder } = useSaleContext();
    const completeOrder = useCompleteOrderByEmployee();
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    useEffect(() => {
        if (timeLeft <= 0 || orderStatus?.status === OrderZaloPayStatus.SUCCESS) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, orderStatus?.status]);

    useEffect(() => {
        if (orderStatus?.status === OrderZaloPayStatus.SUCCESS) {
            const timer = setTimeout(() => {
                handleCompleteOrder();
                onClose();
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [orderStatus?.status, onClose, onSuccess]);

    const formatTimeLeft = () => {
        return dayjs.duration(timeLeft, 'seconds').format('mm:ss');
    };

    const handleCompleteOrder = async () => {
        try {
            if (!order) {
                return null;
            }
            const { data } = await completeOrder.mutateAsync(order.id);
            updateOrder(data);
            onSuccess();
        } catch (error) {
            console.log(error);
        }
        onClose();
    };

    const renderContent = () => {
        if (orderStatus?.status === OrderZaloPayStatus.SUCCESS) {
            return (
                <div className="flex flex-col justify-center items-center p-3">
                    <div className=" mb-4">
                        <IoCheckmarkCircle
                            className="w-24 h-24 text-green-500"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                        Thanh toán thành công!
                    </h3>
                    <p className="text-gray-600">
                        Cảm ơn bạn đã thanh toán
                    </p>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center flex-col gap-3">
                <div className="bg-white shadow p-5">
                    <QRCodeSVG
                        className="w-40 h-40"
                        value={qrCode} />
                </div>
                <div className="text-sm">Thời gian quét mã QR để thanh toán còn <span
                    className="text-blue-500 font-bold italic">{formatTimeLeft()}</span></div>
                <div className="flex items-center text-xl">
                    <span>{`Thanh toán với `}</span>
                    <div className="relative h-6 w-20 ml-2">
                        <Image src="/img/payment/logozlp1.png" alt="Zalo Pay" fill
                               className="object-contain object-center" />
                    </div>
                    {` `}bằng mã QR
                </div>
                <div>
                    <p>
                        <b>Hướng dẫn thanh toán</b>
                    </p>
                    <ul>
                        <li><span className="underline">Bước 1:&nbsp;</span> <b>Mở</b> ứng dụng <b>ZaloPay</b></li>
                        <li className="flex items-center"><span
                            className="underline">Bước 2:&nbsp;</span>&nbsp;Chọn <b>&#34;Thanh Toán&#34;</b>
                            <div className="relative w-6 h-5 mx-1"><Image src="/img/payment/qr-scan-zlp.png" alt="Scan"
                                                                          fill /></div>
                            và quét mã QR
                        </li>
                        <li><span className="underline">Bước 3:&nbsp;</span> <b>Xác nhận thanh toán</b> ở ứng dụng</li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <Modal open={true} onClose={onClose} title="" className="max-w-[400px] w-[400px]" wrapperClassName="bg-black/30"
               closeOnClickOutside={false}>
            {renderContent()}
        </Modal>
    );
};

export default ModalZaloPayPayment;