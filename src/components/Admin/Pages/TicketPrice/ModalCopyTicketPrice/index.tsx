import React, { useEffect } from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import { AdminTicketPriceOverview } from '@/modules/ticketPrices/interface';
import { TICKET_PRICE_MESSAGES } from '@/variables/messages/ticketPrice.messages';
import { useCopyTicketPrice } from '@/modules/ticketPrices/repository';

type ModalCopyTicketPriceProps = {
    onClose: () => void;
    ticketPrice: AdminTicketPriceOverview;
}

interface FormValues {
    startDate: Date;
    endDate: Date;
}

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required(TICKET_PRICE_MESSAGES.FORM.REQUIRED.START_DATE),
    endDate: Yup.date().required(TICKET_PRICE_MESSAGES.FORM.REQUIRED.END_DATE),
});

const FormikContent = ({ onClose, isLoading }:
                       {
                           onClose: () => void;
                           isLoading: boolean;
                       }) => {
    const { values, setFieldValue } = useFormikContext<FormValues>();

    useEffect(() => {
        if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
            setFieldValue('endDate', values.startDate);
        }
    }, [values.startDate, values.endDate, setFieldValue]);

    return (
        <Form>
            <DatePicker name="startDate" label="Ngày bắt đầu" required />
            <DatePicker name="endDate" label="Ngày kết thúc" required />

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit text="Sao chép" isLoading={isLoading} />
            </div>
        </Form>
    );
};

const ModalCopyTicketPrice = ({ onClose, ticketPrice }: ModalCopyTicketPriceProps) => {
    const copyTicketPrice = useCopyTicketPrice();

    const INITIAL_VALUES: FormValues = {
        startDate: dayjs(ticketPrice.startDate).toDate() || new Date(),
        endDate: dayjs(ticketPrice.endDate).toDate() || new Date(),
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await copyTicketPrice.mutateAsync({
                id: ticketPrice.id,
                data: {
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                }
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Sao chép bảng giá" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent onClose={onClose} isLoading={copyTicketPrice.isPending} />
            </Formik>
        </Modal>
    );
};

export default ModalCopyTicketPrice;