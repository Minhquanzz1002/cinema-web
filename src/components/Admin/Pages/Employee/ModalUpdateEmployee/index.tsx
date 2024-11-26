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
import { BaseStatus, BaseStatusVietnamese, Gender } from '@/modules/base/interface';
import dayjs from 'dayjs';
import { AdminEmployeeOverview } from '@/modules/employees/interface';
import { useUpdateEmployee } from '@/modules/employees/repository';
import { useAuth } from '@/hook/useAuth';

type ModalUpdateEmployeeProps = {
    onClose: () => void;
    roles: Role[];
    employee: AdminEmployeeOverview;
}

interface FormValues {
    name: string;
    gender: Gender;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    birthday: Date;
    status: BaseStatus;
    role: number;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required(EMPLOYEE_MESSAGES.FORM.REQUIRED.NAME),
    email: Yup.string()
        .email(EMPLOYEE_MESSAGES.FORM.INVALID.EMAIL)
        .required(EMPLOYEE_MESSAGES.FORM.REQUIRED.EMAIL),
    phone: Yup.string().required(EMPLOYEE_MESSAGES.FORM.REQUIRED.PHONE),
    password: Yup.string()
        .min(6, EMPLOYEE_MESSAGES.FORM.INVALID.PASSWORD),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], EMPLOYEE_MESSAGES.FORM.INVALID.CONFIRM_PASSWORD),

});

const FormikContent = ({ onClose, roles, isLoading, isReadOnly, employee }:
                       {
                           onClose: () => void;
                           roles: Role[];
                           isLoading: boolean;
                           isReadOnly: boolean;
                           employee: AdminEmployeeOverview;
                       }) => {
    const { user } = useAuth();
    return (
        <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input readOnly={isReadOnly} name="name" label="Tên" placeholder="Nhập tên nhân viên" required />
                <Input readOnly={isReadOnly} name="phone" label="Số điện thoại" placeholder="Nhập số điện thoại nhân viên" required />
            </div>
            <Input readOnly type="email" name="email" label="Email" placeholder="Nhập email nhân viên" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DatePicker readOnly={isReadOnly} name="birthday" label="Ngày sinh" maxDate={dayjs().subtract(1, 'day').toDate()} />
                <Select
                    readOnly={isReadOnly}
                    name="gender" label="Giới tính"
                    options={[
                        { value: Gender.MALE, label: 'Nam' },
                        { value: Gender.FEMALE, label: 'Nữ' },
                    ]}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                    readOnly={isReadOnly}
                    type="password" name="password" label="Mật khẩu" placeholder="Nhập mật khẩu"
                    tooltip="Để trống nếu không cập nhật" />
                <Input
                    readOnly={isReadOnly}
                    type="password" name="confirmPassword" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu"
                    tooltip="Để trống nếu không cập nhật" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select
                    readOnly
                    name="role" required
                    placeholder="Chọn chức vụ"
                    label="Chức vụ"
                    options={roles.map(role => ({ label: role.description, value: role.id }))} />

                <Select
                    readOnly={employee.id === user?.id}
                    name="status" required
                    placeholder="Chọn trạng thái"
                    label="Trạng thái"
                    options={Object.values(BaseStatus).map(status => ({
                        label: BaseStatusVietnamese[status],
                        value: status,
                    }))} />
            </div>

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} text="Cập nhật" />
            </div>
        </Form>
    );
};

const ModalUpdateEmployee = ({ onClose, roles, employee }: ModalUpdateEmployeeProps) => {
    const updateEmployee = useUpdateEmployee();
    const { user } = useAuth();
    const INITIAL_VALUES: FormValues = {
        name: employee.name,
        gender: employee.gender ? Gender.MALE : Gender.FEMALE,
        email: employee.email,
        phone: employee.phone,
        password: '',
        confirmPassword: '',
        birthday: employee?.birthday ? employee.birthday : dayjs().subtract(1, 'day').toDate(),
        status: employee.status,
        role: employee.role.id,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await updateEmployee.mutateAsync({
                id: employee.id,
                data: {
                    ...values,
                    gender: values.gender === Gender.MALE,
                    birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const isReadOnly = employee.status === BaseStatus.ACTIVE || employee.id === user?.id;

    return (
        <Modal title="Cập nhật tài khoản" open={true} onClose={onClose}>
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent
                    onClose={onClose} roles={roles} isLoading={updateEmployee.isPending} isReadOnly={isReadOnly} employee={employee} />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateEmployee;