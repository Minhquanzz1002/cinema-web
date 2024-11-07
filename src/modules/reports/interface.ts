export interface DailyReport {
    employeeName: string;
    employeeCode: string;
    date: Date;
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
}

export interface GroupedDailyReport {
    employeeName: string;
    employeeCode: string;
    reports: DailyReport[];
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
}