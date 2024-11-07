import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { GroupedDailyReport } from '@/modules/reports/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import lodash from 'lodash';

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
            size: 12
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    data.forEach((item) => {
        const row = actualHeaders.map((header) => item[header] ?? '');
        const dataRow = worksheet.addRow(row);

        dataRow.eachCell((cell) => {
            cell.alignment = {
                vertical: 'middle',
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
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

export const exportDailyReport = async (groupedReports: GroupedDailyReport[], fromDate: Date, toDate: Date) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DSBH Theo Ngay', {
        views: [{
            showGridLines: false,
        }],

    });

    // Add info
    worksheet.addRow([`Ngày in: ${formatDateToLocalDate(new Date())}`]).font = {
        name: 'Times New Roman',
        size: 11
    };
    worksheet.addRow([]);

    // Add title
    const titleRow = worksheet.addRow(['DOANH SỐ BÁN HÀNG THEO NGÀY']);
    titleRow.font = { name: 'Times New Roman', bold: true, size: 11 };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`);

    // Add date range row
    const dateRangeRow = worksheet.addRow([
        `Từ ngày: ${formatDateToLocalDate(fromDate)}    Đến ngày: ${formatDateToLocalDate(toDate)}`
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
            size: 11
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
        cell.border = {
            top: { style: 'thin' }
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
                formatNumberToCurrency(report.finalAmount)
            ]);

            row.eachCell((cell, colNumber) => {
                cell.font = {
                    name: 'Times New Roman',
                    size: 11
                };
                if (colNumber > 4) { // Các cột số tiền
                    cell.alignment = { horizontal: 'right' };
                } else {
                    cell.alignment = { horizontal: 'center' };
                }
                if (reportIndex === 0) {
                    cell.border = {
                        top: { style: 'thin' }
                    };
                } else {
                    cell.border = {
                        top: { style: 'hair' }
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
            formatNumberToCurrency(group.finalAmount)
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
                    top: { style: 'hair' }
                };
            }
        });

        currentRowNumber++;
    });

    const grandTotal = {
        discount: lodash.sumBy(groupedReports, 'totalDiscount'),
        totalPrice: lodash.sumBy(groupedReports, 'totalPrice'),
        finalAmount: lodash.sumBy(groupedReports, 'finalAmount')
    };

    // Add grand total row
    const grandTotalRow = worksheet.addRow([
        'Tổng cộng',
        '',
        '',
        '',
        formatNumberToCurrency(grandTotal.discount),
        formatNumberToCurrency(grandTotal.totalPrice),
        formatNumberToCurrency(grandTotal.finalAmount)
    ]);

    grandTotalRow.eachCell((cell, colNumber) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
            bold: true
        };
        cell.border = {
            bottom: {
                style: 'thick'
            }
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
        "- Mã nhân viên, tên, ngày bán.",
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([
        null,
        "- Chiết khấu: bao gồm khuyến mãi giảm tiền trực tiếp và khuyến mãi % trên hóa đơn.",
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([
        null,
        "- Doanh số trước chiết khấu: tổng tiền chưa trừ chiết khấu.",
    ]).eachCell((cell) => {
        cell.font = {
            name: 'Times New Roman',
            size: 11,
        };
    });
    worksheet.addRow([
        null,
        "- Doanh số sau chiết khấu: tổng tiền đã trừ chiết khấu.",
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
                    size: 11
                }
            },
            {
                text: '(không tính các hóa đơn mua đã trả)',
                font: {
                    name: 'Times New Roman',
                    size: 11,
                    italic: true  // In nghiêng phần trong ngoặc
                }
            },
            {
                text: '.',
                font: {
                    name: 'Times New Roman',
                    size: 11
                }
            }
        ]
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
        { width: 12 }, // NVBH
        { width: 25 }, // Tên NVBH
        { width: 15 }, // Ngày
        { width: 15 }, // Chiết khấu
        { width: 30 }, // Doanh số trước CK
        { width: 30 }, // Doanh số sau CK
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, "daily-sales-report.xlsx");
};