import { GenreFilter } from '@/modules/genres/interface';
import { ActorFilter } from '@/modules/actors/interface';
import { ProducerFilter } from '@/modules/producers/interface';

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