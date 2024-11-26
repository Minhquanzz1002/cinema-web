import { UserStatus } from '@/modules/authentication/interface';

export interface CustomerWithNameAndPhone {
    name: string;
    phone: string;
    id: string;
}

export interface AdminCustomerOverview {
    id: string;
    code: string;
    name: string;
    gender: boolean;
    email: string;
    phone: string;
    birthday?: Date;
    status: UserStatus;
    avatar?: string;
}