import * as XLSX from "xlsx";

export function exportToExcel<T>(data: T[], headers: string[], filename: string) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, {header: headers});
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
}