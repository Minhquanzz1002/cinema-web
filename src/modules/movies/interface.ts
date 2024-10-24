import { Genre, GenreFilter } from '@/modules/genres/interface';
import { Actor, ActorFilter } from '@/modules/actors/interface';
import { Producer, ProducerFilter } from '@/modules/producers/interface';

export interface MovieFilter {
    genres: GenreFilter[];
    actors: ActorFilter[];
    producers: ProducerFilter[];
}

export enum MovieStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    COMING_SOON = 'COMING_SOON',
    SUSPENDED = 'SUSPENDED',
}

export const MovieStatusVietnamese : Record<MovieStatus, string> = {
    ACTIVE: 'Đang chiếu',
    INACTIVE: 'Ngừng chiếu',
    COMING_SOON: 'Sắp chiếu',
    SUSPENDED: 'Tạm ngưng'
};

export enum AgeRating {
    P = 'P',
    K = 'K',
    T13 = '13',
    T16 = '16',
    T18 = '18',
    C = 'C'
}

export interface AdminMovie {
    id: string;
    code: string;
    country: string;
    duration: number;
    title: string;
    status: MovieStatus;
    summary: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    imageLandscape: string;
    imagePortrait: string;
    releaseDate: Date;
    slug: string;
    age: number;
    ageRating: AgeRating;
    rating: number;
    trailer: string;
}

export interface Movie extends AdminMovie{
    genres: Genre[];
    producers: Producer[];
    actors: Actor[];
}