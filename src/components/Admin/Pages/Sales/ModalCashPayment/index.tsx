import React, { useEffect } from 'react';
import Modal from '@/components/Admin/Modal';
import InputCurrency from '@/components/Admin/InputCurrency';
import { Form, Formik, useFormikContext } from 'formik';
import { useSaleContext } from '@/context/SaleContext';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import { useCompleteOrderByEmployee } from '@/modules/orders/repository';
import { toast } from 'react-toastify';

type ModalCashPaymentProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormValues {
    cashReceived: number;
    totalAmount: number;
    changeAmount: number;
}

const validationSchema = Yup.object().shape({
    cashReceived: Yup.number()
        .required('Vui lòng nhập số tiền khách đưa')
        .min(0, 'Số tiền không hợp lệ')
        .positive('Số tiền phải lớn hơn 0'),
});

const ModalCashPayment = ({ isOpen, onClose, onSuccess }: ModalCashPaymentProps) => {
    const { order, setOrder } = useSaleContext();
    const completeOrder = useCompleteOrderByEmployee();

    if (!order) {
        return null;
    }

    const initialValues: FormValues = {
        cashReceived: order.finalAmount,
        totalAmount: order.finalAmount,
        changeAmount: 0,
    };

    const handleSubmit = async () => {
        try {
            const { data } = await completeOrder.mutateAsync(order.id);
            setOrder(data);
            toast.success("Thanh toán thành công");
            onSuccess();
        } catch (error) {
            console.log(error);
        }
        onClose();
    };

    const FormContent = ({ onClose } : {onClose: () => void}) => {
        const { order } = useSaleContext();
        const { values } = useFormikContext<FormValues>();

        useEffect(() => {
            if (order) {
                values.changeAmount = values.cashReceived - order.finalAmount;
            }
        }, [order, values]);

        return (
            <Form>
                <InputCurrency name="cashReceived" label="Tiền khách thanh toán" unit="VND" min={order?.finalAmount} />
                <InputCurrency name="totalAmount" label="Tổng tiền thanh toán" unit="VND" readOnly />
                <InputCurrency name="changeAmount" label="Tiền thối lại" unit="VND" readOnly />

                <div className="flex justify-end gap-2 mt-3">
                    <ButtonAction.Cancel onClick={onClose}/>
                    <ButtonAction.Submit text="Xác nhận thành toán" isLoading={completeOrder.isPending} disabled={values.cashReceived < values.totalAmount}/>
                </div>
            </Form>
        );
    };

    return (
        <Modal open={isOpen} onClose={onClose} title="Thanh toán tiền mặt">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormContent onClose={onClose}/>
            </Formik>

        </Modal>
    );
};

export default ModalCashPayment;