import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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