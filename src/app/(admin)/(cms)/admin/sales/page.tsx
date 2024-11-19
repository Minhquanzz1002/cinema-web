'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAllMoviesForSale } from '@/modules/movies/repository';
import Loader from '@/components/Admin/Loader';
import { addDays, format, isToday } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { AdminMovie } from '@/modules/movies/interface';
import { useAllShowTimesForSale } from '@/modules/showTimes/repository';
import { groupBy, sortBy } from 'lodash';
import { formatTime } from '@/utils/formatDate';
import { AdminShowTimeForSale } from '@/modules/showTimes/interface';
import Typography from '@/components/Admin/Typography';
import { useSaleContext } from '@/context/SaleContext';
import { NOT_FOUND_MOVIE_IMAGE } from '@/variables/images';

const SalePage = () => {
    const { setMovieAndShowTime, proceedToSeatSelection } = useSaleContext();
    const { data: movies, isLoading: isLoadingMovies } = useAllMoviesForSale();
    const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedShowTime, setSelectedShowTime] = useState<AdminShowTimeForSale | null>(null);
    const { data: showTimes } = useAllShowTimesForSale({
        movieId: selectedMovie?.id,
        startDate: format(selectedDate, 'yyyy-MM-dd'),
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Bán hàng';
    }, []);

    // Reset selected showtime shen movie or date changes
    useEffect(() => {
        setSelectedShowTime(null);
    }, [selectedMovie, selectedDate]);

    useEffect(() => {
        setMovieAndShowTime(selectedMovie, selectedShowTime);
    }, [selectedMovie, selectedShowTime, setMovieAndShowTime]);

    if (isLoadingMovies) {
        return <Loader />;
    }

    const next7Days = [...Array(7)].map((_, index) => {
        const date = addDays(new Date(), index);
        return {
            date: format(date, 'dd/MM'),
            dayName: format(date, 'EEEE', { locale: vi }),
            fullDate: date,
        };
    });

    const groupedShowTimes = showTimes ? groupBy(showTimes, 'cinema.name') : {};
    const sortedGroupedShowTimes = Object.entries(groupedShowTimes).map(([cinemaName, shows]) => ({
        cinemaName,
        showTimes: sortBy(shows, 'startTime'),
    }));

    const handleMovieSelect = (movie: AdminMovie) => {
        if (selectedMovie?.id === movie.id) {
            setSelectedMovie(null);
        } else {
            setSelectedMovie(movie);
        }
    };

    const handleShowTimeSelect = (showTime: AdminShowTimeForSale) => {
        if (selectedShowTime?.id === showTime.id) {
            setSelectedShowTime(null);
        } else {
            setSelectedShowTime(showTime);
        }
    };

    return (
        <div className="mt-5">
            <div className="flex gap-2">
                <div className="border w-3/5 p-3 bg-white rounded-lg">
                    <Typography.Title level={3}>Phim đang chiếu</Typography.Title>
                    <div className="overflow-auto max-h-[700px]">
                        <div className="grid grid-cols-4 gap-2">
                            {
                                movies && movies.length > 0 ? (
                                    movies.map((movie) => (
                                        <div key={movie.id}>
                                            <div className="relative w-full h-64 group">
                                                <Image
                                                    src={movie.imagePortrait || NOT_FOUND_MOVIE_IMAGE}
                                                    alt={`Ảnh của phim ${movie.title}`} fill className="object-cover" />
                                                <div className="absolute top-0 mt-1 ml-1">
                                                <span
                                                    className="px-1 py-0.5 text-white rounded text-sm font-medium bg-brand-500">{movie.ageRating}</span>
                                                </div>
                                                <div
                                                    className="absolute bottom-0 w-full bg-brand-500 text-white text-center h-10 text-sm flex justify-center items-center">
                                                    <div className="p-2 overflow-hidden line-clamp-2">
                                                        {movie.title}
                                                    </div>
                                                </div>

                                                {
                                                    selectedMovie?.id === movie.id ? (
                                                        <div
                                                            className="absolute inset-0 bg-black/30 flex justify-center items-center text-white uppercase">
                                                            Đang chọn
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleMovieSelect(movie)}
                                                                className="absolute uppercase opacity-0 group-hover:opacity-100 inset-0 bg-black/30 flex justify-center items-center text-white">
                                                            Click để chọn
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>Không có phim nào</div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-3 flex flex-col">
                    <div>
                        <Typography.Title level={3}>Suất chiếu</Typography.Title>
                    </div>
                    <div>
                        <div className="grid grid-cols-7 gap-1">
                            {next7Days.map((day) => (
                                <div
                                    key={day.date}
                                    onClick={() => setSelectedDate(day.fullDate)}
                                    className={`px-2 py-1 border border-gray-200 rounded-md cursor-pointer ${format(selectedDate, 'dd/MM') === day.date
                                        ? 'bg-brand-500 text-white border-brand-500'
                                        : 'border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <div
                                        className={`text-[10px] ${format(selectedDate, 'dd/MM') === day.date ? 'text-white' : 'text-gray-600'}`}>
                                        {isToday(day.fullDate) ? 'Hôm nay' : day.dayName}
                                    </div>
                                    <div>{day.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative my-2">
                        <div className="absolute inset-0 border rounded-lg p-3">
                            <div className="overflow-y-auto max-h-full">
                                {
                                    selectedMovie ? (
                                        sortedGroupedShowTimes.length > 0 ? (
                                            sortedGroupedShowTimes.map((group) => (
                                                <div key={group.cinemaName} className="mt-3">
                                                    <div className="font-medium">{group.cinemaName}</div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {
                                                            group.showTimes.map((show) => (
                                                                <button key={show.id}
                                                                        onClick={() => handleShowTimeSelect(show)}
                                                                        className={`py-1.5 border rounded text-center font-thin text-black ${show.id === selectedShowTime?.id ? 'bg-brand-500 text-white' : 'hover:bg-brand-500 hover:text-white'}`}>
                                                                    {formatTime(show.startTime)}
                                                                </button>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                Không có suất chiếu nào cho phim và ngày đã chọn
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center text-gray-500 py-8">
                                            Vui lòng chọn một bộ phim
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center mt-5">
                        <button className="my-button" onClick={proceedToSeatSelection}>Tiếp tục</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalePage;