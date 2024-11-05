import { BaseEntity, BaseStatus } from '@/modules/base/interface';

export interface DirectorFilter {
    id: number;
    name: string;
}

export interface Director extends BaseEntity {
    id: number;
    code: string;
    name: string;
    image?: string;
    birthday?: Date;
    country?: string;
    bio?: string;
    status: BaseStatus;
}