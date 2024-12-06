import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { CINEMA_MESSAGES } from '@/variables/messages/cinema.messages';
import { useUpdateRoom } from '@/modules/rooms/repository';

type ModalUpdateRoomProps = {
    onClose: () => void;
    cinema: {
        id: number;
        name: string;
    };
    room: {
        id: number;
        name: string;
        status: BaseStatus;
    }
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
    isReadOnly: boolean;
}

const FormikContent = ({ onClose, isLoading, isReadOnly }: FormikContentProps) => {
    return (
        <Form>
            <Input name="name" label="Tên phòng chiếu" placeholder="Nhập tên phòng chiếu" required readOnly={isReadOnly} />
            <Select
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

const ModalUpdateRoom = ({ onClose, room }: ModalUpdateRoomProps) => {
    const updateRoom = useUpdateRoom();
    const INITIAL_VALUES: FormValues = {
        name: room.name,
        status: room.status,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await updateRoom.mutateAsync({
                id: room.id,
                payload: {
                    name: values.name,
                    status: values.status,
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Cập nhật phòng chiếu" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent
                    onClose={onClose}
                    isReadOnly={room.status === BaseStatus.ACTIVE}
                    isLoading={updateRoom.isPending}
                />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateRoom;