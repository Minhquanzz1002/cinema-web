import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatDateToLocalDate } from '@/utils/formatDate';
import {
    GroupedEmployeeSalesReport,
    GroupedMovieSalesReport,
    PromotionSummaryReport,
} from '@/modules/reports/interface';
import { formatNumber, formatNumberToCurrency } from '@/utils/formatNumber';
import lodash from 'lodash';
import { PromotionLineType, PromotionLineTypeVietnamese } from '@/modules/promotions/interface';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';

export async function exportToExcel<T extends Record<string, any>>(
    data: T[],
    filename: string = 'export.xlsx',
    headers?: string[],
): Promise<void> {
    if (data.length === 0) {
        throw new Error('Data array is empty');
    }

    const actualHeaders = headers || Object.keys(data[0]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const headerRow = worksheet.addRow(actualHeaders);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' },
        };
        cell.font = {
            bold: true,
            size: 12,
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    data.forEach((item) => {
        const row = Object.keys(data[0]).map((header) => item[header] ?? '');
        const dataRow = worksheet.addRow(row);

        dataRow.eachCell((cell) => {
            cell.alignment = {
                vertical: 'middle',
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    const columnCount = worksheet.columnCount;
    for (let i = 1; i <= columnCount; i++) {
        const column = worksheet.getColumn(i);
        if (column) {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
        }
    }

    worksheet.eachRow((row) => {
        row.height = 25;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
}

export const exportEmployeeSaleReport = async (groupedReports: GroupedEmployeeSalesReport[], fromDate: Date, toDate: Date) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DSBH Theo Ngay', {
        views: [{
            showGridLines: false,
        }],

    });

    // Add info
    worksheet.addRow([`Ngày in: ${formatDateToLocalDate(new Date())}`]).font = {
        name: 'Times New Roman',
        size: 11,
    };
    worksheet.addRow([]);

    // Add title
    const titleRow = worksheet.addRow(['DOANH SỐ BÁN HÀNG THEO NGÀY']);
    titleRow.font = { name: 'Times New Roman', bold: true, size: 11 };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`);

    // Add date range row
    const dateRangeRow = worksheet.addRow([
        `Từ ngày: ${formatDateToLocalDate(fromDate)}    Đến ngày: ${formatDateToLocalDate(toDate)}`,
    ]);
    dateRangeRow.font = { name: 'Times New Roman', size: 11 };
    dateRangeRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${dateRangeRow.number}:G${dateRangeRow.number}`);
    worksheet.addRow([]);

    // Add header row
    const headers = [
        'STT',
        'NVBH',
        'Tên NVBH',
        'Ngày',
        'Chiếc khấu',
        'Doanh số trước chiếc khấu',
        'Doanh số sau chiếc khấu',
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            bold: true,
            size: 11,
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        cell.border = {
            top: { style: 'thin' },
        };
    });

    let currentRowNumber = headerRow.number + 1;

    groupedReports.forEach((group, groupIndex) => {
        const startRowNumber = currentRowNumber;

        // Add report rows
        group.reports.forEach((report, reportIndex) => {
            const row = worksheet.addRow([
                reportIndex === 0 ? groupIndex + 1 : '', // STT chỉ hiện ở dòng đầu
                report.employeeCode,
                report.employeeName,
                formatDateToLocalDate(report.date),
                formatNumberToCurrency(report.totalDiscount),
                formatNumberToCurrency(report.totalPrice),
                formatNumberToCurrency(report.finalAmount),
            ]);

            row.eachCell((cell, colNumber) => {
                cell.font = {
                    name: 'Times New Roman',
                    size: 11,
                };
                if (colNumber > 4) { // Các cột số tiền
                    cell.alignment = { horizontal: 'right' };
                } else {
                    cell.alignment = { horizontal: 'center' };
                }
                if (reportIndex === 0) {
                    cell.border = {
                        top: { style: 'thin' },
                    };
                } else {
                    cell.border = {
                        top: { style: 'hair' },
                    };
                }
            });

            currentRowNumber++;
        });

        // Merge STT cell
        if (group.reports.length > 1) {
            worksheet.mergeCells(`A${startRowNumber}:A${currentRowNumber - 1}`);
        }

        // Add group total row
        const groupTotalRow = worksheet.addRow([
            '',
            '',
            '',
            'Tổng cộng',
            formatNumberToCurrency(group.totalDiscount),
            formatNumberToCurrency(group.totalPrice),
            formatNumberToCurrency(group.finalAmount),
        ]);

        groupTotalRow.eachCell((cell, colNumber) => {
            cell.font = {
                name: 'Times New Roman',
                size: 11,
                bold: colNumber === 4,
            };
            if (colNumber === 4) {
                cell.alignment = { horizontal: 'center' };
            }
            if (colNumber > 4) {
                cell.alignment = { horizontal: 'right' };
            }
            if (colNumber >= 4) {
                cell.border = {
                    top: { style: 'hair' },
                };
            }
        });

        currentRowNumber++;
    });

    const grandTotal = {
        discount: lodash.sumBy(groupedReports, 'totalDiscount'),
        totalPrice: lodash.sumBy(groupedReports, 'totalPrice'),
        finalAmount: lodash.sumBy(groupedReports, 'finalAmount'),
    };

    // Add grand total row
    const grandTotalRow = worksheet.addRow([
        'Tổng cộng',
        '',
        '',
        '',
        formatNumberToCurrency(grandTotal.discount),
        formatNumberToCurrency(grandTotal.totalPrice),
        formatNumberToCurrency(grandTotal.finalAmount),
    ]);

    grandTotalRow.eachCell((cell, colNumber) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
            bold: true,
        };
        cell.border = {
            bottom: {
                style: 'thick',
            },
        };
        if (colNumber > 4) {
            cell.alignment = { horizontal: 'right' };
        }
    });

    worksheet.addRow([]);

    worksheet.addRow([
        null,
        'Mô tả báo cáo doanh số bán hàng theo ngày',
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });

    worksheet.addRow([
        null,
        '- Mã nhân viên, tên, ngày bán.',
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([
        null,
        '- Chiết khấu: bao gồm khuyến mãi giảm tiền trực tiếp và khuyến mãi % trên hóa đơn.',
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([
        null,
        '- Doanh số trước chiết khấu: tổng tiền chưa trừ chiết khấu.',
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([
        null,
        '- Doanh số sau chiết khấu: tổng tiền đã trừ chiết khấu.',
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([]);

    const tableDescRow = worksheet.addRow(['']);
    const descCell = tableDescRow.getCell(2);
    descCell.value = {
        richText: [
            {
                text: 'Lấy dữ liệu từ bảng nhân viên, hóa đơn bán hàng ',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                },
            },
            {
                text: '(không tính các hóa đơn mua đã trả)',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                    italic: true,  // In nghiêng phần trong ngoặc
                },
            },
            {
                text: '.',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                },
            },
        ],
    };

    // Filter row
    const filterRow = worksheet.addRow([
        '',
        'Filter: Từ ngày - Đến ngày',
    ]);
    filterRow.eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });

    worksheet.columns = [
        { width: 10 },  // STT
        { width: 22 }, // NVBH
        { width: 25 }, // Tên NVBH
        { width: 15 }, // Ngày
        { width: 15 }, // Chiết khấu
        { width: 30 }, // Doanh số trước CK
        { width: 30 }, // Doanh số sau CK
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'daily-sales-report.xlsx');
};

export const exportPromotionSummaryReport = async (reports: PromotionSummaryReport[], fromDate: Date, toDate: Date) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TKKM', {
        views: [{
            showGridLines: false,
        }],

    });

    // Add info
    worksheet.addRow([`Ngày in: ${formatDateToLocalDate(new Date())}`]).font = {
        name: 'Times New Roman',
        size: 11,
    };
    worksheet.addRow([]);

    // Add title
    const titleRow = worksheet.addRow(['BÁO CÁO TỔNG KẾT CTKM']);
    titleRow.font = { name: 'Times New Roman', bold: true, size: 14 };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:N${titleRow.number}`);

    // Add date range row
    const dateRangeRow = worksheet.addRow([
        `Từ ngày: ${formatDateToLocalDate(fromDate)}    Đến ngày: ${formatDateToLocalDate(toDate)}`,
    ]);
    dateRangeRow.font = { name: 'Times New Roman', size: 11 };
    dateRangeRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${dateRangeRow.number}:N${dateRangeRow.number}`);
    worksheet.addRow([]);

    // Add header row
    const headers = [
        'Mã CTKM',
        'Tên CTKM',
        'Ngày bắt đầu',
        'Ngày kết thúc',
        'Loại khuyến mãi',
        'Tiền hoặc phần trăm KM',
        'Số tiền KM tối đa',
        'Mã SP tặng',
        'Tên SP tặng',
        'Loại vé tặng',
        'SL tặng trên đơn hàng',
        'SL áp dụng tối đa',
        'SL đã áp dụng',
        'SL áp dụng còn lại',
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 25;
    headerRow.eachCell((cell, colIndex) => {
        cell.font = {
            name: 'Times New Roman',
            bold: true,
            size: 11,
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        if (colIndex === 1) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'hair' },
            };
        } else if (colIndex === headers.length) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'hair' },
                right: { style: 'thin' },
            };
        } else {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'hair' },
                right: { style: 'hair' },
            };
        }
    });

    reports.map((report) => {
        report.promotionDetails.map(detail => {
            const row = worksheet.addRow([
                report.code,
                report.name,
                formatDateToLocalDate(report.startDate),
                formatDateToLocalDate(report.endDate),
                PromotionLineTypeVietnamese[report.type as PromotionLineType],
                {
                    [PromotionLineType.CASH_REBATE]: formatNumberToCurrency(detail.discountValue),
                    [PromotionLineType.PRICE_DISCOUNT]: `${detail.discountValue}%`,
                } [report.type] || '',
                detail.maxDiscountValue ? formatNumberToCurrency(detail.maxDiscountValue) : '',
                detail?.giftProduct?.code || '',
                detail?.giftProduct?.name || '',
                SeatTypeVietnamese[detail?.giftSeatType as SeatType] || '',
                detail?.giftQuantity || detail?.giftSeatQuantity || '',
                detail.usageLimit,
                detail.currentUsageCount,
                detail.usageLimit - detail.currentUsageCount,
            ]);

            row.height = 20;

            row.eachCell((cell, colNumber) => {
                cell.font = {
                    name: 'Times New Roman',
                    size: 11,
                };

                if (colNumber == 1) {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'hair' },
                        left: { style: 'thin' },
                    };
                } else if (colNumber == 14) {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                        left: { style: 'hair' },
                    };
                } else {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'hair' },
                        left: { style: 'hair' },
                    };
                }

                const columnAlignments: Record<number, 'center' | 'right'> = {
                    3: 'center',
                    4: 'center',
                    6: 'right',
                    7: 'right',
                    11: 'right',
                    12: 'right',
                    13: 'right',
                    14: 'right',
                };
                cell.alignment = { horizontal: columnAlignments[colNumber] || 'left' };
            });
        });
    });

    worksheet.addRow([]);

    worksheet.addRow([]);

    worksheet.addRow([
        '',
        'Lấy dữ liệu từ bảng CTKM, chi tiết CTKM, sản phẩm',
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });

    // Filter row
    const filterRow = worksheet.addRow([
        '',
        'Filter: Từ ngày - Đến ngày (CTKM nào có ngày bắt đầu hoặc kết thúc trong khoảng thời gian này sẽ xuất ra)',
    ]);
    filterRow.eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });

    worksheet.columns = [
        { width: 20 },  // Mã CTKM
        { width: 30 },  // Tên CTKM
        { width: 15 },  // Ngày bắt đầu
        { width: 15 },  // Ngày kết thúc
        { width: 20 },  // Loại khuyến mãi
        { width: 35 },  // Tiền hoặc phần trăm KM
        { width: 18 },  // Số tiền KM tối đa
        { width: 15 },  // Mã SP tặng
        { width: 25 },  // Tên SP tặng
        { width: 15 },  // Loại vé tặng
        { width: 25 },  // SL tặng trên đơn hàng
        { width: 20 },  // SL áp dụng tối đa
        { width: 20 },  // SL đã áp dụng
        { width: 20 },  // SL áp dụng còn lại
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'promotion-summary-report.xlsx');
};

