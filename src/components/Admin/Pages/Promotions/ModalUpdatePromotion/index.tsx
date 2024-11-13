// components/Admin/Modal/UpdatePromotionModal.tsx
'use client';
import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
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
import ButtonAction from '@/components/Admin/ButtonAction';

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
    promotion: AdminPromotionOverview | null;
}

const FormContent = ({ onClose, promotion, isLoading }: {
    onClose: () => void;
    promotion: AdminPromotionOverview;
    isLoading: boolean
}) => {

    const { values, setFieldValue } = useFormikContext<FormValues>();
    useEffect(() => {
        if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
            setFieldValue('endDate', values.startDate);
        }
    }, [values.startDate, values.endDate, setFieldValue]);

    const getMinDate = () => {
        const startDate = dayjs(promotion?.startDate);
        const today = dayjs();
        return startDate.isAfter(today) ? startDate.toDate() : today.toDate();
    };

    const isReadOnly = promotion.status === BaseStatus.ACTIVE;

    return (
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
                            readOnly={isReadOnly}
                            required
                        />
                        <Select
                            name="status"
                            label="Trạng thái"
                            readOnly={isReadOnly}
                            options={[
                                ...Object.keys(BaseStatus).map(status => ({
                                    label: BaseStatusVietnamese[status as BaseStatus],
                                    value: status,
                                })),
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <DatePicker
                                name="startDate"
                                label="Ngày bắt đầu"
                                minDate={new Date()}
                                readOnly={isReadOnly}
                            />
                            <DatePicker
                                name="endDate"
                                label="Ngày kết thúc"
                                minDate={getMinDate()}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonIcon
                        icon={<FaSave />}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </ButtonIcon>
                </div>
            </div>
        </Form>
    );
};

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

    return (
        <Modal open={true} onClose={onClose} title={`Cập nhật khuyến mãi`}>
            <Formik
                initialValues={initialFormValues}
                onSubmit={handleSubmit}
                validationSchema={PromotionSchema}
            >
                <FormContent onClose={onClose} promotion={promotion} isLoading={updatePromotion.isPending} />
            </Formik>
        </Modal>
    );
};

export default ModalUpdatePromotion;
