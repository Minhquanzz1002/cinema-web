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
import { useUpdatePromotion } from '@/modules/promotions/repository';
import dayjs from 'dayjs';
import { AdminPromotionOverview } from '@/modules/promotions/interface';

const PromotionSchema = object({
    name: string().required('Tên không được để trống'),
});

interface FormValues {
    name: string;
    status: BaseStatus;
    startDate: Date;
    endDate: Date;
}

interface UpdatePromotionModalProps {
    onClose: () => void;
    promotion: AdminPromotionOverview | null; // Replace with your Promotion interface
}

const ModalUpdatePromotion = ({ onClose, promotion }: UpdatePromotionModalProps) => {
    const updatePromotion = useUpdatePromotion();

    if (!promotion) return null;

    const handleSubmit = async (values: FormValues) => {
        try {
            await updatePromotion.mutateAsync({
                id: promotion.id,
                payload: {
                    ...values,
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                },
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const initialFormValues: FormValues = {
        name: promotion?.name || '',
        status: promotion?.status || BaseStatus.ACTIVE,
        startDate: promotion?.startDate ? dayjs(promotion.startDate).toDate() : new Date(),
        endDate: promotion?.endDate ? dayjs(promotion.endDate).toDate() : new Date(),
    };

    const getMinDate = () => {
        const startDate = dayjs(promotion?.startDate);
        const today = dayjs();
        return startDate.isAfter(today) ? startDate.toDate() : today.toDate();
    };

    return (
        <Modal open={true} onClose={onClose} title={`Cập nhật khuyến mãi`}>
            <Formik
                initialValues={initialFormValues}
                onSubmit={handleSubmit}
                validationSchema={PromotionSchema}
            >
                <Form>
                    <div>
                        <div className="mb-4">
                            <div className="font-nunito flex gap-1 font-medium">
                                <div>Mã khuyến mãi</div>
                                <div className="text-brand-500">#{promotion?.code}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Input
                                    name="name"
                                    label="Tên khuyến mãi"
                                    placeholder="Nhập tên khuyến mãi"
                                    required
                                />
                                <Select
                                    name="status"
                                    label="Trạng thái"
                                    readOnly={promotion?.status === BaseStatus.ACTIVE}
                                    options={[
                                        ...Object.keys(BaseStatus).map(status => ({
                                            label: BaseStatusVietnamese[status as BaseStatus],
                                            value: status,
                                        })),
                                    ]}
                                />
                                <DatePicker
                                        name="startDate"
                                        label="Ngày bắt đầu"
                                        minDate={new Date()}
                                        readOnly={promotion?.status === BaseStatus.ACTIVE}
                                    />
                                    <DatePicker
                                        name="endDate"
                                        label="Ngày kết thúc"
                                        minDate={getMinDate()}
                                    />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-4">
                            <ButtonIcon
                                icon={<FaSave />}
                                variant="secondary"
                                onClick={onClose}
                                type="button"
                            >
                                Hủy bỏ
                            </ButtonIcon>
                            <ButtonIcon
                                icon={<FaSave />}
                                type="submit"
                                disabled={updatePromotion.isPending}
                            >
                                {updatePromotion.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                            </ButtonIcon>
                        </div>
                    </div>
                </Form>
            </Formik>
        </Modal>
    );
};

export default ModalUpdatePromotion;
