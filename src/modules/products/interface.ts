export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export interface BaseProduct {
    id: number;
    code: string;
    name: string;
    description: string;
    image: string;
    status: ProductStatus;
}

export interface BaseProductWithPrice extends BaseProduct {
    price: number;
}