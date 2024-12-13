import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import Input from '@/components/Admin/Input';
import { Gender, GenderVietnamese } from '@/modules/base/interface';
import { User } from '@/modules/authentication/interface';
import Image from 'next/image';
import { AVATAR_DEFAULT_IMAGE } from '@/variables/images';
import { formatRole } from '@/utils/formatString';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import { PROFILE_MESSAGES } from '@/variables/messages/profile.messages';
import lodash from 'lodash';
import { useUpdateProfile } from '@/modules/authentication/repository';

type ModalProfileProps = {
    onClose: () => void;
    profile: User;
}

interface FormValues {
    name: string;
    email: string;
    phone: string;
    birthday: Date;
    gender: Gender;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(PROFILE_MESSAGES.FORM.REQUIRED.NAME),
    email: Yup.string()
        .trim()
        .email(PROFILE_MESSAGES.FORM.INVALID.EMAIL)
        .required(PROFILE_MESSAGES.FORM.REQUIRED.EMAIL),
    phone: Yup.string()
        .trim()
        .length(10, PROFILE_MESSAGES.FORM.INVALID.PHONE)
        .required(PROFILE_MESSAGES.FORM.REQUIRED.PHONE),
    birthday: Yup.date().nullable(),
    gender: Yup.string()
        .oneOf(Object.values(Gender), PROFILE_MESSAGES.FORM.INVALID.GENDER)
        .nullable(),
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input name="name" label="Tên" placeholder="Nhập tên" required />
                <Input name="phone" label="Số điện thoại" placeholder="Nhập số điện thoại" />
            </div>
            <Input name="email" label="Email" placeholder="Nhập email" required readOnly />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DatePicker name="birthday" label="Ngày sinh" />
                <Select
                    name="gender"
                    placeholder="Chọn giới tính"
                    label="Giới tính"
                    options={Object.values(Gender).map(data => ({
                        label: GenderVietnamese[data],
                        value: data,
                    }))}
                />
            </div>

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit text="Cập nhật" isLoading={isLoading} disabled={isFormUnchanged} />
            </div>
        </Form>
    );
};

const ModalProfile = ({ onClose, profile }: ModalProfileProps) => {
    const updateProfile = useUpdateProfile();

    const INITIAL_VALUES: FormValues = {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        birthday: dayjs(profile.birthday).toDate(),
        gender: profile.gender ? Gender.MALE : Gender.FEMALE,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await updateProfile.mutateAsync({
                name: values.name,
                phone: values.phone,
                birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                gender: values.gender === Gender.MALE,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thông tin cá nhân" open={true} onClose={onClose}>
            <div className="grid sm-max:grid-cols-1 grid-cols-4 gap-5">
                <div className="flex justify-center">
                    <div>
                        <div
                            className="relative aspect-square w-40 max-w-40 rounded-full overflow-hidden border shadow"
                        >
                            <Image
                                src={profile.avatar || AVATAR_DEFAULT_IMAGE} alt={`Ảnh của ${profile.name}`} fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center font-medium mt-3">
                            <div>{profile.name}</div>
                            <div className="text-xs text-gray-800">{formatRole(profile.role)}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({ values }) => (
                            <FormikContent
                                onClose={onClose} isLoading={updateProfile.isPending} values={values} initialValues={INITIAL_VALUES}
                            />
                        )}
                    </Formik>
                </div>
            </div>
        </Modal>
    );
};

export default ModalProfile;