import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { CINEMA_MESSAGES } from '@/variables/messages/cinema.messages';
import { useCreateRoom } from '@/modules/rooms/repository';

type ModalAddRoomProps = {
    onClose: () => void;
    cinema: {
        id: number;
        name: string;
    };
}

interface FormValues {
    name: string;
    status: BaseStatus;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(CINEMA_MESSAGES.FORM.REQUIRED.NAME),
});

interface FormikContentProps {
    onClose: () => void;
    isLoading: boolean;
}

const FormikContent = ({ onClose, isLoading }: FormikContentProps) => {
    return (
        <Form>
            <Input name="name" label="Tên phòng chiếu" placeholder="Nhập tên phòng chiếu" required />
            <Select
                readOnly
                name="status" required
                placeholder="Chọn trạng thái"
                label="Trạng thái"
                options={Object.values(BaseStatus).map(status => ({
                    label: BaseStatusVietnamese[status],
                    value: status,
                }))}
            />

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} />
            </div>
        </Form>
    );
};

const ModalAddRoom = ({ onClose, cinema }: ModalAddRoomProps) => {
    const createRoom = useCreateRoom();
    const INITIAL_VALUES: FormValues = {
        name: '',
        status: BaseStatus.INACTIVE,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await createRoom.mutateAsync({
                name: values.name,
                status: values.status,
                cinemaId: cinema.id,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thêm phòng chiếu" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent
                    onClose={onClose}
                    isLoading={createRoom.isPending}
                />
            </Formik>
        </Modal>
    );
};

export default ModalAddRoom;