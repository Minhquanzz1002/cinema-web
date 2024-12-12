import React, { useEffect, useState } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Admin/Modal';
import ButtonAction from '@/components/Admin/ButtonAction';
import * as Yup from 'yup';
import { OrderOverview } from '@/modules/orders/interface';
import TextArea from '@/components/Admin/TextArea';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateInOrder, formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import Select from '@/components/Admin/Select';
import { useRefundOrder } from '@/modules/orders/repository';

type ModalRefundOrderProps = {
    onClose: () => void;
    order: OrderOverview | null;
}

interface FormValues {
    reason: string;
    reasonOther: string;
}

const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Lý do không được để trống'),
});

const initialValues: FormValues = {
    reason: '',
    reasonOther: '',
};

const REFUND_REASONS = [
    { label: 'Đặt nhầm suất chiếu', value: 'Đặt nhầm suất chiếu' },
    { label: 'Đặt nhầm số lượng vé', value: 'Đặt nhầm số lượng vé' },
    { label: 'Có việc đột xuất không thể xem', value: 'Có việc đột xuất không thể xem' },
    { label: 'Khác', value: 'OTHER' },
];

const ModalRefundOrder = ({ onClose, order }: ModalRefundOrderProps) => {
    const refundOrder = useRefundOrder();

    if (!order) return null;

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await refundOrder.mutateAsync({orderId: order.id, data: values.reason === 'OTHER' ? {reason: values.reasonOther} : {reason: values.reason}});
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const FormikContent = () => {
        const { values } = useFormikContext<FormValues>();
        const [showReasonOther, setShowReasonOther] = useState(false);

        useEffect(() => {
            if (values.reason === 'OTHER') {
                setShowReasonOther(true);
            } else {
                setShowReasonOther(false);
            }
        }, [values.reason]);

        return (
            <Form>
                <Select name="reason"
                        label="Lý do"
                        options={REFUND_REASONS}
                />
                {showReasonOther && <TextArea name="reasonOther" label="Lý do khác" placeholder="Nhập lý do" />}
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={refundOrder.isPending} />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Hoàn trả đơn hàng" open={true} onClose={onClose}>
            <div className="grid grid-cols-2 gap-2">
                <div className="font-thin border rounded-lg p-3">
                    <div>
                        <strong>Mã đơn: </strong>{`#${order.code}`}
                    </div>
                    <div>
                        <strong>Thời gian đặt: </strong>{formatDateInOrder(order.orderDate)}
                    </div>
                    <div>
                        <strong>Thành tiền: </strong>{formatNumberToCurrency(order.finalAmount)}
                    </div>
                </div>

                <div className="font-thin border rounded-lg p-3">
                    <div>
                        <strong>Phim: </strong>{order.showTime.movie.title}
                    </div>
                    <div>
                        <strong>Ngày chiếu: </strong>{formatDateToLocalDate(order.showTime.startDate)}
                    </div>
                    <div>
                        <strong>Giờ chiếu: </strong>{formatTime(order.showTime.startTime)}
                    </div>
                </div>
                <div></div>
            </div>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalRefundOrder;