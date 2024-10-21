import React from 'react';
import { Form, Formik } from 'formik';
import dayjs from 'dayjs';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import Modal from '@/components/Admin/Modal';
import * as Yup from 'yup';
import { ApplyForDay, ApplyForDayVietnamese } from '@/modules/ticketPrices/interface';
import TimePicker from '@/components/Admin/TimePicker';
import { useCreateTicketPriceLine } from '@/modules/ticketPrices/repository';

type ModalAddTicketPriceLineProps = {
    onClose: () => void;
    onSuccess: () => void;
    ticketPriceId: number;
}

interface FormValues {
    applyForDays: ApplyForDay[];
    startTime: Date;
    endTime: Date;
    status: BaseStatus;
}

const getCurrentTimeOnBaseDate = (): Date => {
    const now = dayjs();
    return dayjs('2000-01-01')
        .hour(now.hour())
        .minute(now.minute())
        .second(0)
        .millisecond(0)
        .toDate();
};

const initialValues: FormValues = {
    applyForDays: [],
    startTime: getCurrentTimeOnBaseDate(),
    endTime: getCurrentTimeOnBaseDate(),
    status: BaseStatus.INACTIVE,
};

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

const ModalAddTicketPriceLine = ({ onClose, ticketPriceId }: ModalAddTicketPriceLineProps) => {
    const saveTicketPriceLine = useCreateTicketPriceLine();

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await saveTicketPriceLine.mutateAsync({
                ticketPriceId: ticketPriceId,
                data: {
                    applyForDays: values.applyForDays,
                    startTime: dayjs(values.startTime).format('HH:mm'),
                    endTime: dayjs(values.endTime).format('HH:mm'),
                    status: values.status
                }
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
                    { value: ApplyForDay.MONDAY, label: ApplyForDayVietnamese[ApplyForDay.MONDAY] },
                    { value: ApplyForDay.TUESDAY, label: ApplyForDayVietnamese[ApplyForDay.TUESDAY] },
                    { value: ApplyForDay.WEDNESDAY, label: ApplyForDayVietnamese[ApplyForDay.WEDNESDAY] },
                    { value: ApplyForDay.THURSDAY, label: ApplyForDayVietnamese[ApplyForDay.THURSDAY] },
                    { value: ApplyForDay.FRIDAY, label: ApplyForDayVietnamese[ApplyForDay.FRIDAY] },
                    { value: ApplyForDay.SATURDAY, label: ApplyForDayVietnamese[ApplyForDay.SATURDAY] },
                    { value: ApplyForDay.SUNDAY, label: ApplyForDayVietnamese[ApplyForDay.SUNDAY] },
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

                <Select name="status" label="Trạng thái" options={[
                    { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                    { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                ]} />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit />
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

export default ModalAddTicketPriceLine;