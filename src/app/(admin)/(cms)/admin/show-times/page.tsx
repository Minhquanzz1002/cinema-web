'use client';
import React, { useEffect, useState } from 'react';
import Card from '@/components/Admin/Card';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Filters/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { useAllShowTimeFilters, useAllShowTimes, useDeleteShowTime } from '@/modules/showTimes/repository';
import lodash from 'lodash';
import { AdminShowTime } from '@/modules/showTimes/interface';
import Loader from '@/components/Admin/Loader';
import { formatTime } from '@/utils/formatDate';
import dayjs from 'dayjs';
import DatePicker from '@/components/Admin/DatePicker';
import ModalAddShowTime from '@/components/Admin/Pages/ShowTimes/ModalAddShowTime/page';
import { FaLock, FaLockOpen, FaPlus } from 'react-icons/fa6';
import useDeleteModal from '@/hook/useDeleteModal';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import ModalUpdateShowTime from '@/components/Admin/Pages/ShowTimes/ModalUpdateShowTime/page';
import ModalGenerateShowTime from '@/components/Admin/Pages/ShowTimes/ModalGenerateShowTime';
import ModalActiveMultipleShowTime from '@/components/Admin/Pages/ShowTimes/ModalActiveMultipleShowTime';

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
    'bg-rose-500',
    'bg-orange-500',
    'bg-violet-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-fuchsia-500',
    'bg-indigo-500',
    'bg-rose-500',
];

interface Room {
    id: number;
    name: string;
}

