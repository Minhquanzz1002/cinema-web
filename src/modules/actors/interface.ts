import { BaseEntity, BaseStatus } from '@/modules/base/interface';

export interface ActorFilter {
    id: number;
    name: string;
}

/**
 * Actor interface full definition
 */
export interface Actor extends BaseEntity {
    id: number;
    name: string;
    image?: string;
    birthday?: Date;
    country?: string;
    bio?: string;
    status: BaseStatus;
}