'use client';
import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Input';
import Card from '@/components/Admin/Card';
import { array, mixed, object, string } from 'yup';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Select';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import UploadImage, { ImageFile } from '@/components/Admin/UploadImage';
import { useParams, useRouter } from 'next/navigation';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import Editor from '@/components/Admin/Fields/Editor';
import DatePicker from '@/components/Admin/DatePicker';
import { usePromotionByCode, useUpdatePromotion } from '@/modules/promotions/repository';
import dayjs from 'dayjs';
import Loader from '@/components/Admin/Loader';
import NotFound from '@/components/Admin/NotFound';

const PromotionSchema = object({
    name: string().required('Tên không được để trống'),
    description: string().nullable(),
    imagePortrait: array().of(
        object().shape({
            path: string().required('Hình ảnh là bắt buộc'),
            file: mixed().optional(),
        }),
    ).min(1, 'Chọn ít nhất 1 ảnh sản phẩm').required('Chọn ít nhất 1 ảnh sản phẩm'),
});

interface FormValues {
    name: string;
    description: string;
    status: BaseStatus;
    imagePortrait: ImageFile[];
    startDate: Date;
    endDate: Date;
}

const UpdatePromotionPage = () => {
    const router = useRouter();
    const updatePromotion = useUpdatePromotion();

    const { code } = useParams<{ code: string }>();
    const { data: promotion, isLoading: isLoadingPromotion } = usePromotionByCode(code);

    useEffect(() => {
        document.title = 'B&Q Cinema - Cập nhật khuyến mãi';
    }, []);

    if (isLoadingPromotion) return (
        <Loader />
    );

    if (!promotion) {
        return <NotFound />;
    }

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            const uploadedImages: string[] = [];
            await Promise.all(
                values.imagePortrait.map(async (img: ImageFile) => {
                    if (img.file) {
                        const filename = `${Date.now()}-${img.file.name}`;
                        // TODO upload image to S3
                        uploadedImages.push(filename);
                    } else {
                        uploadedImages.push(img.path);
                    }
                }),
            );

            await updatePromotion.mutateAsync({
                id: promotion.id,
                payload: {
                    ...values,
                    imagePortrait: uploadedImages[0],
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                },
            });

            router.push('/admin/promotions');
        } catch (error) {
            console.error(error);
        }
    };

    const initialFormValues: FormValues = {
        name: promotion.name,
        description: promotion.description,
        status: promotion.status,
        imagePortrait: promotion.imagePortrait ? [{ path: promotion.imagePortrait }] : [],
        startDate: dayjs(promotion.startDate).toDate(),
        endDate: dayjs(promotion.endDate).toDate(),
    };

    const getMinDate = () => {
        const startDate = dayjs(promotion.startDate);
        const today = dayjs();
        return startDate.isAfter(today) ? startDate.toDate() : today.toDate();
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={PromotionSchema}>
                <Form>
                    <div className="flex flex-col gap-5">
                        <Card className="p-[18px]">
                            <div className="flex gap-1 text-xl font-nunito font-medium">
                                <div>Mã khuyến mãi</div>
                                <div className="text-brand-500">#{promotion.code}</div>
                            </div>
                        </Card>
                        <div className="grid grid-cols-5 gap-x-3">
                            <Card className={`p-[18px] col-span-2`}>
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <Input name="name" label="Tên khuyến mãi" placeholder="Nhập tên khuyến mãi"
                                           required />
                                    <Select name="status" label="Trạng thái"
                                            readOnly={promotion.status === BaseStatus.ACTIVE} options={[
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
                                    <DatePicker name="startDate" label="Ngày bắt đầu" minDate={new Date()}
                                                readOnly={promotion.status === BaseStatus.ACTIVE} />
                                    <DatePicker name="endDate" label="Ngày kết thúc"
                                                minDate={getMinDate()} />
                                </div>
                            </Card>
                        </div>
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <div>
                                <div>
                                    <UploadImage name="imagePortrait" />
                                </div>
                            </div>
                        </Card>
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
                            <ButtonIcon icon={<FaSave />} type="submit" disabled={updatePromotion.isPending}>
                                {updatePromotion.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                            </ButtonIcon>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdatePromotionPage;