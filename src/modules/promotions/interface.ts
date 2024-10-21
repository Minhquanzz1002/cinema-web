import { BaseStatus } from '@/modules/base/interface';
import { BaseProduct } from '@/modules/products/interface';
import { SeatType } from '@/modules/seats/interface';

export interface AdminPromotionOverview {
    id: number;
    code: string;
    name: string;
    startDate: Date;
    endDate: Date;
    description: string;
    imagePortrait?: string;
    status: BaseStatus;
    promotionLines: AdminPromotionLineOverview[];
}

enum PromotionLineType {
    BUY_PRODUCTS_GET_PRODUCTS = 'BUY_PRODUCTS_GET_PRODUCTS',
    BUY_TICKETS_GET_TICKETS = 'BUY_TICKETS_GET_TICKETS',
    BUY_PRODUCTS_GET_TICKETS = 'BUY_PRODUCTS_GET_TICKETS',
    BUY_TICKETS_GET_PRODUCTS = 'BUY_TICKETS_GET_PRODUCTS',
    PRICE_DISCOUNT = 'PRICE_DISCOUNT',
    CASH_REBATE = 'CASH_REBATE',
}

export const PromotionLineTypeVietnamese: Record<PromotionLineType, string> = {
    [PromotionLineType.BUY_PRODUCTS_GET_PRODUCTS]: 'Mua sản phẩm tặng sản phẩm',
    [PromotionLineType.BUY_TICKETS_GET_TICKETS]: 'Mua vé tặng vé',
    [PromotionLineType.BUY_PRODUCTS_GET_TICKETS]: 'Mua sản phẩm tặng vé',
    [PromotionLineType.BUY_TICKETS_GET_PRODUCTS]: 'Mua vé tặng sản phẩm',
    [PromotionLineType.PRICE_DISCOUNT]: 'Chiếc khấu',
    [PromotionLineType.CASH_REBATE]: 'Giảm tiền',
};

export interface AdminPromotionLineOverview {
    id: number
    code: string;
    name: string;
    type: PromotionLineType;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    promotionDetails: AdminPromotionDetailOverview[];
}

export interface AdminPromotionDetailOverview {
    id: number;
    discountValue: number;
    maxDiscountValue: number;
    minOrderValue: number;
    usageLimit: number;
    requiredProduct: BaseProduct;
    giftProduct: BaseProduct;
    currentUsageCount: number;
    giftQuantity: number;
    giftSeatType: SeatType;
    giftSeatQuantity: number;
    requiredProductQuantity: number;
    requiredSeatQuantity: number;
    requiredSeatType: SeatType;
    status: BaseStatus;
}