import { BaseEntity } from '@/modules/base/interface';

export interface GenreFilter {
    id: number;
    name: string;
}

export interface Genre extends BaseEntity{
    id: number;
    name: string;
}