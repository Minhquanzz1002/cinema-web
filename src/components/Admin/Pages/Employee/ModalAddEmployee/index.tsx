import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { Role } from '@/modules/roles/interface';
import DatePicker from '@/components/Admin/DatePicker';
import { EMPLOYEE_MESSAGES } from '@/variables/messages';
import { BaseStatus, Gender } from '@/modules/base/interface';
import { useCreateEmployee } from '@/modules/employees/repository';
import dayjs from 'dayjs';

type ModalAddEmployeeProps = {
    onClose: () => void;
    roles: Role[];
}

interface FormValues {
    name: string;
    gender: Gender;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    birthday: Date;
}

const INITIAL_VALUES: FormValues = {
    name: '',
    gender: Gender.MALE,
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthday: dayjs().subtract(1, 'day').toDate()
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required(EMPLOYEE_MESSAGES.FORM.REQUIRED.NAME),
    email: Yup.string()
        .email(EMPLOYEE_MESSAGES.FORM.INVALID.EMAIL)
        .required(EMPLOYEE_MESSAGES.FORM.REQUIRED.EMAIL),
    phone: Yup.string().required(EMPLOYEE_MESSAGES.FORM.REQUIRED.PHONE),
    password: Yup.string()
        .min(6, EMPLOYEE_MESSAGES.FORM.INVALID.PASSWORD)
        .required(EMPLOYEE_MESSAGES.FORM.REQUIRED.PASSWORD),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], EMPLOYEE_MESSAGES.FORM.INVALID.CONFIRM_PASSWORD)
        .required(EMPLOYEE_MESSAGES.FORM.REQUIRED.CONFIRM_PASSWORD),

});

const FormikContent = ({ onClose, roles, isLoading }:
                       {
                           onClose: () => void;
                           roles: Role[];
                           isLoading: boolean
                       }) => {
    return (
        <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input name="name" label="Tên" placeholder="Nhập tên nhân viên" required />
                <Input name="phone" label="Số điện thoại" placeholder="Nhập số điện thoại nhân viên" required />
            </div>
            <Input type="email" name="email" label="Email" placeholder="Nhập email nhân viên" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DatePicker name="birthday" label="Ngày sinh" maxDate={dayjs().subtract(1, 'day').toDate()} />
                <Select
                    name="gender" label="Giới tính"
                    options={[
                        { value: Gender.MALE, label: 'Nam' },
                        { value: Gender.FEMALE, label: 'Nữ' },
                    ]}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input type="password" name="password" label="Mật khẩu" placeholder="Nhập mật khẩu" required />
                <Input
                    type="password" name="confirmPassword" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu"
                    required />
            </div>
            <Select
                name="role" required
                placeholder="Chọn chức vụ"
                label="Chức vụ"
                options={roles.map(role => ({ label: role.description, value: role.id }))} />

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} />
            </div>
        </Form>
    );
};

const ModalAddEmployee = ({ onClose, roles }: ModalAddEmployeeProps) => {
    const createEmployee = useCreateEmployee();

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await createEmployee.mutateAsync({
                ...values,
                gender: values.gender === Gender.MALE,
                birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                status: BaseStatus.ACTIVE
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Cấp tài khoản" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent onClose={onClose} roles={roles} isLoading={createEmployee.isPending} />
            </Formik>
        </Modal>
    );
};

export default ModalAddEmployee;