const ShowTimePage = () => {
    const [showTimeGrouped, setShowTimeGrouped] = useState<ShowTimeGrouped>({});
    const [rooms, setRooms] = useState<Room[]>([]);
    const [movieColorMap, setMovieColorMap] = useState<{ [key: string]: string }>({});

    const { data: filterOptions, isLoading: isLoadingFilters } = useAllShowTimeFilters();

    /**
     * States for delete show time
     */
    const deleteShowTime = useDeleteShowTime();
    const deleteModal = useDeleteModal<AdminShowTime>({
        onDelete: async (showTime) => {
            await deleteShowTime.mutateAsync(showTime.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (product) => product.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa suất chiếu đang hiển thị',
    });

    /**
     * States for update show time
     */
    const [showTimeToUpdate, setShowTimeToUpdate] = useState<AdminShowTime | undefined>(undefined);

    const [filters, setFilters] = useState<ShowTimeFilter>(DEFAULT_FILTER);
    const [movies, setMovies] = useState<{ id: number; title: string, duration: number }[]>([]);
    const [cinemas, setCinemas] = useState<{ id: number; name: string }[]>([]);

    /**
     * States for add show time modal
     */
    const [showModalAddShowTime, setShowModalAddShowTime] = useState<boolean>(false);
    const [defaultRoomToAdd, setDefaultRoomToAdd] = useState<Room | undefined>(undefined);
    const [defaultStartTime, setDefaultStartTime] = useState<Date | undefined>(undefined);

    /**
     * State for active multiple show time
     */
    const [showModalActiveMultipleShowTime, setShowModalActiveMultipleShowTime] = useState<boolean>(false);

    /**
     * State for generating show time
     */
    const [showModalGenerateShowTime, setShowModalGenerateShowTime] = useState<boolean>(false);


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
        const newRooms: Room[] = lodash.sortBy(showTimes.data.rooms, 'name');
        setShowTimeGrouped(grouped);
        setRooms(newRooms);
    }, [showTimes]);

    useEffect(() => {
        if (!showTimes) return;

        const uniqueMovies = Array.from(new Set(showTimes.data.showTimes.map(st => st.movie.title)));
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
                showTime.room.name === room &&
                getShowTimesInTimeSlot(showTime.startTime, timeSlot),
            );
    };


    if (isLoadingFilters && isLoadingShowTimes) {
        return <Loader />;
    }

    const handleModalAddShowTimeClose = () => {
        setShowModalAddShowTime(false);
        setDefaultRoomToAdd(undefined);
        setDefaultStartTime(undefined);
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <Card extra={`h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Thêm tự động" onClick={() => setShowModalGenerateShowTime(true)} />
                            <ButtonAction.Add text="Thêm thủ công" onClick={() => setShowModalAddShowTime(true)} />
                            <button
                                type="button" onClick={() => setShowModalActiveMultipleShowTime(true)}
                                className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                Kích hoạt đồng loạt
                            </button>
                        </div>
                    </div>
                </Card>

                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={handleFilterSubmit} enableReinitialize>
                        <Form>
                            <div className="px-4">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid sm-max:grid-cols-1 grid-cols-4 gap-4">
                                    <Select
                                        name="cinemaId"
                                        placeholder="Lọc theo rạp"
                                        options={
                                            cinemas.map(cinema => ({
                                                label: cinema.name,
                                                value: cinema.id,
                                            }))
                                        }
                                    />
                                    <Select
                                        name="movieId"
                                        placeholder="Lọc theo phim"
                                        options={[
                                            { label: 'Tất cả phim', value: 'ALL' },
                                            ...movies.map(movie => ({
                                                label: movie.title,
                                                value: movie.id,
                                            })),
                                        ]}
                                    />
                                    <Select
                                        name="status"
                                        placeholder="Lọc theo trạng thái"
                                        options={[
                                            { label: 'Tất cả trạng thái', value: 'ALL' },
                                            ...Object.values(BaseStatus).map(value => ({
                                                label: BaseStatusVietnamese[value],
                                                value,
                                            })),
                                        ]}
                                    />
                                    <DatePicker name="startDate" />
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
                                        <th
                                            key={`${room.id}-header`}
                                            className="font-medium text-sm px-4 py-2 border-b border-r last-of-type:border-r-0 min-w-72 max-w-72">
                                            {room.name}
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
                                                const showTimesInCell = getShowTimesForCell(room.name, time);
                                                const now = dayjs();

                                                const [slotHour, slotMinute] = time.split(':').map(Number);
                                                const timeSlotDateTime = dayjs(filters.startDate)
                                                    .hour(slotHour)
                                                    .minute(slotMinute);
                                                const isFutureTimeSlot = timeSlotDateTime.isAfter(now);

                                                return (
                                                    <td
                                                        key={`${room.id}-${time}`}
                                                        className="border-b border-r last-of-type:border-r-0 px-2 py-3">
                                                        <div className="flex flex-col gap-2 group/main">
                                                            {
                                                                !showTimesInCell.length && isFutureTimeSlot && (
                                                                    <button
                                                                        type="button" onClick={() => {
                                                                        setDefaultRoomToAdd(room);
                                                                        setShowModalAddShowTime(true);
                                                                        setDefaultStartTime(timeSlotDateTime.toDate());
                                                                    }}
                                                                        className="px-2 h-12 flex justify-center items-center bg-black/5 text-gray-500 rounded-lg text-center opacity-0 group-hover/main:opacity-100">
                                                                        <FaPlus size={20} className="text-brand-500" />
                                                                    </button>
                                                                )
                                                            }
                                                            {
                                                                showTimesInCell.map(showTime => {
                                                                    const showDateTime = dayjs(`${showTime} ${showTime.startTime}`);
                                                                    const isLocked = showDateTime.isAfter(now) || showTime.status === BaseStatus.ACTIVE;

                                                                    return (
                                                                        <div
                                                                            key={`${showTime.id}-${isLocked}`}
                                                                            className={`px-2 flex flex-col justify-center  ${movieColorMap[showTime.movie.title] || 'bg-green-500'} text-white rounded-lg relative group h-12`}>
                                                                            <div
                                                                                className="flex justify-between items-center">
                                                                                <div
                                                                                    className="flex-1 flex-col flex gap-1">
                                                                                    <div
                                                                                        className="text-xs font-medium">
                                                                                        {showTime.movie.title}
                                                                                    </div>
                                                                                    <div
                                                                                        className="flex justify-between items-center">
                                                                                        <div
                                                                                            className="text-[11px] leading-3 flex items-center gap-1">
                                                                                            {`${formatTime(showTime.startTime)} - ${formatTime(showTime.endTime)} (${showTime.movie.duration} phút)`}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    {isLocked ? <FaLock /> :
                                                                                        <FaLockOpen />}
                                                                                </div>
                                                                            </div>


                                                                            {
                                                                                !isLocked && (
                                                                                    <div
                                                                                        className="absolute rounded-lg inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-3">
                                                                                        <ButtonAction.Update
                                                                                            onClick={() => setShowTimeToUpdate(showTime)} />
                                                                                        <ButtonAction.Delete
                                                                                            onClick={() => deleteModal.openDeleteModal(showTime)} />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    );
                                                                })
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

            {
                showModalAddShowTime && (
                    <ModalAddShowTime
                        onClose={handleModalAddShowTimeClose}
                        movies={movies} cinemas={cinemas} defaultRoom={defaultRoomToAdd}
                        defaultStartTime={defaultStartTime}
                        defaultStartDate={filters.startDate}
                        defaultCinemaId={filters.cinemaId} />
                )
            }
            <ModalUpdateShowTime
                showTime={showTimeToUpdate} onClose={() => setShowTimeToUpdate(undefined)}
                movies={movies} cinemas={cinemas} />

            <ModalDeleteAlert
                onClose={deleteModal.closeDeleteModal}
                onConfirm={deleteModal.handleDelete}
                isOpen={deleteModal.showDeleteModal}
                title="Xóa suất chiếu?"
                content={
                    <>Bạn có chắc chắn muốn xóa suất
                        chiếu <HighlightedText>{deleteModal.selectedData?.movie.title} - {deleteModal.selectedData?.startTime && formatTime(deleteModal.selectedData.startTime)}</HighlightedText> không?</>
                }
            />
            {
                showModalGenerateShowTime && (
                    <ModalGenerateShowTime
                        onClose={() => setShowModalGenerateShowTime(false)}
                        onSuccess={(date, cinemaId) => setFilters({ ...filters, startDate: date, cinemaId })}
                        cinemas={cinemas}
                        defaultCinemaId={filters.cinemaId}
                        defaultStartDate={filters.startDate}
                    />
                )
            }
            {
                showModalActiveMultipleShowTime && (
                    <ModalActiveMultipleShowTime
                        onClose={() => setShowModalActiveMultipleShowTime(false)}
                        movies={movies}
                        cinemas={cinemas}
                        defaultCinemaId={filters.cinemaId}
                        defaultStartDate={filters.startDate}
                    />
                )
            }
        </>
    );
};

export default ShowTimePage;
