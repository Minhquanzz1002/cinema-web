import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useCreateTicketPriceDetail } from '@/modules/ticket-price-lines/repository';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';
import InputCurrency from '@/components/Admin/InputCurrency';

type ModalAddTicketPriceProps = {
    onClose: () => void;
    onSuccess: () => void;
    lineId: number;
}

interface FormValues {
    seatType: SeatType;
    price: number;
    status: BaseStatus;
}

const initialValues: FormValues = {
    seatType: SeatType.NORMAL,
    price: 0,
    status: BaseStatus.ACTIVE,
};

const validationSchema = Yup.object().shape({
    seatType: Yup.string()
        .oneOf(Object.values(SeatType), 'Loại ghế không hợp lệ')
        .required('Loại ghế không được để trống'),
    price: Yup.number()
        .min(0, 'Giá vé không được âm')
        .required('Giá vé không được để trống'),
    status: Yup.string()
        .oneOf(Object.values(BaseStatus), 'Trạng thái không hợp lệ')
        .required('Trạng thái không được để trống'),
});

const ModalAddTicketPriceDetail = ({ onClose, lineId }: ModalAddTicketPriceProps) => {
    const createTicketPriceDetail = useCreateTicketPriceDetail();

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createTicketPriceDetail.mutateAsync({
                lineId,
                data: {
                    seatType: values.seatType,
                    price: values.price,
                    status: values.status,
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const FormikContent = () => {
        return (
            <Form>
                <Select name="seatType" label="Loại ghế" options={[
                    { value: SeatType.NORMAL, label: SeatTypeVietnamese[SeatType.NORMAL] },
                    { value: SeatType.VIP, label: SeatTypeVietnamese[SeatType.VIP] },
                    { value: SeatType.COUPLE, label: SeatTypeVietnamese[SeatType.COUPLE] },
                    { value: SeatType.TRIPLE, label: SeatTypeVietnamese[SeatType.TRIPLE] },
                ]} />
                <InputCurrency name="price" label="Giá vé" required unit="VND" />
                <Select name="status" label="Trạng thái" tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`"
                        options={[
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
        <Modal title="Thêm chi tiết giá" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalAddTicketPriceDetail;