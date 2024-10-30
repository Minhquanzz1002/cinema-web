export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export const ProductStatusVietnamese: Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: 'Hiển thị',
    [ProductStatus.INACTIVE]: 'Ẩn',
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

export enum ProductPriceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export const ProductPriceStatusVietnamese: Record<ProductPriceStatus, string> = {
    [ProductPriceStatus.ACTIVE]: 'Đang áp dụng',
    [ProductPriceStatus.INACTIVE]: 'Ngưng áp dụng'
};

export interface ProductPriceHistory {
    id: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate: Date;
    status: ProductPriceStatus;
}