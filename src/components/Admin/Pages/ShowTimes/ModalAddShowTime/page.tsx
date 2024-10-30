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
import { useCreateShowTime } from '@/modules/showTimes/repository';

interface Room {
    id: number;
    name: string;
}

interface Cinema {
    id: number;
    name: string;
}

type ModalAddShowTimeProps = {
    isOpen: boolean;
    onClose: () => void;
    movies: { id: number, title: string, duration: number } [];
    cinemas: Cinema[];
    rooms: { id: number, name: string } [];
    defaultRoom?: Room;
    defaultCinemaId?: number;
    defaultStartTime?: Date;
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

const ModalAddShowTime = ({
                              onClose,
                              isOpen,
                              cinemas,
                              movies,
                              rooms,
                              defaultRoom,
                              defaultCinemaId,
                              defaultStartTime,
                          }: ModalAddShowTimeProps) => {
    const createShowTime = useCreateShowTime();
    if (!isOpen) return null;

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
        startDate: new Date(),
        startTime: defaultStartTime,
        room: defaultRoom?.id,
        cinema: defaultCinemaId,
        status: BaseStatus.INACTIVE,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createShowTime.mutateAsync({
                movieId: values.movie!,
                cinemaId: values.cinema!,
                roomId: values.room!,
                startTime: dayjs(values.startTime).format('HH:mm'),
                endTime: dayjs(values.endTime).format('HH:mm'),
                startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                status: values.status,
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
                            options={movies.map(movie => ({ value: movie.id, label: movie.title + ' - ' + movie.duration + ' phút' }))}
                    />
                    <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required />
                    <div className="grid grid-cols-2 gap-3">
                        <TimePicker label="Thời gian bắt đầu" name="startTime" required />
                        <TimePicker label="Thời gian kết thúc" name="endTime" required />
                    </div>
                    <Select name="status" label="Trạng thái" readOnly
                            tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
                        { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                        { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
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

export default ModalAddShowTime;