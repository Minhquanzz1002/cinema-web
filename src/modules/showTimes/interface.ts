import { BaseStatus } from '@/modules/base/interface';

export interface AdminCinemaInShowTime {
    id: number;
    name: string;
}

export interface AdminMovieInShowTime {
    id: number;
    title: string;
    duration: number;
}

export interface AdminRoomInShowTime {
    id: number;
    name: string;
}

export interface AdminShowTime {
    id: string;
    movie: AdminMovieInShowTime;
    cinema: AdminCinemaInShowTime;
    room: AdminRoomInShowTime;
    startTime: string;
    endTime: string;
    startDate: Date;
    status: BaseStatus;
}

export interface AdminShowTimeFilters {
    cinemas: AdminCinemaInShowTime[];
    movies: AdminMovieInShowTime[];
}