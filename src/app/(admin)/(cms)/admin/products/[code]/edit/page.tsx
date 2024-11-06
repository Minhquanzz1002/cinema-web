'use client';
import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Input';
import Card from '@/components/Admin/Card';
import { object, string } from 'yup';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Select';
import { ButtonIcon } from '@/components/Admin/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import { ProductStatus, ProductStatusVietnamese } from '@/modules/products/interface';
import TextArea from '@/components/Admin/TextArea';
import UploadImage, { ImageFile } from '@/components/Admin/UploadImage';
import { useProductByCode, useUpdateProduct } from '@/modules/products/repository';
import { useParams, useRouter } from 'next/navigation';
import NotFound from '@/components/Admin/NotFound';
import Loader from '@/components/Admin/Loader';

const ProductSchema = object({
    name: string().required('Tên không được để trống'),
    description: string().required('Mô tả không được để trống'),
});

interface FormValues {
    name?: string;
    description?: string;
    status: ProductStatus;
    image: ImageFile[];
}

const EditMoviePage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: product, isLoading } = useProductByCode(code);
    const updateProduct = useUpdateProduct();

    const router = useRouter();

    useEffect(() => {
        document.title = 'B&Q Cinema - Thêm sản phẩm';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!product) return <NotFound />;

    const initialFormValues: FormValues = {
        name: product.name,
        description: product.description,
        status: product.status,
        image: product?.image ? [{ path: product.image }] : [],
    };


    const handleSubmit = async (values: FormValues) => {
        try {
            await updateProduct.mutateAsync({
                code,
                data: {
                    name: values.name,
                    description: values.description,
                    status: values.status,
                },
            });
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
        }
    };

    const isReadOnly = product.status === ProductStatus.ACTIVE;

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <Card className="p-[18px]">
                        <div className="flex gap-1 text-xl font-nunito font-medium">
                            <div>Mã sản phẩm</div>
                            <div className="text-brand-500">#{product.code}</div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-5 gap-x-3 mt-4">
                        <Card className={`p-[18px] col-span-2`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="name" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" required
                                       readOnly={isReadOnly} />
                                <Select name="status" label="Trạng thái" options={[
                                    { label: ProductStatusVietnamese.ACTIVE, value: ProductStatus.ACTIVE },
                                    { label: ProductStatusVietnamese.INACTIVE, value: ProductStatus.INACTIVE },
                                ]} />
                            </div>
                        </Card>

                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Mô tả</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <TextArea name="description" label="Mô tả" required readOnly={isReadOnly} />
                            </div>
                        </Card>
                    </div>
                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <div>
                                <UploadImage name="image" />
                            </div>
                        </Card>
                    </div>
                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/admin/products'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={updateProduct.isPending}>
                            Cập nhật
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default EditMoviePage;