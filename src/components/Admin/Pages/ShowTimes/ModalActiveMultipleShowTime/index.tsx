import React, { useEffect, useState } from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import { useAllRoomsByCinemaId } from '@/modules/cinemas/repository';
import { useActivateMultipleShowTime } from '@/modules/showTimes/repository';

interface Cinema {
    id: number;
    name: string;
}

type ModalActiveMultipleShowTimeProps = {
    onClose: () => void;
    movies: { id: number, title: string, duration: number } [];
    cinemas: Cinema[];
    defaultCinemaId?: number;
    defaultStartDate?: Date;
}

interface FormValues {
    roomIds: number[];
    startDate: Date;
    cinemaId: number;
    movieIds: number[];
}

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày chiếu là bắt buộc'),
    roomIds: Yup.array()
        .of(Yup.number())
        .min(1, 'Phải chọn ít nhất một phim')
        .required('Phòng chiếu không được để trống')
        .nullable(),
    movieIds: Yup.array()
        .of(Yup.number())
        .min(1, 'Phải chọn ít nhất một phim')
        .required('Phim không được để trống')
        .nullable(),
    cinemaId: Yup.number()
        .required('Cụm rạp không được để trống')
        .nullable(),
});

const ModalActiveMultipleShowTime = ({
                              onClose,
                              cinemas,
                              movies,
                              defaultCinemaId,
                              defaultStartDate,
                          }: ModalActiveMultipleShowTimeProps) => {
    const activateMultipleShowTime = useActivateMultipleShowTime();
    const [selectedCinema, setSelectedCinema] = useState<number>();
    const { data: rooms } = useAllRoomsByCinemaId(selectedCinema);

    const RoomUpdater = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();

        useEffect(() => {
            if (values.cinemaId !== selectedCinema) {
                setSelectedCinema(values.cinemaId);
                setFieldValue('room', []);
            }
        }, [values.cinemaId, setFieldValue]);

        return null;
    };

    const initialValues: FormValues = {
        startDate: defaultStartDate || new Date(),
        roomIds: rooms && rooms.length > 0 ? rooms.map(room => room.id) : [],
        cinemaId: defaultCinemaId || cinemas[0].id,
        movieIds: [],
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await activateMultipleShowTime.mutateAsync({
                cinemaId: values.cinemaId,
                startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                movieIds: values.movieIds,
                roomIds: values.roomIds,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Kích hoạt lịch chiếu đồng loạt" open={true} onClose={onClose}>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                enableReinitialize
            >
                <Form>
                    <RoomUpdater />
                    <Select required name="cinemaId" label="Cụm rạp" placeholder="Chọn rạp"
                            options={cinemas.map(cinema => ({ value: cinema.id, label: cinema.name }))}
                    />
                    <Select multiple required name="roomIds" label="Phòng chiếu" placeholder="Chọn phòng chiếu"
                            options={rooms ? rooms.map(room => ({ value: room.id, label: room.name })) : []}
                    />
                    <Select required multiple name="movieIds" label="Phim" placeholder="Chọn phim"
                            options={movies.map(movie => ({ value: movie.id, label: movie.title + ' - ' + movie.duration + ' phút' }))}
                    />
                    <DatePicker name="startDate" label="Ngày chiếu" minDate={dayjs().toDate()} required />
                    <div className="flex justify-end items-center gap-3">
                        <ButtonAction.Cancel onClick={onClose} />
                        <ButtonAction.Submit isLoading={activateMultipleShowTime.isPending} />
                    </div>
                </Form>
            </Formik>
        </Modal>
    );
};

export default ModalActiveMultipleShowTime;