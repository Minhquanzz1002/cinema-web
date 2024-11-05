import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Admin/Modal';
import dayjs from 'dayjs';
import DatePicker from '@/components/Admin/DatePicker';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import * as Yup from 'yup';
import InputCurrency from '@/components/Admin/InputCurrency';
import { AdminProductPriceOverview } from '@/modules/productPrices/interface';
import { useUpdateProductPrice } from '@/modules/productPrices/repository';

type ModalAddProductPriceProps = {
    onClose: () => void;
    productPrice: AdminProductPriceOverview | null;
}

interface FormValues {
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    price: number;
}

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalUpdateProductPrice = ({onClose, productPrice} : ModalAddProductPriceProps) => {
    /**
     * React query
     */
    const updateProductPrice = useUpdateProductPrice();

    if (!productPrice) return null;

    const initialValues: FormValues = {
        startDate: dayjs(productPrice.startDate).toDate(),
        endDate: dayjs(productPrice.endDate).toDate(),
        status: productPrice.status,
        price: productPrice.price,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updateProductPrice.mutateAsync({
                data: {
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                    status: values.status,
                    price: values.price,
                },
                id: productPrice.id,
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

        const isReadOnly = productPrice.status === BaseStatus.ACTIVE;

        return (
            <Form>
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required readOnly={isReadOnly} />
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={dayjs().toDate()} required/>
                <InputCurrency name="price" label="Giá" placeholder="Nhập giá" required unit="VND" readOnly={isReadOnly}/>
                <Select name="status" label="Trạng thái" tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
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
        <Modal title="Cập nhật bảng giá" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateProductPrice;