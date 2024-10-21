import React from 'react';
import { MovieStatus, MovieStatusVietnamese } from '@/modules/movies/interface';

const statusColors: Record<MovieStatus, string> = {
    [MovieStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [MovieStatus.INACTIVE]: 'text-red-700 bg-red-100',
    [MovieStatus.SUSPENDED]: 'text-yellow-700 bg-yellow-100',
    [MovieStatus.COMING_SOON]: 'text-blue-700 bg-blue-100',
};

type MovieStatusBadgeProps = {
    status: MovieStatus;
};

const MovieStatusBadge = ({status} : MovieStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500 bg-gray-100';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 ${colorClass}`}>
            {MovieStatusVietnamese[status] || status}
        </span>
    );
};

export default MovieStatusBadge;