import React, { useEffect } from 'react';
import Modal from '@/components/Admin/Modal';
import Input from '@/components/Admin/Input';
import { Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import { useUpdateTicketPrice } from '@/modules/ticketPrices/repository';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { AdminTicketPriceOverview } from '@/modules/ticketPrices/interface';

type ModalUpdateTicketPriceProps = {
    onClose: () => void;
    onSuccess: () => void;
    ticketPrice: AdminTicketPriceOverview;
}

interface FormValues {
    name: string;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const ModalUpdateTicketPrice = ({ onClose, ticketPrice, onSuccess }: ModalUpdateTicketPriceProps) => {
    const updateTicketPrice = useUpdateTicketPrice();
    // const [showConfirmModal, setShowConfirmModal] = useState(false);
    // const [formValues, setFormValues] = useState<FormValues | null>(null);

    const initialValues: FormValues = {
        name: ticketPrice.name,
        startDate: dayjs(ticketPrice.startDate).toDate(),
        endDate: dayjs(ticketPrice.endDate).toDate(),
        status: ticketPrice.status,
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            await updateTicketPrice.mutateAsync({
                id: ticketPrice.id,
                data: {
                    name: values.name,
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                    status: values.status,
                },
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    // const handleConfirmSubmit = async () => {
    //     if (formValues) {
    //         try {
    //             await updateTicketPrice.mutateAsync({
    //                 id: ticketPrice.id,
    //                 data: {
    //                     name: formValues.name,
    //                     startDate: dayjs(formValues.startDate).format('YYYY-MM-DD'),
    //                     endDate: dayjs(formValues.endDate).format('YYYY-MM-DD'),
    //                     status: formValues.status,
    //                 },
    //             });
    //             onSuccess();
    //             onClose();
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     setShowConfirmModal(false);
    // };

    const FormikContent = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();
        useEffect(() => {
            if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
                setFieldValue('endDate', values.startDate);
            }
        }, [values.startDate, values.endDate, setFieldValue]);

        const isReadOnly = ticketPrice.status === BaseStatus.ACTIVE;

        return (
            <Form>
                <Input name="name" label="Tên" placeholder="Nhập tên" required readOnly={isReadOnly}/>
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={dayjs().toDate()} required readOnly={isReadOnly}/>
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={dayjs().toDate()} required />
                <Select name="status" label="Trạng thái" readOnly={isReadOnly} tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`" options={[
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
        <>
            <Modal title="Cập nhật" open={true} onClose={onClose}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    <FormikContent />
                </Formik>
            </Modal>
            {/*{*/}
            {/*    showConfirmModal && (*/}
            {/*        <div onClick={(e) => e.stopPropagation()}>*/}
            {/*            <ModalAlert onClose={() => setShowConfirmModal(false)}*/}
            {/*                        title="Xác nhận cập nhật"*/}
            {/*                        content={`Bạn có chắc chắn muốn cập nhật giá vé này không?`}*/}
            {/*                        type="warning"*/}
            {/*                        footer={*/}
            {/*                            <div className="flex justify-center items-center gap-3 mt-4">*/}
            {/*                                <ButtonAction.Cancel onClick={() => setShowConfirmModal(false)} />*/}
            {/*                                <ButtonAction.Confirm*/}
            {/*                                    onClick={handleConfirmSubmit} />*/}
            {/*                            </div>*/}
            {/*                        }*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}
        </>
    );
};

export default ModalUpdateTicketPrice;