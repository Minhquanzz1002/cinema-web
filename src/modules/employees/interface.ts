import { BaseStatus } from '@/modules/base/interface';

export interface AdminEmployeeOverview {
    id: string;
    code: string;
    name: string;
    gender: boolean;
    email: string;
    phone: string;
    birthday: Date;
    status: BaseStatus;
}