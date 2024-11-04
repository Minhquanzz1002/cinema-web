import { BaseStatus } from '@/modules/base/interface';
import { SeatType } from '@/modules/seats/interface';

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

export interface AdminShowTimeForSale {
    id: string;
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

// Seat layout
export interface Layout {
    id: number;
    maxColumn: number;
    maxRow: number;
    rows: Row[];
}

export interface Row {
    name: string;
    index: number;
    seats: Seat[];
}

export interface Seat {
    name: string;
    fullName: string;
    rowIndex: number;
    columnIndex: number;
    area: number;
    id: number;
    groupSeats: GroupSeat[];
    type: SeatType;
    status: BaseStatus;
    booked: boolean;
    price: number;
}

interface GroupSeat {
    rowIndex: number;
    columnIndex: number;
    area: number;
}