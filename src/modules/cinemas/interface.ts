import { BaseStatus } from '@/modules/base/interface';

export interface AdminCinemaOverview {
    id: number;
    code: string;
    name: string;
    address: string;
    city: {
        id: number;
        name: string;
    };
    district: string;
    ward: string;
    status: BaseStatus;
    hotline: string;
}