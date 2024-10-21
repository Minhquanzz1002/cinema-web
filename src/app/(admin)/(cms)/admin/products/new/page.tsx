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
import UploadImage from '@/components/Admin/UploadImage';
import { useCreateProduct } from '@/modules/products/repository';
import { useRouter } from 'next/navigation';

const ProductSchema = object({
    code: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length !== 8) return this.createError({ message: 'Mã phải có đúng 8 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    name: string().required('Tên không được để trống'),
    description: string().required("Mô tả không được để trống"),
});

interface FormValues {
    code?: string;
    name: string;
    description: string;
    status: ProductStatus;
}

const initialFormValues : FormValues = {
    code: '',
    name: '',
    description: '',
    status: ProductStatus.INACTIVE,
};

const NewMoviePage = () => {
    const createProduct = useCreateProduct();
    const router = useRouter();

    useEffect(() => {
        document.title = 'B&Q Cinema - Thêm sản phẩm';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        try {
            await createProduct.mutateAsync({
                code: values.code,
                name: values.name,
                description: values.description,
                status: values.status,
                image: "https://firebasestorage.googleapis.com/v0/b/cinema-782ef.appspot.com/o/products%2Fmenuboard-coonline-2024-combo1-min_1711699834430.jpg?alt=media"
            });
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="grid grid-cols-5 gap-x-3">
                        <Card className={`p-[18px] col-span-2`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="code" label="Mã sản phẩm" placeholder="Tạo tự động nếu không nhập"
                                       tooltip="Nếu không nhập sẽ tạo tự động theo nguyên tắc CB + số thứ tự" />
                                <Input name="name" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" required/>
                                <Select name="status" label="Trạng thái" readOnly options={[
                                    { label: ProductStatusVietnamese.ACTIVE, value: ProductStatus.ACTIVE },
                                    { label: ProductStatusVietnamese.INACTIVE, value: ProductStatus.INACTIVE },
                                ]} />
                            </div>
                        </Card>

                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Mô tả</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <TextArea name="description" label="Mô tả" required/>

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
                        <ButtonIcon icon={<FaSave />} type="submit">
                            Lưu
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default NewMoviePage;