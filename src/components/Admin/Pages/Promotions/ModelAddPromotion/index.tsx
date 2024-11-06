// components/Admin/Modal/UpdatePromotionModal.tsx
'use client';
import React from 'react';
import { Form, Formik } from 'formik';
import { object, string } from 'yup';
import Modal from '@/components/Admin/Modal';
import Input from '@/components/Admin/Input';
import Select from '@/components/Admin/Select';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import { useCreatePromotion } from '@/modules/promotions/repository';
import ButtonAction from '@/components/Admin/ButtonAction';

const PromotionSchema = object({
    code: string()
        .required('Mã không được để trống')
        .min(4, 'Mã phải có ít nhất 4 ký tự')
        .matches(/^[A-Z0-9]+$/, 'Mã phải chỉ chứa chữ in hoa và số'),
    name: string().required('Tên không được để trống'),
});

interface FormValues {
    code?: string;
    name: string;

    status: BaseStatus;

    startDate: Date;
    endDate: Date;
}

const initialFormValues: FormValues = {
    code: '',
    name: '',
    status: BaseStatus.INACTIVE,
    startDate: new Date(),
    endDate: new Date(),
};


interface UpdatePromotionModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const ModalAddPromotion = ({ onClose, isOpen }: UpdatePromotionModalProps) => {
    const createPromotion = useCreatePromotion();

    if (!isOpen) return null;

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {

            await createPromotion.mutateAsync({
                ...values,
                startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
            });

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal open={true} onClose={onClose} title={`Cập nhật khuyến mãi`}>
            <Formik
                initialValues={initialFormValues}
                onSubmit={handleSubmit}
                validationSchema={PromotionSchema}
            >
                <Form>
                    <div className="flex flex-col gap-5">
                        <div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input name="code" label="Mã khuyến mãi"
                                       placeholder="Nhập mã khuyến mãi (tối thiểu 4 ký tự)"
                                       required uppercase />

                                <Select name="status" label="Trạng thái" readOnly options={[
                                    ...Object.keys(BaseStatus).map(status => ({
                                        label: BaseStatusVietnamese[status as BaseStatus],
                                        value: status,
                                    })),
                                ]} />
                            </div>

                            <Input name="name" label="Tên khuyến mãi" placeholder="Nhập tên khuyến mãi"
                                   required />

                            <div className="grid grid-cols-2 gap-3">
                                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={new Date()} />
                                <DatePicker name="endDate" label="Ngày kết thúc" minDate={new Date()} />
                            </div>
                        </div>


                        <div className="flex justify-end items-center gap-4">
                            <ButtonAction.Cancel onClick={onClose} />
                            <ButtonIcon icon={<FaSave />} type="submit" disabled={createPromotion.isPending}>
                                Tạo mới
                            </ButtonIcon>
                        </div>
                    </div>
                </Form>
            </Formik>
        </Modal>
    );
};

export default ModalAddPromotion;
