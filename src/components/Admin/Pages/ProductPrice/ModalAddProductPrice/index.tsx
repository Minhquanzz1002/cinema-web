import React, { useEffect } from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';

type ModalAddProductPriceProps = {
    onClose: () => void;
    isOpen: boolean;
}

interface FormValues {
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
}

const initialValues: FormValues = {
    startDate: new Date(),
    endDate: new Date(),
    status: BaseStatus.INACTIVE,
};

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalAddProductPrice = ({ onClose, isOpen }: ModalAddProductPriceProps) => {
    if (!isOpen) return null;

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {

            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const FormikContent = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();
        const currentDate = dayjs().toDate();

        useEffect(() => {
            if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
                setFieldValue('endDate', values.startDate);
            }
        }, [values.startDate, values.endDate, setFieldValue]);

        return (
            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DatePicker name="startDate" label="Ngày bắt đầu" minDate={currentDate} required />
                    <DatePicker name="endDate" label="Ngày kết thúc" minDate={currentDate} required />
                </div>
                <Select name="status" label="Trạng thái" readOnly
                        tooltip="Trạng thái mặc định khi tạo là `Ngưng hoạt động`" options={[
                    { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                    { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                ]} />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit />
                </div>
            </Form>
        );
    };

    return (
        <Modal title="Thêm giá" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalAddProductPrice;