import React from 'react';
import { AdminOrderOverview } from '@/modules/orders/interface';
import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx'; // Đảm bảo bạn đã cài đặt docx

type PrintBillProps = {
    bill: AdminOrderOverview;
};

const PrintBill = ({ bill }: PrintBillProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const formatTime = (timeString: string): string => {
        if (!timeString) return 'Invalid Time';

        // Xử lý time string dạng "HH:mm:ss"
        const [hours, minutes] = timeString.split(':');
        if (hours && minutes) {
            return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        }
        return 'Invalid Time';
    };

    const formatDate = () => {
        const date = new Date(bill.showTime.startDate);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const createWordDocument = () => {
        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            size: {
                                width: 6900, // 150mm * 56.7
                                height: 8435, // 300mm * 56.7
                            },
                        },
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'CN Công ty Phim Thiên Ngân',
                                    size: 18,
                                    font: 'Courier New',
                                    bold: true,
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'B',
                                    bold: true,
                                    size: 48,
                                    font: 'Courier New',
                                    color: '0000FF', //Blue color
                                }),
                                new TextRun({
                                    text: '&',
                                    bold: true,
                                    size: 48,
                                    font: 'Courier New',
                                    color: 'FF4500',
                                }),
                                new TextRun({
                                    text: 'Q',
                                    bold: true,
                                    size: 48,
                                    font: 'Courier New',
                                    color: '0000FF',
                                }),
                                new TextRun({
                                    text: ' CINEMA',
                                    bold: true,
                                    size: 48,
                                    color: 'FF4500', // Orange color
                                    font: 'Courier New',
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 200 },
                            children: [
                                new TextRun({
                                    text: `Mã hóa đơn: ${bill.code}`,
                                    size: 24,
                                    font: 'Courier New',
                                }),
                            ],
                        }),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: bill.showTime.cinemaName,
                                    size: 24,
                                    font: 'Courier New',
                                }),
                            ],
                        }),

                        // Hiển thị ngày chiếu startDate tong showTime
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    // Lấy ngày chiếu từ showTime.startDate
                                    text: formatDate(),
                                    font: 'Courier New',
                                    bold: true,
                                    size: 32,
                                }),

                                new TextRun({
                                    text: '    ',
                                    size: 32,
                                    font: 'Courier New',
                                }),

                                new TextRun({
                                    text: formatTime(bill.showTime.startTime),
                                    size: 32,
                                    bold: true,
                                    font: 'Courier New',
                                }),
                            ],
                        }),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: bill.showTime.movie.title,
                                    size: 32,
                                    font: 'Courier New',
                                }),
                            ],
                        }),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({ text: 'Phòng: ', size: 24, font: 'Courier New' }),
                                new TextRun({ text: bill.showTime.roomName, size: 32, font: 'Courier New' , bold: true}),
                            ],
                        }),

                        // Display order details with seat information
                        ...bill.orderDetails.map(
                            detail =>
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [
                                        new TextRun({
                                            text:
                                                detail.seat && detail.seat.name
                                                    ? `Ghế: ${detail.seat.name} - ${formatCurrency(detail.price)}`
                                                    : `${formatCurrency(detail.price)}`,
                                            size: 32,
                                            font: 'Courier New',
                                            bold: true,
                                        }),
                                    ],
                                }),
                        ),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: 'Thời lượng: ',
                                    size: 24,
                                    font: 'Courier New',
                                }),
                                new TextRun({
                                    text: `${bill.showTime.movie.duration} phút`,
                                    size: 24,
                                    font: 'Courier New',
                                }),
                            ],
                        }),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: 'AA/14T: 0837699806',
                                    size: 24,
                                    font: 'Courier New',
                                    bold: true,
                                }),
                            ],
                        }),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: 'MS: 01/VETN2003',
                                    size: 24,
                                    font: 'Courier New',
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                },
                // Tạo thêm một page
                {
                    properties: {
                        page: {
                            size: {
                                width: 8100,
                                height: 6300,
                            },
                        },
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: bill.showTime.cinemaName,
                                    size: 24,
                                    font: 'Courier New',
                                    bold: true,
                                }),

                                new TextRun({
                                    text: '    -  ',
                                    size: 24,
                                    font: 'Courier New',
                                }),
                                new TextRun({
                                    text: 'TN 3497399',
                                    size: 24,
                                    font: 'Courier New',
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: 'Operator:   ',
                                    size: 24,
                                    font: 'Courier New',
                                    bold: true,
                                }),

                                new TextRun({
                                    text: 'Hieu D',
                                    size: 24,
                                    font: 'Courier New',
                                }),
                                new TextRun({
                                    text: '    -  ',
                                    size: 24,
                                    font: 'Courier New',
                                }),
                                new TextRun({
                                    text: formatDate(),
                                    size: 24,
                                    font: 'Courier New',
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text:  '------------------------------------',
                                    size: 24,
                                    font: 'Courier New',
                                }),
                            ],
                        }),


                        ...bill.orderDetails
                            .filter(detail => detail.type === 'PRODUCT')
                            .map(
                                product =>
                                    new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                            new TextRun({
                                                text: `Item ${(product.product?.description )}`,
                                                size: 24,
                                                font: 'Courier New',
                                            }),
                                           
                                          
                                        ],
                                    }),
                        ),

                        ...bill.orderDetails
                            .filter(detail => detail.type === 'PRODUCT')
                            .map(
                                product =>
                                    new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                            
                                           
                                            new TextRun({
                                                text: `Qty: ${formatCurrency(product.quantity)}`,
                                                size: 24,
                                                font: 'Courier New',
                                            }),

                                            
                                        ],
                                    }),
                        ),

                        ...bill.orderDetails
                            .filter(detail => detail.type === 'PRODUCT')
                            .map(
                                product =>
                                    new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                           
                                         

                                            new TextRun({
                                                text: `Price: ${formatCurrency(product.price)} VND`,
                                                size: 24,
                                                font: 'Courier New',
                                            }),
                                        ],
                                    }),
                        ),

                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [new TextRun({ 
                                text: '------------------------------------',
                                size: 24,
                                font: 'Courier New'
                            })],
                        }),
    
                    ],
                },
            ],

            background: {
                color: 'FFFFFF',
            },
        });

        return doc;
    };

    const handlePrint = async () => {
        const doc = createWordDocument();

        try {
            alert('Đang tạo tệp...'); // Thông báo cho người dùng
            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${bill.code}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating document:', error);
            alert('Có lỗi xảy ra khi tạo tệp. Vui lòng thử lại.');
        }
    };

    return (
        <>
            <button className="bg-brand-500 h-9 rounded px-4 text-white" onClick={handlePrint}>
                In vé
            </button>
        </>
    );
};

export default PrintBill;
