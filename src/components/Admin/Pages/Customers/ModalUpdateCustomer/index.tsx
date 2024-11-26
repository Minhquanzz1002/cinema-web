import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select, { SelectProps } from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import DatePicker from '@/components/Admin/DatePicker';
import { EMPLOYEE_MESSAGES } from '@/variables/messages';
import { Gender } from '@/modules/base/interface';
import dayjs from 'dayjs';
import { AdminCustomerOverview } from '@/modules/customers/interface';
import { UserStatus, UserStatusVietnamese } from '@/modules/authentication/interface';
import { useUpdateCustomer } from '@/modules/customers/repository';

type ModalUpdateCustomerProps = {
    onClose: () => void;
    customer: AdminCustomerOverview;
}

interface FormValues {
    name: string;
    gender: Gender;
    email: string;
    phone: string;
    birthday: Date;
    status: UserStatus;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required(EMPLOYEE_MESSAGES.FORM.REQUIRED.NAME),
    email: Yup.string()
        .email(EMPLOYEE_MESSAGES.FORM.INVALID.EMAIL)
        .required(EMPLOYEE_MESSAGES.FORM.REQUIRED.EMAIL),
    phone: Yup.string().required(EMPLOYEE_MESSAGES.FORM.REQUIRED.PHONE),

});

interface FormikContentProps {
    onClose: () => void;
    isLoading: boolean;
    isReadOnly: boolean;
}

const FormikContent = ({ onClose, isLoading, isReadOnly }: FormikContentProps) => {
    const statusOptions: SelectProps['options'] = Object.values(UserStatus).map(status => ({
        label: UserStatusVietnamese[status],
        value: status,
    }));

    return (
        <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input readOnly={isReadOnly} name="name" label="Tên" placeholder="Nhập tên nhân viên" required />
                <Input
                    readOnly={isReadOnly} name="phone" label="Số điện thoại" placeholder="Nhập số điện thoại nhân viên"
                    required
                />
            </div>
            <Input readOnly type="email" name="email" label="Email" placeholder="Nhập email nhân viên" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DatePicker
                    readOnly={isReadOnly} name="birthday" label="Ngày sinh"
                    maxDate={dayjs().subtract(1, 'day').toDate()}
                />
                <Select
                    readOnly={isReadOnly}
                    name="gender" label="Giới tính"
                    options={[
                        { value: Gender.MALE, label: 'Nam' },
                        { value: Gender.FEMALE, label: 'Nữ' },
                    ]}
                />
            </div>
            <Select
                name="status" required
                placeholder="Chọn trạng thái"
                label="Trạng thái"
                options={statusOptions}
            />

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} text="Cập nhật" />
            </div>
        </Form>
    );
};

const ModalUpdateCustomer = ({ onClose, customer }: ModalUpdateCustomerProps) => {
    const updateCustomer = useUpdateCustomer();
    const INITIAL_VALUES: FormValues = {
        name: customer.name,
        gender: customer.gender ? Gender.MALE : Gender.FEMALE,
        email: customer.email,
        phone: customer.phone,
        birthday: customer?.birthday ? customer.birthday : dayjs().subtract(1, 'day').toDate(),
        status: customer.status,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await updateCustomer.mutateAsync({
                id: customer.id,
                data: {
                    name: values.name,
                    gender: values.gender === Gender.MALE,
                    birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                    phone: values.phone,
                    status: values.status,
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const isReadOnly = customer.status === UserStatus.ACTIVE;

    return (
        <Modal title="Cập nhật tài khoản khách hàng" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent
                    onClose={onClose} isLoading={updateCustomer.isPending} isReadOnly={isReadOnly}
                />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateCustomer;