import React, { useEffect, useState } from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import TimePicker from '@/components/Admin/TimePicker';
import { AdminShowTime } from '@/modules/showTimes/interface';
import { useUpdateShowTime } from '@/modules/showTimes/repository';
import { useAllRoomsByCinemaId } from '@/modules/cinemas/repository';

interface Cinema {
    id: number;
    name: string;
}

type ModalUpdateShowTimeProps = {
    onClose: () => void;
    movies: { id: number, title: string, duration: number } [];
    cinemas: Cinema[];
    showTime?: AdminShowTime;
}

interface FormValues {
    room?: number;
    startDate: Date;
    cinema?: number;
    movie?: number;
    startTime?: Date;
    endTime?: Date;
    status: BaseStatus;
}

const createValidationSchema = (movies: ModalUpdateShowTimeProps['movies']) => {
    return Yup.object().shape({
        startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
        startTime: Yup.date().required('Thời gian bắt đầu không được để trống'),
        endTime: Yup.date()
            .required('Thời gian kết thúc không được để trống')
            .test('is-after-start', 'Thời gian kết thúc phải sau thời gian bắt đầu', function(endTime) {
                const { startTime } = this.parent;
                if (!startTime || !endTime) return true;
                return dayjs(endTime).isAfter(dayjs(startTime));
            })
            .test('min-duration', 'Thời gian kết thúc phải đủ thời lượng chiếu phim', function(endTime) {
                const { startTime, movie } = this.parent;
                if (!startTime || !endTime || !movie) return true;

                const selectedMovie = movies.find(m => m.id === movie);
                if (!selectedMovie) return true;
                console.log('startTime', startTime);
                console.log('endTime', endTime);
                const minEndTime = dayjs(startTime).add(selectedMovie.duration, 'minutes');
                return dayjs(endTime).isAfter(minEndTime) || dayjs(endTime).isSame(minEndTime);
            }),
        room: Yup.number()
            .required('Phòng chiếu không được để trống')
            .nullable(),
        movie: Yup.number()
            .required('Phim không được để trống')
            .nullable(),
        cinema: Yup.number()
            .required('Cụm rạp không được để trống')
            .nullable(),
    });
};

const ModalUpdateShowTime = ({
                                 onClose,
                                 cinemas,
                                 movies,
                                 showTime,
                             }: ModalUpdateShowTimeProps) => {
    const [selectedCinema, setSelectedCinema] = useState<number>();
    const updateShowTime = useUpdateShowTime();
    const { data: rooms } = useAllRoomsByCinemaId(selectedCinema);

    if (!showTime) return null;

    const AutoCalculateEndTime = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();

        useEffect(() => {
            if (values.movie && values.startTime) {
                const selectedMovie = movies.find(m => m.id === values.movie);
                if (selectedMovie) {
                    const endTime = dayjs(values.startTime)
                        .add(selectedMovie.duration + 15, 'minutes')
                        .toDate();
                    setFieldValue('endTime', endTime);
                }
            }
        }, [values.movie, values.startTime, setFieldValue]);

        return null;
    };

    const initialValues: FormValues = {
        startDate: dayjs(showTime.startDate).toDate(),
        startTime: dayjs(`2000-01-01 ${showTime.startTime}`).toDate(),
        endTime: dayjs(`2000-01-01 ${showTime.endTime}`).toDate(),
        room: showTime.room.id,
        cinema: showTime.cinema.id,
        movie: showTime.movie.id,
        status: showTime.status,
    };

    const RoomUpdater = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();

        useEffect(() => {
            if (values.cinema !== selectedCinema) {
                setSelectedCinema(values.cinema);
                // Reset room khi đổi cinema
                setFieldValue('room', undefined);
            }
        }, [values.cinema, setFieldValue]);

        return null;
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updateShowTime.mutateAsync({
                id: showTime.id,
                payload: {
                    cinemaId: values.cinema!,
                    roomId: values.room!,
                    movieId: values.movie!,
                    startTime: dayjs(values.startTime).format('HH:mm'),
                    endTime: dayjs(values.endTime).format('HH:mm'),
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    status: values.status,
                }
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Cập nhật lịch chiếu" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={createValidationSchema(movies)}>
                <Form>
                    <RoomUpdater />
                    <AutoCalculateEndTime />
                    <Select readOnly name="cinema" label="Cụm rạp" placeholder="Chọn rạp"
                            options={cinemas.map(cinema => ({ value: cinema.id, label: cinema.name }))}
                    />
                    <Select name="room" label="Phòng chiếu" placeholder="Chọn phòng chiếu"
                            options={rooms ? rooms.map(room => ({ value: room.id, label: room.name })) : []}
                    />
                    <Select name="movie" label="Phim" placeholder="Chọn phim"
                            options={movies.map(movie => ({
                                value: movie.id,
                                label: movie.title + ' - ' + movie.duration + ' phút',
                            }))}
                    />
                    <DatePicker readOnly name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required />
                    <div className="grid grid-cols-2 gap-3">
                        <TimePicker label="Thời gian bắt đầu" name="startTime" required />
                        <TimePicker label="Thời gian kết thúc" name="endTime" required />
                    </div>
                    <Select name="status" label="Trạng thái" placeholder="Chọn trạng thái" options={[
                        ...Object.keys(BaseStatus).map(status => ({
                            value: status,
                            label: BaseStatusVietnamese[status as BaseStatus],
                        })),
                    ]} />
                    <div className="flex justify-end items-center gap-3">
                        <ButtonAction.Cancel onClick={onClose} />
                        <ButtonAction.Submit />
                    </div>
                </Form>
            </Formik>
        </Modal>
    );
};

export default ModalUpdateShowTime;