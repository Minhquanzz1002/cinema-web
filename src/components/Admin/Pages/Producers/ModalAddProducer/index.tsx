import React from 'react';
import Modal from '@/components/Admin/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Input from '@/components/Admin/Input';
import { GENRE_MESSAGES } from '@/variables/messages/genre.messages';
import { useCreateProducer } from '@/modules/producers/repository';

interface FormValues {
    name: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required(GENRE_MESSAGES.FORM.REQUIRED.NAME),
});

interface FormikContentProps {
    onClose: () => void;
    isLoading: boolean;
}

const FormikContent = ({ onClose, isLoading }: FormikContentProps) => {
    return (
        <Form>
            <Input name="name" label="Tên" placeholder="Nhập tên nhà sản xuất" required />

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} text="Lưu" />
            </div>
        </Form>
    );
};

const INITIAL_VALUES: FormValues = {
    name: '',
};

type ModalAddProducerProps = {
    onClose: () => void;
}

const ModalAddProducer = ({ onClose }: ModalAddProducerProps) => {
    const createProducerMutation = useCreateProducer();

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await createProducerMutation.mutateAsync(values);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thêm nhà sản xuất" open={true} onClose={onClose} className="!w-1/3">
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent
                    onClose={onClose}
                    isLoading={createProducerMutation.isPending}
                />
            </Formik>
        </Modal>
    );
};

export default ModalAddProducer;