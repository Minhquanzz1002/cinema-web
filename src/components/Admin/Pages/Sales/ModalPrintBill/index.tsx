import React, { useRef } from 'react';
import Modal from '@/components/Admin/Modal';
import { useReactToPrint } from 'react-to-print';
import { groupBy, sumBy } from 'lodash';
import { formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { useSaleContext } from '@/context/SaleContext';
import { useRouter } from 'next/navigation';
import Barcode from 'react-barcode';

interface ModalPrintBillProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrintContent = React.forwardRef<HTMLDivElement>((props, ref) => {
    const { order: bill } = useSaleContext();

    if (!bill) {
        return null;
    }

    const { orderDetails } = bill;
    const groupedDetails = groupBy(orderDetails, 'type');
    const tickets = groupedDetails['TICKET'] || [];
    const products = groupedDetails['PRODUCT'] || [];
    const totalAmount = sumBy(products, product => product.quantity * product.price);

    return (
        <div ref={ref} className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {
                tickets.map((ticket, index) => (
                    <div key={`ticket-${index}`} className="border p-3 relative">
                        <div className="mr-20 border-r-2 border-dashed border-brand-500 text-sm">
                            <div className="text-lg font-bold bg-brand-500 text-white rounded px-1">B&Q Cinema
                                | {bill.showTime.cinema.name}</div>

                            <div className="space-y-1">
                                <div>
                                    <div>Địa
                                        chỉ: <span>{`${bill.showTime.cinema.address}, ${bill.showTime.cinema.ward}, ${bill.showTime.cinema.district}, ${bill.showTime.cinema.city}`}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div>Phim: <span>{bill.showTime.movie.title}</span></div>
                                    <div>Phòng: <span>{bill.showTime.room.name}</span></div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div>Ngày: <span>{formatDateToLocalDate(bill.showTime.startDate)}</span></div>
                                    <div>Thời
                                        gian: <span>{formatTime(bill.showTime.startTime)} đến {formatTime(bill.showTime.endTime)}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div>Ghế: <span className="text-xl font-medium">{ticket.seat?.fullName}</span></div>
                                    <div>Giá: <span
                                        className="text-lg font-medium"
                                    >{formatNumberToCurrency(ticket.price)}</span></div>
                                </div>
                            </div>

                            <div className="absolute w-24 h-full top-0 right-0 flex justify-center items-center">
                                <div className="-rotate-90">
                                    <Barcode
                                        value={bill.code} height={55} width={0.75} fontSize={14} background="none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            {
                products.length > 0 && (
                    <div className="border p-3 relative">
                        <div className="mr-20 border-r-2 border-dashed border-brand-500 text-sm">
                            <div className="space-y-1">
                                <div className="text-lg font-bold bg-brand-500 text-white rounded px-1">
                                    B&Q Cinema | {bill.showTime.cinema.name}
                                </div>

                                <div>
                                    <div>Địa
                                        chỉ: <span>{`${bill.showTime.cinema.address}, ${bill.showTime.cinema.ward}, ${bill.showTime.cinema.district}, ${bill.showTime.cinema.city}`}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7">
                                    <div className="col-span-3">Sản phẩm</div>
                                    <div className="col-span-1 text-right">SL</div>
                                    <div className="col-span-3 text-right">Giá</div>
                                </div>
                                {
                                    products.map((product, index) => (
                                        <div key={`product-${index}`} className="grid grid-cols-7">
                                            <div className="col-span-3">{product.product?.name}</div>
                                            <div className="col-span-1 text-right">{product.quantity}</div>
                                            <div
                                                className="col-span-3 text-right"
                                            >{formatNumberToCurrency(product.price)}</div>
                                        </div>
                                    ))
                                }
                                <div className="flex justify-end items-center">
                                <span
                                    className="text-lg font-medium"
                                >Tổng tiền: {formatNumberToCurrency(totalAmount)}</span>
                                </div>
                            </div>

                            <div className="absolute w-24 h-full top-0 right-0 flex justify-center items-center">
                                <div className="-rotate-90">
                                    <Barcode
                                        value={bill.code} height={55} width={0.75} fontSize={14} background="none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
});

PrintContent.displayName = 'PrintContent';

const ModalPrintBill = ({ isOpen, onClose }: ModalPrintBillProps) => {
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);

    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        pageStyle: `
            @page {
                size: 400px auto;
                margin: 0;
            }
            @media print {
                html, body {
                    width: 400px;
                    margin: 0 auto;
                    font-size: 16px;
                }
                svg {
                    font-size: 16px;
                }
            }
        `,

    });

    const handlePrint = () => {
        reactToPrintFn();
    };

    const handleClose = () => {
        onClose();
        router.push('/admin/sales');
    };

    return (
        <Modal open={isOpen} onClose={handleClose} title="In vé" className="!max-w-[500px] w-[500px]">
            <div className="max-h-[700px]">
                <PrintContent ref={contentRef} />
            </div>
            <div className="mt-3 flex justify-end gap-3 items-center">
                <button className="bg-gray-100 h-9 rounded px-4" onClick={handleClose}>
                    Hủy
                </button>

                <button className="bg-brand-500 h-9 rounded px-4 text-white" onClick={handlePrint}>
                    In
                </button>
            </div>
        </Modal>
    );
};

export default ModalPrintBill;