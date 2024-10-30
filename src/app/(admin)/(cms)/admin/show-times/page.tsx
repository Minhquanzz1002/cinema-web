'use client';
import React, { useEffect, useState } from 'react';
import Card from '@/components/Admin/Card';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Filters/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { useAllShowTimeFilters, useAllShowTimes } from '@/modules/showTimes/repository';
import lodash from 'lodash';
import { AdminShowTime } from '@/modules/showTimes/interface';
import Loader from '@/components/Admin/Loader';
import { formatTime } from '@/utils/formatDate';
import dayjs from 'dayjs';
import DatePicker from '@/components/Admin/DatePicker';

interface ShowTimeFilter {
    status: 'ALL' | BaseStatus;
    cinemaId: number;
    movieId?: number | 'ALL';
    startDate?: Date;
}

interface ShowTimeGrouped {
    [key: string]: AdminShowTime[];
}

const DEFAULT_FILTER: ShowTimeFilter = {
    status: 'ALL',
    movieId: 'ALL',
    cinemaId: 0,
    startDate: new Date(),
};

const timeSlots: string[] = [
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00',
];

const movieColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-brand-500',
];

const ShowTimePage = () => {
    const [showTimeGrouped, setShowTimeGrouped] = useState<ShowTimeGrouped>({});
    const [rooms, setRooms] = useState<string[]>(['Rạp 1', 'Rạp 2', 'Rạp 3', 'Rạp 4']);
    const [movieColorMap, setMovieColorMap] = useState<{ [key: string]: string }>({});

    const { data: filterOptions, isLoading: isLoadingFilters } = useAllShowTimeFilters();

    const [filters, setFilters] = useState<ShowTimeFilter>(DEFAULT_FILTER);
    const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
    const [cinemas, setCinemas] = useState<{ id: number; name: string }[]>([]);

    const { data: showTimes, isLoading: isLoadingShowTimes } = useAllShowTimes({
        cinemaId: filters.cinemaId,
        movieId: filters.movieId === 'ALL' ? undefined : filters.movieId,
        status: filters.status === 'ALL' ? undefined : filters.status,
        startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : undefined,
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Lịch chiếu';
    }, []);

    useEffect(() => {
        if (!showTimes) return;

        const grouped = lodash.groupBy(showTimes.data.showTimes, 'movieTitle');
        const newRooms: string[] = lodash.sortBy(showTimes.data.rooms, 'name').map(room => room.name);
        setShowTimeGrouped(grouped);
        setRooms(newRooms);
    }, [showTimes]);

    useEffect(() => {
        if (!showTimes) return;

        const uniqueMovies = Array.from(new Set(showTimes.data.showTimes.map(st => st.movieTitle)));
        const newMovieColorMap = uniqueMovies.reduce((acc, movie, index) => {
            acc[movie] = movieColors[index % movieColors.length];
            return acc;
        }, {} as { [key: string]: string });

        setMovieColorMap(newMovieColorMap);
    }, [showTimes]);

    useEffect(() => {
        if (filterOptions?.data.cinemas.length) {
            const sortedCinemas = lodash.orderBy(filterOptions.data.cinemas, ['name'], ['asc']);
            const sortedMovies = lodash.orderBy(filterOptions.data.movies, ['title'], ['asc']);
            setCinemas(sortedCinemas);
            setMovies(sortedMovies);
            setFilters(prev => ({
                ...prev,
                cinemaId: sortedCinemas[0].id,
            }));
        }
    }, [filterOptions]);

    const handleFilterSubmit = (values: ShowTimeFilter) => {
        console.log(values);
        setFilters(values);
    };

    const getShowTimesInTimeSlot = (startTime: string, timeSlot: string) => {
        const [showHour] = startTime.split(':').map(Number);
        const [slotHour] = timeSlot.split(':').map(Number);

        return showHour >= slotHour && showHour < slotHour + 2;
    };

    const getShowTimesForCell = (room: string, timeSlot: string): AdminShowTime[] => {
        return Object.values(showTimeGrouped)
            .flat()
            .filter(showTime =>
                showTime.roomName === room &&
                getShowTimesInTimeSlot(showTime.startTime, timeSlot),
            );
    };


    if (isLoadingFilters && isLoadingShowTimes) {
        return <Loader />;
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <Card extra={`h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add />
                            <ButtonAction.Import />
                        </div>
                    </div>
                </Card>

                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={handleFilterSubmit} enableReinitialize>
                        <Form>
                            <div className="px-4">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-4">
                                    <Select name="cinemaId"
                                            placeholder="Lọc theo rạp"
                                            options={
                                                cinemas.map(cinema => ({
                                                    label: cinema.name,
                                                    value: cinema.id,
                                                }))
                                            }
                                    />
                                    <Select name="movieId"
                                            placeholder="Lọc theo phim"
                                            options={[
                                                { label: 'Tất cả phim', value: 'ALL' },
                                                ...movies.map(movie => ({
                                                    label: movie.title,
                                                    value: movie.id,
                                                })),
                                            ]}
                                    />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(BaseStatus).map(value => ({
                                                    label: BaseStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                    <DatePicker name="startDate"/>
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                </Card>

                <Card className="p-4">
                    <Typography.Title level={4}>Bảng lịch chiếu</Typography.Title>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full border-collapse min-w-[800px]">
                            <thead>
                            <tr>
                                <th className="font-medium text-sm bg-white sticky left-0 z-10 border-b border-r w-32 min-w-32">
                                    Thời gian
                                </th>
                                {
                                    rooms.map((room) => (
                                        <th key={`${room}-header`}
                                            className="font-medium text-sm px-4 py-2 border-b border-r last-of-type:border-r-0 min-w-72 max-w-72">
                                            {room}
                                        </th>
                                    ))
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                timeSlots.map((time) => (
                                    <tr key={time}>
                                        <td className="border-b border-r sticky left-0 z-10 bg-white text-center text-sm min-h-14 h-14">
                                            <div className="flex flex-col justify-between h-full py-2">
                                                <div className="font-medium">{time}</div>
                                                <div
                                                    className="text-xs font-normal text-gray-600">{dayjs(time, 'HH:mm').add(2, 'hour').format('HH:mm')}</div>
                                            </div>
                                        </td>
                                        {
                                            rooms.map((room) => {
                                                const showTimesInCell = getShowTimesForCell(room, time);

                                                return (
                                                    <td key={`${room}-${time}`}
                                                        className="border-b border-r last-of-type:border-r-0 px-2 py-3">
                                                        <div className="flex flex-col gap-2">
                                                            {
                                                                showTimesInCell.map(showTime => (
                                                                    <div key={showTime.id}
                                                                         className={`p-2 ${movieColorMap[showTime.movieTitle] || 'bg-green-500'} text-white rounded-lg`}>
                                                                        <div
                                                                            className="text-sm">{showTime.movieTitle}</div>
                                                                        <div
                                                                            className="text-xs flex items-center gap-2">
                                                                            <div>
                                                                                {`${formatTime(showTime.startTime)} - ${formatTime(showTime.endTime)}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </td>
                                                );
                                            })
                                        }
                                    </tr>
                                ))
                            }

                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    )
        ;
};

export default ShowTimePage;
