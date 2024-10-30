import React, { useEffect } from 'react';
import Modal from '@/components/Admin/Modal';
import Input from '@/components/Admin/Input';
import { Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import { useCreateTicketPrice } from '@/modules/ticketPrices/repository';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';

type ModalAddTicketPriceProps = {
    onClose: () => void;
}

interface FormValues {
    name: string;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
}

const initialValues: FormValues = {
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    status: BaseStatus.INACTIVE,
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalAddTicketPrice = ({ onClose }: ModalAddTicketPriceProps) => {
    const createTicketPrice = useCreateTicketPrice();

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createTicketPrice.mutateAsync({
                name: values.name,
                startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                status: values.status,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const FormikContent = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();
        useEffect(() => {
            if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
                setFieldValue('endDate', values.startDate);
            }
        }, [values.startDate, values.endDate, setFieldValue]);

        return (
            <Form>
                <Input name="name" label="Tên" placeholder="Nhập tên" required />
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required />
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={dayjs().toDate()} required/>
                <Select name="status" label="Trạng thái" readOnly tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
                    { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                    { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                ]}/>
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

export default ModalAddTicketPrice;