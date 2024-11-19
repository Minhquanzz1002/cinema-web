import { BaseStatus } from "@/modules/base/interface";
import { SeatType } from "@/modules/seats/interface";

export interface EmployeeSalesReport {
    employeeName: string;
    employeeCode: string;
    date: Date;
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
}

export interface GroupedEmployeeSalesReport {
    employeeName: string;
    employeeCode: string;
    reports: EmployeeSalesReport[];
    totalPrice: number;
    totalDiscount: number;
    finalAmount: number;
}

export interface MovieSalesReport {
    movieTitle: string;
    movieCode: string;
    date: Date;
    totalPrice: number;
    totalShows: number;
    totalTickets: number;
}

export interface GroupedMovieSalesReport {
    movieTitle: string;
    movieCode: string;
    reports: MovieSalesReport[];
    totalPrice: number;
    totalShows: number;
    totalTickets: number;
}

export interface PromotionSummaryReport {
    id: number;
    code: string;
    name: string;
    startDate: Date;
    endDate: Date;
    type: string;
    status: BaseStatus;
    promotionDetails: {
        id: number;
        discountValue: number;
        maxDiscountValue?: number;
        minOrderValue: number;
        usageLimit: number;
        requiredProduct?: ProductInPromotionReport;
        giftProduct?: ProductInPromotionReport;
        currentUsageCount: number;
        giftQuantity?: number;
        giftSeatType?: SeatType;
        giftSeatQuantity?: number;
        requiredProductQuantity: number;
        requiredSeatQuantity: number;
        requiredSeatType: SeatType;
        status: BaseStatus;
    }[]
}

export interface ProductInPromotionReport {
    id: number;
    code: string;
    name: string;
    description: string;
    image?: string;
    status: string;
}