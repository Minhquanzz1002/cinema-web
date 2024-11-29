'use client';
import React, { useEffect } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Input';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import TextArea from '@/components/Admin/TextArea';
import Select from '@/components/Admin/Select';
import UploadImage, { ImageFile } from '@/components/Admin/UploadImage';
import Link from '@/components/Link';
import { ButtonIcon } from '@/components/Admin/Button';
import { TiArrowBackOutline } from 'react-icons/ti';
import { FaSave } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { date, object, string } from 'yup';
import { toast } from 'react-toastify';
import Loader from '@/components/Admin/Loader';
import NotFound from '@/components/Admin/NotFound';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useDirectorByCode, useUpdateDirector } from '@/modules/directors/repository';

const DirectorSchema = object({
    name: string().required('Tên không được để trống'),
    bio: string().nullable(),
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
    country: string().nullable(),
    status: string(),
});

interface FormValues {
    name: string;
    bio?: string;
    birthday?: Date;
    country?: string;
    status: BaseStatus;
    image: ImageFile[];
}

const UpdateDirectorPage = () => {
    const router = useRouter();
    const { code } = useParams<{ code: string }>();
    const updateDirector = useUpdateDirector();
    const { data: director, isLoading } = useDirectorByCode(code);

    useEffect(() => {
        document.title = 'B&Q Cinema - Cập nhật đạo diễn';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!director) {
        return <NotFound />;
    }

    const initialFormValues: FormValues = {
        name: director.name,
        country: director.country,
        birthday: director.birthday ? new Date(director.birthday) : undefined,
        bio: director.bio,
        status: director.status,
        image: director.image ? [{ path: director.image }] : [],
    };

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        console.log('submit:', values);
        try {
            const uploadedImages: string[] = [];

            await Promise.all(
                values.image.map(async (img: ImageFile) => {
                    if (img.file) {
                        const filename = `${Date.now()}-${img.file.name}`;
                        // TODO upload image to S3
                        uploadedImages.push(filename);
                    } else {
                        uploadedImages.push(img.path);
                    }
                }),
            );
            const formattedBirthday = values.birthday instanceof Date ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined;

            await updateDirector.mutateAsync({
                id: director.id,
                data: {
                    ...values,
                    image: uploadedImages[0],
                    birthday: formattedBirthday,
                },
            });
            router.push('/admin/movies/directors');
        } catch (error) {
            console.log('Update director failed:', error);
            toast.error('Đã có lỗi xảy ra. Hãy thử lại sau');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-5">
            <Card className="p-[18px]">
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 text-xl font-nunito font-medium">
                        <div>Mã diễn viên</div>
                        <div className="text-brand-500">#{director.code}</div>
                    </div>
                </div>
            </Card>
            <Formik
                initialValues={initialFormValues} onSubmit={handleSubmit}
                validationSchema={DirectorSchema}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="grid grid-cols-5 gap-x-3">
                            <Card className={`p-[18px] col-span-2`}>
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <Input name="name" label="Tên" placeholder="Nhập tên diễn viên" required />
                                    <div className="grid grid-cols-2 gap-x-3 ">
                                        <DatePicker
                                            name="birthday" label="Ngày sinh"
                                            maxDate={dayjs().subtract(1, 'day').toDate()}
                                        />
                                        <Input name="country" label="Quốc gia" placeholder="Nhập quốc gia" />
                                    </div>
                                </div>
                            </Card>

                            <Card className={`p-[18px] col-span-3`}>
                                <Typography.Title level={4}>Mô tả & Trạng thái</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <TextArea name="bio" label="Mô tả" placeholder="Nhập mô tả" />
                                    <Select
                                        name="status" label="Trạng thái" options={[
                                        ...Object.keys(BaseStatus).map(status => ({
                                            label: BaseStatusVietnamese[status as BaseStatus],
                                            value: status,
                                        })),
                                    ]}
                                    />
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
                                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                            </ButtonIcon>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateDirectorPage;