'use client';
import React, { useEffect, useState } from 'react';
import Typography from '@/components/Admin/Typography';
import Card from '@/components/Admin/Card';
import { useOrderDetail } from '@/modules/orders/repository';
import { AdminOrderOverview, OrderStatus, OrderStatusVietnamese } from '@/modules/orders/interface';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { formatDateInOrder, formatTime } from '@/utils/formatDate';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { LuGift } from 'react-icons/lu';
import Loader from '@/components/Admin/Loader';
import NotFound from '@/components/Admin/NotFound';
import { SeatTypeVietnamese } from '@/modules/seats/interface';
import { NOT_FOUND_PRODUCT_IMAGE, TICKET_DEFAULT_IMAGE } from '@/variables/images';
import ModalPrintBill from '@/components/Admin/Pages/Bills/ModalPrintBill';

const OrderDetailInfo = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="flex justify-between items-center">
        <div className="font-medium">{label}:</div>
        <div className="text-gray-800">{value}</div>
    </div>
);


const OrderDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: responseData, isLoading } = useOrderDetail(code);
    const [order, setOrder] = useState<AdminOrderOverview | null>(null);
    const [showModalPrint, setShowModalPrint] = useState<boolean>(false);

    useEffect(() => {
        if (responseData?.data) {
            setOrder(responseData.data);
        }
    }, [responseData]);

    useEffect(() => {
        document.title = 'B&Q Cinema - Chi tiết đơn hàng';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!order) {
        return <NotFound />;
    }

    return (
        <>
            <div className="my-5">
                <Card className="p-[18px]">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-1 text-xl font-nunito font-medium">
                            <div>Mã hóa đơn</div>
                            <div className="text-brand-500">#{order.code}</div>
                        </div>

                        {
                            order.status === OrderStatus.COMPLETED && (
                                <button className="bg-brand-500 h-9 rounded px-4 text-white"
                                        onClick={() => setShowModalPrint(true)}>
                                    In vé
                                </button>
                            )
                        }
                    </div>
                </Card>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col gap-4 col-span-2">
                        <Card className="p-[18px]">
                            <Typography.Title level={4}>Sản phẩm & Vé</Typography.Title>
                            <div className="flex flex-col gap-3">
                                {
                                    order.orderDetails.map((orderDetail, index) => (
                                        <React.Fragment key={index}>
                                            {orderDetail.type === 'PRODUCT' && orderDetail.product && (
                                                <div className={`flex justify-between`}>
                                                    <div className="flex gap-3">
                                                        <div className="h-20 w-20 relative border rounded">
                                                            <Image
                                                                src={orderDetail.product.image || NOT_FOUND_PRODUCT_IMAGE}
                                                                alt={`Ảnh của ${orderDetail.product.name}`} fill
                                                                sizes="(max-width: 2024px) 100vw, 2024px" quality={100}
                                                                className="object-cover rounded h-20 w-20" />
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <div className="font-medium flex gap-4">
                                                                {orderDetail.product.name}
                                                                {orderDetail.isGift && (
                                                                    <div className="flex justify-center items-center">
                                                                        <LuGift className="text-brand-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div
                                                                className="text-gray-800 text-sm">{orderDetail.product.description}</div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex flex-col justify-center">
                                                        <div
                                                            className="font-medium">{orderDetail.quantity} x {formatNumberToCurrency(orderDetail.price)}
                                                        </div>
                                                        <div
                                                            className="text-gray-600 text-sm">Tổng: {formatNumberToCurrency((orderDetail.quantity * orderDetail.price))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {orderDetail.type === 'TICKET' && orderDetail.seat && (
                                                <div className={`flex justify-between`}>
                                                    <div className="flex gap-3">
                                                        <div className="h-20 w-20 relative border rounded">
                                                            <Image src={TICKET_DEFAULT_IMAGE}
                                                                   alt="Ảnh vé" fill
                                                                   priority
                                                                   sizes="(max-width: 2024px) 100vw, 2024px"
                                                                   quality={100}
                                                                   className="object-cover rounded h-20 w-20" />
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <div className="font-medium flex gap-4">
                                                                {SeatTypeVietnamese[orderDetail.seat.type]}
                                                                {orderDetail.isGift && (
                                                                    <div className="flex justify-center items-center">
                                                                        <LuGift className="text-brand-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div
                                                                className="text-gray-800 text-sm">Ghế: {orderDetail.seat.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col justify-center">
                                                        <div
                                                            className="font-medium">{1} x {formatNumberToCurrency(orderDetail.price)}
                                                        </div>
                                                        <div
                                                            className="text-gray-600 text-sm">Tổng: {formatNumberToCurrency(orderDetail.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </Card>

                        <Card className="p-[18px]">
                            <Typography.Title level={4}>Tổng quan</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <OrderDetailInfo label="Tổng tiền" value={formatNumberToCurrency(order.totalPrice)} />
                                <OrderDetailInfo label="Giảm giá" value={formatNumberToCurrency(order.totalDiscount)} />
                                <OrderDetailInfo label="Thành tiền"
                                                 value={<span
                                                     className="font-medium text-lg text-brand-500">{formatNumberToCurrency(order.finalAmount)}</span>}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Card className="p-[18px]">
                            <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <OrderDetailInfo label="Tên" value={order.user?.name || 'Khách vãng lai'} />
                                <OrderDetailInfo label="Điện thoại" value={order.user?.phone || 'Chưa cập nhật'} />
                                <OrderDetailInfo label="Email" value={order.user?.email || 'Chưa cập nhật'} />
                            </div>
                        </Card>

                        <Card className="p-[18px]">
                            <Typography.Title level={4}>Thông tin phim & rạp</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <OrderDetailInfo label="Phim" value={order.showTime.movie.title} />
                                <OrderDetailInfo label="Giờ chiếu" value={formatTime(order.showTime.startTime)} />
                                <OrderDetailInfo label="Thời lượng" value={`${order.showTime.movie.duration} phút`} />
                                <OrderDetailInfo label="Rạp" value={order.showTime.roomName} />
                                <OrderDetailInfo label="Thể loại" value={`${order.showTime.movie.ageRating}`} />
                            </div>
                        </Card>

                        <Card className="p-[18px]">
                            <Typography.Title level={4}>Thông tin đơn hàng</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <OrderDetailInfo label="Ngày đặt" value={formatDateInOrder(order.orderDate)} />
                                <OrderDetailInfo label="Trạng thái" value={OrderStatusVietnamese[order.status]} />
                            </div>

                        </Card>
                    </div>
                </div>
            </div>
            <ModalPrintBill isOpen={showModalPrint} onClose={() => setShowModalPrint(false)} bill={order} />
        </>
    );
};

export default OrderDetailPage;