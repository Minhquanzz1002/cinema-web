import React, { useEffect } from 'react';
import Modal from '@/components/Admin/Modal';
import Input from '@/components/Admin/Input';
import { Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import { useUpdateTicketPrice } from '@/modules/ticketPrices/repository';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { AdminTicketPriceOverview } from '@/modules/ticketPrices/interface';

type ModalUpdateTicketPriceProps = {
    onClose: () => void;
    ticketPrice: AdminTicketPriceOverview | null;
}

interface FormValues {
    name: string;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalUpdateTicketPrice = ({ onClose, ticketPrice }: ModalUpdateTicketPriceProps) => {
    const updateTicketPrice = useUpdateTicketPrice();

    if (!ticketPrice) return null;

    const initialValues: FormValues = {
        name: ticketPrice.name,
        startDate: dayjs(ticketPrice.startDate).toDate(),
        endDate: dayjs(ticketPrice.endDate).toDate(),
        status: ticketPrice.status,
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            await updateTicketPrice.mutateAsync({
                id: ticketPrice.id,
                data: {
                    name: values.name,
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                    status: values.status,
                },
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

        const isReadOnly = ticketPrice.status === BaseStatus.ACTIVE;

        return (
            <Form>
                <Input name="name" label="Tên" placeholder="Nhập tên" required readOnly={isReadOnly}/>
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required readOnly={isReadOnly}/>
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={dayjs().toDate()} required />
                <Select name="status" label="Trạng thái" readOnly={isReadOnly} tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
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
        <>
            <Modal title="Cập nhật" open={true} onClose={onClose}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    <FormikContent />
                </Formik>
            </Modal>
        </>
    );
};

export default ModalUpdateTicketPrice;