import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Admin/Modal';
import dayjs from 'dayjs';
import DatePicker from '@/components/Admin/DatePicker';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import * as Yup from 'yup';
import { AdminPromotionOverview, PromotionLineType, PromotionLineTypeVietnamese } from '@/modules/promotions/interface';
import Input from '@/components/Admin/Input';

type ModalAddPromotionLineProps = {
    onClose: () => void;
    promotion: AdminPromotionOverview | null;
}

interface FormValues {
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    price: number;
}

const initialValues: FormValues = {
    startDate: new Date(),
    endDate: new Date(),
    status: BaseStatus.INACTIVE,
    price: 0,
};

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalAddPromotionLine = ({ onClose, promotion }: ModalAddPromotionLineProps) => {

    if (!promotion) {
        return null;
    }

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {

            // onClose();
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
                <Input name="code" label="Mã khuyến mãi" placeholder="Nhập mã khuyến mãi" required />
                <Select name="type" label="Loại khuyến mãi" options={[
                    {
                        value: PromotionLineType.CASH_REBATE,
                        label: PromotionLineTypeVietnamese[PromotionLineType.CASH_REBATE],
                    },
                    {
                        value: PromotionLineType.PRICE_DISCOUNT,
                        label: PromotionLineTypeVietnamese[PromotionLineType.PRICE_DISCOUNT],
                    },
                    {
                        value: PromotionLineType.BUY_TICKETS_GET_PRODUCTS,
                        label: PromotionLineTypeVietnamese[PromotionLineType.BUY_TICKETS_GET_PRODUCTS],
                    },
                ]} />
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required />
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={dayjs().toDate()} required />
                <Select name="status" label="Trạng thái" readOnly
                        tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
                    { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                    { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                ]} />
                {
                    Array.from({ length: 2 }).map((_, index) => (
                        <Input key={index} name={`details.${index}.name`} label="Mã khuyến mãi" placeholder="Nhập mã khuyến mãi" required />
                    ))
                }
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Thêm chương trình khuyến mãi" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalAddPromotionLine;