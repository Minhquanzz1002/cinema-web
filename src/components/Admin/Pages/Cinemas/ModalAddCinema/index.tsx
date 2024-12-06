import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { CINEMA_MESSAGES } from '@/variables/messages/cinema.messages';
import { useCreateCinema } from '@/modules/cinemas/repository';
import { useAddress } from '@/hook/useAddress';

type ModalAddCinemaProps = {
    onClose: () => void;
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

const ModalAddCinema = ({ onClose }: ModalAddCinemaProps) => {
    const createCinema = useCreateCinema();
    const INITIAL_VALUES: FormValues = {
        name: '',
        hotline: '',
        address: '',
        status: BaseStatus.INACTIVE,
        city: '',
        cityCode: '',
        district: '',
        districtCode: '',
        ward: '',
        wardCode: '',
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await createCinema.mutateAsync({
                name: values.name,
                hotline: values.hotline,
                city: values.city,
                cityCode: values.cityCode,
                district: values.district,
                districtCode: values.districtCode,
                ward: values.ward,
                wardCode: values.wardCode,
                address: values.address,
                status: values.status,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thêm rạp" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent
                    onClose={onClose}
                    isLoading={createCinema.isPending}
                />
            </Formik>
        </Modal>
    );
};

export default ModalAddCinema;