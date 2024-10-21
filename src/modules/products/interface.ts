import { BaseStatus } from '@/modules/base/interface';

export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export const ProductStatusVietnamese: Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: 'Đang hoạt động',
    [ProductStatus.INACTIVE]: 'Không hoạt động',
    [ProductStatus.SUSPENDED]: 'Tạm ngưng'
};

export interface BaseProduct {
    id: number;
    code: string;
    name: string;
    description: string;
    image: string;
    status: ProductStatus;
}

export interface BaseProductWithPrice extends BaseProduct {
    price?: number;
}

export interface ProductPriceHistory {
    id: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
}