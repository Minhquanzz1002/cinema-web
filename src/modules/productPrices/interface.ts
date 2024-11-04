import { BaseStatus } from '@/modules/base/interface';

export interface AdminProductPriceOverview {
    id: number;
    price: number;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    product: {
        id: number;
        code: string;
        name: string;
        description: string;
        image: string;
        status: BaseStatus;
    }
}