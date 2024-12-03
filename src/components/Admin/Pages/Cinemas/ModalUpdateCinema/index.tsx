import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { CINEMA_MESSAGES } from '@/variables/messages/cinema.messages';
import { AdminCinemaOverview } from '@/modules/cinemas/interface';
import { useUpdateCinema } from '@/modules/cinemas/repository';

type ModalUpdateCinemaProps = {
    onClose: () => void;
    cinema: AdminCinemaOverview;
}

interface FormValues {
    name: string;
    address: string;
    hotline: string;
    status: BaseStatus;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required(CINEMA_MESSAGES.FORM.REQUIRED.NAME),
    address: Yup.string().required(CINEMA_MESSAGES.FORM.REQUIRED.ADDRESS),
    hotline: Yup.string().nullable()
});

const FormikContent = ({ onClose, isLoading }:
                       {
                           onClose: () => void;
                           isLoading: boolean
                       }) => {
    return (
        <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input name="name" label="Tên" placeholder="Nhập tên rạp" required />
                <Input name="hotline" label="Hotline" placeholder="Nhập hotline rạp" />
            </div>
            <Input name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                    name="city" label="Thành phố"
                    options={[]}
                />
                <Select
                    name="district" label="Quận/Huyện"
                    options={[]}
                />
                <Select
                    name="ward" label="Phường/Xã"
                    options={[]}
                />
            </div>
            <Select
                readOnly
                name="status" required
                placeholder="Chọn trạng thái"
                label="Trạng thái"
                options={Object.values(BaseStatus).map(status => ({label: BaseStatusVietnamese[status], value: status}))} />

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} />
            </div>
        </Form>
    );
};

const ModalUpdateCinema = ({ onClose, cinema }: ModalUpdateCinemaProps) => {
    const updateCinema = useUpdateCinema();

    const INITIAL_VALUES: FormValues = {
        name: cinema.name,
        hotline: cinema.hotline,
        address: cinema.address,
        status: cinema.status,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {

            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Cập nhật thông tin rạp" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent onClose={onClose} isLoading={updateCinema.isPending} />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateCinema;