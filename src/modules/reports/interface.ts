import { BaseStatus } from "@/modules/base/interface";
import { SeatType } from "@/modules/seats/interface";

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