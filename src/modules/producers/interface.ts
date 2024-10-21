import { BaseEntity } from '@/modules/base/interface';

export interface ProducerFilter {
    id: number;
    name: string;
}

export interface Producer extends BaseEntity {
    id: number;
    name: string;
}