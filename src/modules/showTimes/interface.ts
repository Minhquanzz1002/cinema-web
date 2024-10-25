import { BaseStatus } from '@/modules/base/interface';

export interface AdminShowTime {
    id: string;
    movieTitle: string;
    cinemaName: string;
    roomName: string;
    startTime: string;
    endTime: string;
    startDate: Date;
    status: BaseStatus;
}

export interface AdminShowTimeFilters {
    cinemas: { id: number; name: string }[];
    movies: { id: number; title: string }[];
}