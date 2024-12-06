import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select, { SelectProps } from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { CINEMA_MESSAGES } from '@/variables/messages/cinema.messages';
import { AdminCinemaOverview } from '@/modules/cinemas/interface';
import { useUpdateCinema } from '@/modules/cinemas/repository';
import { useAddress } from '@/hook/useAddress';

type ModalUpdateCinemaProps = {
    onClose: () => void;
    cinema: AdminCinemaOverview;
}

interface FormValues {
    name: string;
    address: string;
    hotline: string;
    status: BaseStatus;
    city: string;
    cityCode: string;
    district: string;
    districtCode: string;
    ward: string;
    wardCode: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required(CINEMA_MESSAGES.FORM.REQUIRED.NAME),
    address: Yup.string().required(CINEMA_MESSAGES.FORM.REQUIRED.ADDRESS),
    hotline: Yup.string().nullable(),
});

interface FormikContentProps {
    onClose: () => void;
    isLoading: boolean;
}

const FormikContent = ({ onClose, isLoading }: FormikContentProps) => {
    const { cityOptions, districtOptions, wardOptions } = useAddress();

    const statusOptions: SelectProps['options'] = Object.values(BaseStatus).map(status => ({
        label: BaseStatusVietnamese[status],
        value: status,
    }));

    return (
        <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input name="name" label="Tên" placeholder="Nhập tên rạp" required />
                <Input name="hotline" label="Hotline" placeholder="Nhập hotline rạp" />
            </div>
            <Input name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                    name="cityCode" label="Thành phố"
                    options={cityOptions}
                />
                <Select
                    name="districtCode" label="Quận/Huyện"
                    options={districtOptions}
                />
                <Select
                    name="wardCode" label="Phường/Xã"
                    options={wardOptions}
                />
            </div>
            <Select
                name="status" required
                placeholder="Chọn trạng thái"
                label="Trạng thái"
                options={statusOptions}
            />

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
        cityCode: cinema.cityCode,
        city: cinema.city,
        districtCode: cinema.districtCode,
        district: cinema.district,
        wardCode: cinema.wardCode,
        ward: cinema.ward,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await updateCinema.mutateAsync({
                id: cinema.id,
                payload: {
                    name: values.name,
                    hotline: values.hotline,
                    address: values.address,
                    cityCode: values.cityCode,
                    city: values.city,
                    districtCode: values.districtCode,
                    district: values.district,
                    wardCode: values.wardCode,
                    ward: values.ward,
                    status: values.status,
                }
            });
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