import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Admin/Modal';
import dayjs from 'dayjs';
import DatePicker from '@/components/Admin/DatePicker';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import * as Yup from 'yup';
import {
    AdminPromotionLineOverview,
    AdminPromotionOverview,
    PromotionLineType,
    PromotionLineTypeVietnamese,
} from '@/modules/promotions/interface';
import Input from '@/components/Admin/Input';
import { useUpdatePromotionLine } from '@/modules/promotions/repository';

type ModalAddPromotionLineProps = {
    onClose: () => void;
    promotionLine: AdminPromotionLineOverview | null;
    promotion: AdminPromotionOverview;
}

interface FormValues {
    type: PromotionLineType;
    name: string;
    code: string;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
}

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalAddPromotionLine = ({onClose, promotionLine, promotion} : ModalAddPromotionLineProps) => {
    const updatePromotionLine = useUpdatePromotionLine();

    if (!promotionLine) {
        return null;
    }

    const initialValues: FormValues = {
        startDate: dayjs(promotionLine.startDate).toDate(),
        endDate: dayjs(promotionLine.endDate).toDate(),
        status: promotionLine.status,
        code: promotionLine.code,
        name: promotionLine.name,
        type: promotionLine.type,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updatePromotionLine.mutateAsync({
                id: promotionLine.id,
                payload: {
                    ...values,
                    startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
                    endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
                }
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

        const isReadOnly = promotionLine.status === BaseStatus.ACTIVE;

        return (
            <Form>
                <Input name="code" label="Mã chương trình" required readOnly/>
                <Input name="name" label="Tên chương trình" required readOnly={isReadOnly}/>
                <Select name="type" label="Loại khuyến mãi" readOnly options={[
                    { value: PromotionLineType.CASH_REBATE, label: PromotionLineTypeVietnamese[PromotionLineType.CASH_REBATE] },
                    { value: PromotionLineType.PRICE_DISCOUNT, label: PromotionLineTypeVietnamese[PromotionLineType.PRICE_DISCOUNT] },
                    { value: PromotionLineType.BUY_TICKETS_GET_TICKETS, label: PromotionLineTypeVietnamese[PromotionLineType.BUY_TICKETS_GET_TICKETS] },
                    { value: PromotionLineType.BUY_TICKETS_GET_PRODUCTS, label: PromotionLineTypeVietnamese[PromotionLineType.BUY_TICKETS_GET_PRODUCTS] },
                ]}/>
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required maxDate={promotion.startDate} readOnly={isReadOnly}/>
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={dayjs().toDate()} maxDate={promotion.endDate} required />
                <Select name="status" label="Trạng thái" readOnly tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
                    { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                    { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                ]}/>
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={updatePromotionLine.isPending}/>
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Cập nhật chương trình khuyến mãi" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalAddPromotionLine;