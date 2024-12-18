import React, { useRef } from 'react';
import Modal from '@/components/Admin/Modal';
import { useReactToPrint } from 'react-to-print';
import { AdminOrderOverview } from '@/modules/orders/interface';
import { groupBy, sumBy } from 'lodash';
import { formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import Barcode from 'react-barcode';

interface ModalPrintBillProps {
    isOpen: boolean;
    onClose: () => void;
    bill: AdminOrderOverview;
}

interface PrintContentProps {
    bill: AdminOrderOverview;
}

const PrintContent = React.forwardRef<HTMLDivElement, PrintContentProps>(({ bill }, ref) => {
    const { orderDetails } = bill;
    const groupedDetails = groupBy(orderDetails, 'type');
    const tickets = groupedDetails['TICKET'] || [];
    const products = groupedDetails['PRODUCT'] || [];
    const totalAmount = sumBy(products, product => product.quantity * product.price);

    return (
        <div ref={ref} className="flex flex-col gap-2">
            {
                tickets.map((ticket, index) => (
                    <div key={`ticket-${index}`} className="border p-3 relative border-brand-500">
                        <div className="mr-20 border-r-2 border-dashed border-brand-500">
                            <div className="text-lg font-bold bg-brand-500 text-white rounded px-1">
                                B&Q Cinema | {bill.showTime.cinemaName}
                            </div>

                            <div>
                                <div>Địa chỉ: <span>{bill.showTime.address}</span></div>
                            </div>

                            <div className="grid grid-cols-2">
                                <div>Phim: <span>{bill.showTime.movie.title}</span></div>
                                <div>Phòng: <span>{bill.showTime.roomName}</span></div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div>Ngày: <span>{formatDateToLocalDate(bill.showTime.startDate)}</span></div>
                                <div>Giờ: <span>{formatTime(bill.showTime.startTime)}</span></div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div>Ghế: <span className="text-lg font-medium">{ticket.seat?.name}</span></div>
                                <div>Giá: <span
                                    className="text-lg font-medium"
                                >{formatNumberToCurrency(ticket.price)}</span></div>
                            </div>

                            <div className="absolute w-24 h-full top-0 right-0 flex justify-center items-center">
                                <div className="-rotate-90">
                                    <Barcode value={bill.code} height={55} width={0.75} fontSize={14} background="none" />
                                </div>
                            </div>
                        </div>

                    </div>
                ))
            }
            {
                products.length > 0 && (
                    <div className="border p-3 relative border-brand-500">
                        <div className="mr-20 border-r-2 border-dashed border-brand-500">
                            <div className="text-lg font-bold bg-brand-500 text-white rounded px-1">B&Q Cinema
                                | {bill.showTime.cinemaName}</div>
                            <div>
                                <div>Địa chỉ: <span>{bill.showTime.address}</span></div>
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

                            <div className="absolute w-24 h-full top-0 right-0 flex justify-center items-center">
                                <div className="-rotate-90">
                                    <Barcode value={bill.code} height={55} width={0.75} fontSize={14} background="none" />
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

const ModalPrintBill = ({ isOpen, onClose, bill }: ModalPrintBillProps) => {
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

    return (
        <Modal open={isOpen} onClose={onClose} title="In vé" className="!max-w-[500px] w-[500px]">
            <div className="max-h-[700px]">
                <PrintContent ref={contentRef} bill={bill} />
            </div>
            <div className="mt-3 flex justify-end gap-3 items-center">
                <button className="bg-gray-100 h-9 rounded px-4" onClick={onClose}>
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