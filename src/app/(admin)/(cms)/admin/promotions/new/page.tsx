'use client';
import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import Input from '@/components/Admin/Input';
import Card from '@/components/Admin/Card';
import { object, string } from 'yup';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Select';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';

import { useRouter } from 'next/navigation';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import Editor from '@/components/Admin/Fields/Editor';
import DatePicker from '@/components/Admin/DatePicker';
import { useCreatePromotion } from '@/modules/promotions/repository';
import dayjs from 'dayjs';

const PromotionSchema = object({
    code: string()
        .required('Mã không được để trống')
        .min(4, 'Mã phải có ít nhất 4 ký tự')
        .matches(/^[A-Z0-9]+$/, 'Mã phải chỉ chứa chữ in hoa và số'),
    name: string().required('Tên không được để trống'),
    
    
});

interface FormValues {
    code?: string;
    name: string;
    
    status: BaseStatus;
    
    startDate: Date;
    endDate: Date;
}

const initialFormValues: FormValues = {
    code: '',
    name: '',
    status: BaseStatus.INACTIVE,
    startDate: new Date(),
    endDate: new Date(),
};

const NewPromotionPage = () => {
    const router = useRouter();
    const createPromotion = useCreatePromotion();

    useEffect(() => {
        document.title = 'B&Q Cinema - Thêm khuyến mãi';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            
            await createPromotion.mutateAsync({
                ...values,
                startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
            });

            router.push('/admin/promotions');
        } catch (error) {
            console.error(error);
        }
    };

    const FormikContent = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();

        useEffect(() => {
            if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
                setFieldValue('endDate', values.startDate);
            }
        }, [values.startDate, values.endDate, setFieldValue]);

        return (
            <Form>
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-5 gap-x-3">
                        <Card className={`p-[18px] col-span-2`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="code" label="Mã khuyến mãi" placeholder="Nhập mã khuyến mãi (tối thiểu 4 ký tự)"
                                       required uppercase />
                                <Input name="name" label="Tên khuyến mãi" placeholder="Nhập tên khuyến mãi"
                                       required />
                                <Select name="status" label="Trạng thái" readOnly options={[
                                    ...Object.keys(BaseStatus).map(status => ({
                                        label: BaseStatusVietnamese[status as BaseStatus],
                                        value: status,
                                    })),
                                ]} />
                            </div>
                        </Card>

                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Thời gian</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={new Date()} />
                                <DatePicker name="endDate" label="Ngày kết thúc" minDate={new Date()} />
                            </div>
                        </Card>
                    </div>
                   
                    <Card className="p-[18px]">
                        <Typography.Title level={4}>Mô tả</Typography.Title>
                        <Editor name="description" />
                    </Card>
                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/admin/promotions'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={createPromotion.isPending}>
                            {createPromotion.isPending ? 'Đang tạo...' : 'Tạo mới'}
                        </ButtonIcon>
                    </div>
                </div>
            </Form>
        );
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={PromotionSchema}>
                <FormikContent />
            </Formik>
        </div>
    );
};

export default NewPromotionPage;