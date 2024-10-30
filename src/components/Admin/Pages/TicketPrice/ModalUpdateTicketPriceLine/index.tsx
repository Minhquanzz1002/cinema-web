import React from 'react';
import { Form, Formik } from 'formik';
import dayjs from 'dayjs';
import Select from '@/components/Admin/Select';
import { BaseStatus } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import Modal from '@/components/Admin/Modal';
import * as Yup from 'yup';
import {
    AdminTicketPriceLineOverview,
    AdminTicketPriceOverview,
    ApplyForDay,
    ApplyForDayVietnamese,
} from '@/modules/ticketPrices/interface';
import TimePicker from '@/components/Admin/TimePicker';
import { useUpdateTicketPriceLine } from '@/modules/ticketPrices/repository';
import InputCurrency from '@/components/Admin/InputCurrency';
import { SeatType } from '@/modules/seats/interface';

type ModalAddTicketPriceLineProps = {
    onClose: () => void;
    ticketPrice: AdminTicketPriceOverview | null;
    ticketPriceLine: AdminTicketPriceLineOverview | null;
}

interface FormValues {
    applyForDays: ApplyForDay[];
    startTime: Date;
    endTime: Date;
    status: BaseStatus;
    normalPrice: number;
    vipPrice: number;
    couplePrice: number;
    triplePrice: number;
}

const validationSchema = Yup.object().shape({
    applyForDays: Yup.array().of(Yup.mixed<ApplyForDay>().oneOf(Object.values(ApplyForDay))).min(1, 'Chọn ít nhất một ngày áp dụng').required('Ngày áp dụng không được để trống'),
    startTime: Yup.date().required('Thời gian bắt đầu không được để trống'),
    endTime: Yup.date()
        .required('Thời gian kết thúc không được để trống')
        .test('is-after-start-time', 'Thời gian kết thúc phải sau thời gian bắt đầu', function(endTime) {
            const { startTime } = this.parent;
            if (startTime && endTime) {
                return dayjs(endTime).isAfter(dayjs(startTime));
            }
            return true;
        }),
    status: Yup.mixed<BaseStatus>()
        .oneOf(Object.values(BaseStatus), 'Trạng thái không hợp lệ')
        .required('Trạng thái không được để trống'),
});

const ModalUpdateTicketPriceLine = ({ onClose, ticketPrice, ticketPriceLine }: ModalAddTicketPriceLineProps) => {
    const updateTicketPriceLine = useUpdateTicketPriceLine();

    if (!ticketPrice || !ticketPriceLine) return null;

    const initialValues: FormValues = {
        applyForDays: ticketPriceLine.applyForDays,
        startTime: dayjs('2000-01-01 ' + ticketPriceLine.startTime).toDate(),
        endTime: dayjs('2000-01-01 ' + ticketPriceLine.endTime).toDate(),
        status: ticketPriceLine.status,
        normalPrice: ticketPriceLine.ticketPriceDetails.find(detail => detail.seatType === SeatType.NORMAL)?.price || 0,
        vipPrice: ticketPriceLine.ticketPriceDetails.find(detail => detail.seatType === SeatType.VIP)?.price || 0,
        couplePrice: ticketPriceLine.ticketPriceDetails.find(detail => detail.seatType === SeatType.COUPLE)?.price || 0,
        triplePrice: ticketPriceLine.ticketPriceDetails.find(detail => detail.seatType === SeatType.TRIPLE)?.price || 0,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updateTicketPriceLine.mutateAsync({
                ticketPriceId: ticketPrice.id,
                ticketPriceLineId: ticketPriceLine.id,
                data: {
                    applyForDays: values.applyForDays,
                    startTime: dayjs(values.startTime).format('HH:mm'),
                    endTime: dayjs(values.endTime).format('HH:mm'),
                    status: values.status,
                    normalPrice: values.normalPrice,
                    vipPrice: values.vipPrice,
                    couplePrice: values.couplePrice,
                    triplePrice: values.triplePrice,
                },
            });
            onClose();
        } catch (error) {
            console.error('Create ticket price line error:', error);
        }
    };

    const FormikContent = () => {
        return (
            <Form>
                <Select name="applyForDays" label="Ngày áp dụng" multiple options={[
                    ...Object.keys(ApplyForDay).map(day => ({
                        value: day,
                        label: ApplyForDayVietnamese[day as ApplyForDay],
                    })),
                ]} />
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <TimePicker name="startTime" label="Thời gian bắt đầu" required
                                    tooltip="Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc" />
                    </div>
                    <div>
                        <TimePicker name="endTime" label="Thời gian kết thúc" required />
                    </div>
                </div>

                <InputCurrency min={0} max={10000000} name="normalPrice" label="Giá ghế thường" unit="VND" />
                <InputCurrency min={0} name="vipPrice" label="Giá VIP" unit="VND" />
                <InputCurrency min={0} name="couplePrice" label="Giá ghế đôi" unit="VND" />
                <InputCurrency min={0} name="triplePrice" label="Giá ghế ba" unit="VND" />

                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit text="Cập nhật" isLoading={updateTicketPriceLine.isPending} />
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

export default ModalUpdateTicketPriceLine;