export const exportMovieSaleReport = async (groupedReports: GroupedMovieSalesReport[], fromDate: Date, toDate: Date) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DSBH Theo Phim', {
        views: [{
            showGridLines: false,
        }],

    });

    // Add info
    worksheet.addRow([`Ngày in: ${formatDateToLocalDate(new Date())}`]).font = {
        name: 'Times New Roman',
        size: 11,
    };
    worksheet.addRow([]);

    // Add title
    const titleRow = worksheet.addRow(['DOANH SỐ BÁN HÀNG THEO PHIM']);
    titleRow.font = { name: 'Times New Roman', bold: true, size: 11 };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`);

    // Add date range row
    const dateRangeRow = worksheet.addRow([
        `Từ ngày: ${formatDateToLocalDate(fromDate)}    Đến ngày: ${formatDateToLocalDate(toDate)}`,
    ]);
    dateRangeRow.font = { name: 'Times New Roman', size: 11 };
    dateRangeRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${dateRangeRow.number}:G${dateRangeRow.number}`);
    worksheet.addRow([]);

    // Add header row
    const headers = [
        'STT',
        'Mã phim',
        'Tên phim',
        'Ngày',
        'Số suất chiếu',
        'Số vé bán',
        'Doanh thu',
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            bold: true,
            size: 11,
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        cell.border = {
            top: { style: 'thin' },
        };
    });

    let currentRowNumber = headerRow.number + 1;

    groupedReports.forEach((group, groupIndex) => {
        const startRowNumber = currentRowNumber;

        // Add report rows
        group.reports.forEach((report, reportIndex) => {
            const row = worksheet.addRow([
                reportIndex === 0 ? groupIndex + 1 : '', // STT chỉ hiện ở dòng đầu
                report.movieCode,
                report.movieTitle,
                formatDateToLocalDate(report.date),
                formatNumber(report.totalShows),
                formatNumber(report.totalTickets),
                formatNumberToCurrency(report.totalPrice),
            ]);

            row.eachCell((cell, colNumber) => {
                cell.font = {
                    name: 'Times New Roman',
                    size: 11,
                };
                if (colNumber > 4) { // Các cột số tiền
                    cell.alignment = { horizontal: 'right' };
                } else {
                    cell.alignment = { horizontal: 'center' };
                }
                if (reportIndex === 0) {
                    cell.border = {
                        top: { style: 'thin' },
                    };
                } else {
                    cell.border = {
                        top: { style: 'hair' },
                    };
                }
            });

            currentRowNumber++;
        });

        // Merge STT cell
        if (group.reports.length > 1) {
            worksheet.mergeCells(`A${startRowNumber}:A${currentRowNumber - 1}`);
        }

        // Add group total row
        const groupTotalRow = worksheet.addRow([
            '',
            '',
            '',
            'Tổng cộng',
            formatNumber(group.totalShows),
            formatNumber(group.totalTickets),
            formatNumberToCurrency(group.totalPrice),
        ]);

        groupTotalRow.eachCell((cell, colNumber) => {
            cell.font = {
                name: 'Times New Roman',
                size: 11,
                bold: colNumber === 4,
            };
            if (colNumber === 4) {
                cell.alignment = { horizontal: 'center' };
            }
            if (colNumber > 4) {
                cell.alignment = { horizontal: 'right' };
            }
            if (colNumber >= 4) {
                cell.border = {
                    top: { style: 'hair' },
                };
            }
        });

        currentRowNumber++;
    });

    const grandTotal = {
        totalShows: lodash.sumBy(groupedReports, 'totalShows'),
        totalTickets: lodash.sumBy(groupedReports, 'totalTickets'),
        totalPrice: lodash.sumBy(groupedReports, 'totalPrice'),
    };

    // Add grand total row
    const grandTotalRow = worksheet.addRow([
        'Tổng cộng',
        '',
        '',
        '',
        formatNumber(grandTotal.totalShows),
        formatNumber(grandTotal.totalTickets),
        formatNumberToCurrency(grandTotal.totalPrice),
    ]);

    grandTotalRow.eachCell((cell, colNumber) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
            bold: true,
        };
        cell.border = {
            bottom: {
                style: 'thick',
            },
        };
        if (colNumber > 4) {
            cell.alignment = { horizontal: 'right' };
        }
    });

    worksheet.addRow([]);

    const tableDescRow = worksheet.addRow(['']);
    const descCell = tableDescRow.getCell(2);
    descCell.value = {
        richText: [
            {
                text: 'Lấy dữ liệu từ bảng lịch chiếu, hóa đơn, chi tiết hóa đơn',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                },
            },
            {
                text: '(không tính các hóa đơn mua đã trả)',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                    italic: true,  // In nghiêng phần trong ngoặc
                },
            },
            {
                text: '.',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                },
            },
        ],
    };

    // Filter row
    const filterRow = worksheet.addRow([
        '',
        'Filter: Từ ngày - Đến ngày',
    ]);
    filterRow.eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });

    worksheet.columns = [
        { width: 10 },  // STT
        { width: 22 }, // NVBH
        { width: 25 }, // Tên NVBH
        { width: 15 }, // Ngày
        { width: 15 }, // Chiết khấu
        { width: 30 }, // Doanh số trước CK
        { width: 30 }, // Doanh số sau CK
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'daily-sales-report.xlsx');
};