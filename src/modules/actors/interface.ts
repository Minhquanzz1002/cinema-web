import { BaseEntity, VisibilityStatus } from '@/modules/base/interface';

export interface ActorFilter {
    id: number;
    name: string;
}

/**
 * Actor interface full definition
 */
export interface Actor extends BaseEntity {
    id: number;
    code: string;
    name: string;
    image?: string;
    birthday?: Date;
    country?: string;
    bio?: string;
    status: VisibilityStatus;
}

export interface ActorInsertPayload {
    name: string;
    code?: string;
    bio?: string;
    birthday?: string;
    country?: string;
    status: VisibilityStatus;
    image: string;
}

export interface ActorUpdatePayload {
    name: string;
    bio?: string;
    birthday?: string;
    country?: string;
    status: VisibilityStatus;
    image: string;
}