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

    worksheet.addRow(actualHeaders);

    data.forEach((item) => {
        const row = actualHeaders.map((header) => item[header] ?? '');
        worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
}