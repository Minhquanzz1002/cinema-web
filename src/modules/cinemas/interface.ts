import { BaseStatus } from '@/modules/base/interface';

export interface AdminCinemaOverview {
    id: number;
    code: string;
    name: string;
    address: string;
    city: string;
    cityCode: string;
    district: string;
    districtCode: string;
    ward: string;
    wardCode: string;
    status: BaseStatus;
    hotline: string;
    rooms: {
        id: number;
        name: string;
        status: BaseStatus;
    }[];
}