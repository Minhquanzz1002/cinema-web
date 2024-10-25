'use client';
import React, { useEffect } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import Input from '@/components/Admin/Input';
import Card from '@/components/Admin/Card';
import { date, object, string } from 'yup';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Select';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import TextArea from '@/components/Admin/TextArea';
import { useCreateActor } from '@/modules/actors/repository';
import { useRouter } from 'next/navigation';
import UploadImage, { ImageFile } from '@/components/Admin/UploadImage';
import DatePicker from '@/components/Admin/DatePicker';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ActorSchema = object({
    name: string().required('Tên không được để trống'),
    code: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length !== 8) return this.createError({ message: 'Mã phải có đúng 8 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    bio: string(),
    birthday: date().nullable()
        .test('is-date-or-empty', 'Ngày sinh không hợp lệ', (value) => {
            if (value === null || value === undefined) return true;

            return !isNaN(value.getTime());
        })
        .test('is-past', 'Ngày sinh phải là ngày trong quá khứ', (value) => {
            if (value === null || value === undefined) return true;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return value < today;
        }),
    country: string(),
    status: string(),
});

interface ActorFormValues {
    name: string;
    code?: string;
    bio?: string;
    birthday?: Date;
    country?: string;
    status: BaseStatus;
    image: ImageFile[];
}

const initialFormValues: ActorFormValues = {
    name: '',
    country: '',
    bio: '',
    code: '',
    status: BaseStatus.ACTIVE,
    image: [],
};

const NewActorPage = () => {
    const createActor = useCreateActor();
    const router = useRouter();

    useEffect(() => {
        document.title = 'B&Q Cinema - Thêm diễn viên';
    }, []);

    const handleSubmit = async (values: ActorFormValues, { setSubmitting } : FormikHelpers<ActorFormValues>) => {
        console.log('submit:', values);
        try {
            const uploadedImages : string[] = [];

            await Promise.all(
                values.image.map(async (img: ImageFile) => {
                    if (img.file) {
                        const filename = `${Date.now()}-${img.file.name}`;
                        // TODO upload image to S3
                        uploadedImages.push(filename);
                    } else {
                        uploadedImages.push(img.path);
                    }
                })
            );
            const formattedBirthday = values.birthday instanceof Date ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined;

            await createActor.mutateAsync({
                ...values,
                image: uploadedImages[0],
                code: values?.code?.trim() || undefined,
                birthday: formattedBirthday,
            });
            router.push('/admin/movies/actors');
        } catch (error) {
            console.log('Create actor failed:', error);
            toast.error('Đã có lỗi xảy ra. Hãy thử lại sau');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ActorSchema}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="grid grid-cols-5 gap-x-3">
                            <Card className={`p-[18px] col-span-2`}>
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <Input name="code" label="Mã diễn viên" placeholder="Tạo tự động nếu không nhập"
                                           tooltip="Tạo tự động theo mẫu DV + mã" />
                                    <Input name="name" label="Tên" placeholder="Nhập tên diễn viên" required />
                                    <div className="grid grid-cols-2 gap-x-3 ">
                                        <DatePicker name="birthday" label="Ngày sinh" maxDate={dayjs().subtract(1, 'day').toDate()}/>
                                        <Input name="country" label="Quốc gia" placeholder="Nhập quốc gia" />
                                    </div>
                                </div>
                            </Card>

                            <Card className={`p-[18px] col-span-3`}>
                                <Typography.Title level={4}>Mô tả & Trạng thái</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <TextArea name="bio" label="Mô tả" placeholder="Nhập mô tả" />
                                    <Select name="status" label="Trạng thái" options={[
                                        { label: BaseStatusVietnamese.ACTIVE, value: BaseStatus.ACTIVE },
                                        { label: BaseStatusVietnamese.INACTIVE, value: BaseStatus.INACTIVE },
                                    ]} />
                                </div>
                            </Card>
                        </div>
                        <Card className="p-[18px] mt-5">
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <UploadImage name="image" />
                        </Card>
                        <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                            <Link href={'/admin/movies'}>
                                <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary" type="button">
                                    Hủy bỏ
                                </ButtonIcon>
                            </Link>
                            <ButtonIcon icon={<FaSave />} type="submit" disabled={isSubmitting}>
                                Lưu
                            </ButtonIcon>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default NewActorPage;