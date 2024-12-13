import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Input from '@/components/Admin/Input';
import lodash from 'lodash';
import { PASSWORD_REGEX } from '@/variables/regex';
import { useChangePassword } from '@/modules/authentication/repository';

type ModalProfileProps = {
    onClose: () => void;
}

interface FormValues {
    currentPassword: string;
    newPassword: string;
}

const INITIAL_VALUES: FormValues = {
    currentPassword: '',
    newPassword: '',
};

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().trim()
        .matches(PASSWORD_REGEX, 'Mật khẩu phải từ 8-32 ký tự, chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt')
        .required('Mật khẩu cũ không được để trống'),
    newPassword: Yup.string().trim()
        .matches(PASSWORD_REGEX, 'Mật khẩu phải từ 8-32 ký tự, chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt')
        .required('Mật khẩu mới không được để trống'),
    repeatNewPassword: Yup.string().trim()
        .required('Xác nhận mật khẩu không được để trống')
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp'),
});

const FormikContent = ({ onClose, isLoading, values, initialValues }:
                       {
                           onClose: () => void;
                           isLoading: boolean;
                           values: FormValues;
                           initialValues: FormValues;
                       }) => {

    const isFormUnchanged = lodash.isEqual(values, initialValues);

    return (
        <Form>
            <div>
                <Input name="currentPassword" type="password" label="Mật khẩu cũ" placeholder="Nhập mật khẩu cũ" />
                <Input name="newPassword" type="password" label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" />
                <Input name="repeatNewPassword" type="password" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu mới" />
            </div>

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit text="Cập nhật" isLoading={isLoading} disabled={isFormUnchanged} />
            </div>
        </Form>
    );
};

const ModalChangePassword = ({ onClose }: ModalProfileProps) => {
    const changePassword = useChangePassword();

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await changePassword.mutateAsync({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thay đổi mật khẩu" open={true} onClose={onClose} className="!w-1/3 sm-max:!w-full">
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ values }) => (
                    <FormikContent
                        onClose={onClose}
                        isLoading={changePassword.isPending}
                        values={values}
                        initialValues={INITIAL_VALUES}
                    />
                )}
            </Formik>
        </Modal>
    );
};

export default ModalChangePassword;