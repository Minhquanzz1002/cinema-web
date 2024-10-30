import React, { useEffect } from 'react';
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

interface Room {
    id: number;
    name: string;
}

interface Cinema {
    id: number;
    name: string;
}

type ModalUpdateShowTimeProps = {
    onClose: () => void;
    movies: { id: number, title: string, duration: number } [];
    cinemas: Cinema[];
    rooms: Room[];
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

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
});

const ModalUpdateShowTime = ({
                                 onClose,
                                 cinemas,
                                 movies,
                                 rooms,
                                 showTime,
                             }: ModalUpdateShowTimeProps) => {

    const updateShowTime = useUpdateShowTime();

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
        startTime: dayjs(`${dayjs().format('YYYY-MM-DD')} ${showTime.startTime}`).toDate(),
        endTime: dayjs(`${dayjs().format('YYYY-MM-DD')} ${showTime.endTime}`).toDate(),
        room: showTime.room.id,
        cinema: showTime.cinema.id,
        movie: showTime.movie.id,
        status: showTime.status,
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
        <Modal title="Thêm lịch chiếu" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <Form>
                    <AutoCalculateEndTime />
                    <Select name="cinema" label="Cụm rạp" placeholder="Chọn rạp"
                            options={cinemas.map(cinema => ({ value: cinema.id, label: cinema.name }))}
                    />
                    <Select name="room" label="Phòng chiếu" placeholder="Chọn phòng chiếu"
                            options={rooms.map(room => ({ value: room.id, label: room.name }))}
                    />
                    <Select name="movie" label="Phim" placeholder="Chọn phim"
                            options={movies.map(movie => ({
                                value: movie.id,
                                label: movie.title + ' - ' + movie.duration + ' phút',
                            }))}
                    />
                    <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required />
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