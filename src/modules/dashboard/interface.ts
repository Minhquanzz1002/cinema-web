export interface Stats {
    totalRevenue: number;
    showTimesToday: number;
    moviesCount: number;
    totalEmployees: number;
    totalCustomers: number;
    totalCinemas: number;
}

export interface MovieRevenue {
    movieName: string;
    totalRevenue: number;
}

export interface CinemaRevenue {
    cinemaName: string;
    totalRevenue: number;
}