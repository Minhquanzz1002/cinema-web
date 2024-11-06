import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/Admin/Modal';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import DatePicker from '@/components/Admin/DatePicker';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import ButtonAction from '@/components/Admin/ButtonAction';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useListProducts } from '@/modules/products/repository';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import useClickOutside from '@/hook/useClickOutside';
import { BaseProduct } from '@/modules/products/interface';
import { MdRemoveCircleOutline } from 'react-icons/md';
import InputCurrency from '@/components/Admin/InputCurrency';
import { useCreateProductPrice } from '@/modules/productPrices/repository';
import { NOT_FOUND_PRODUCT_IMAGE } from '@/variables/images';

type ModalAddProductPriceProps = {
    onClose: () => void;
    isOpen: boolean;
}

interface FormValues {
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    products: {
        id: number;
        code: string;
        image?: string;
        name: string;
        description: string;
        price: number;
    }[];
}

const initialValues: FormValues = {
    startDate: new Date(),
    endDate: new Date(),
    status: BaseStatus.INACTIVE,
    products: [],
};

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
    endDate: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
    products: Yup.array().of(
        Yup.object().shape({
            price: Yup.number().required('Giá không được để trống')
                .min(0, 'Giá phải lớn hơn 0')
                .max(100000000000, 'Giá phải nhỏ hơn 100 tỷ'),
        })
    ).min(1, 'Vui lòng chọn ít nhất 1 sản phẩm'),
});

const FormikContent = ({ onClose }: { onClose: () => void }) => {
    const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
    const currentDate = dayjs().toDate();
    const [search, setSearch] = useState<string>('');
    const [showListProduct, setShowListProduct] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setShowListProduct(false));
    const { data: productsSearch } = useListProducts(search);

    const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearch(newValue);
    };

    useEffect(() => {
        if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
            setFieldValue('endDate', values.startDate);
        }
    }, [values.startDate, values.endDate, setFieldValue]);

    const handleAddProduct = (product: BaseProduct) => {
        const isExist = values.products.find(p => p.id === product.id);
        if (!isExist) {
            const newProduct = {
                id: product.id,
                price: 0,
                code: product.code,
                name: product.name,
                image: product.image,
                description: product.description,
            };
            setFieldValue('products', [...values.products, newProduct]);
        }
        setShowListProduct(false);
        setSearch('');
    };

    return (
        <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DatePicker name="startDate" label="Ngày bắt đầu" minDate={currentDate} required />
                <DatePicker name="endDate" label="Ngày kết thúc" minDate={currentDate} required />
            </div>
            <Select name="status" label="Trạng thái" readOnly
                    tooltip="Trạng thái mặc định khi tạo là `Ngưng hoạt động`" options={[
                { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
            ]} />
            <div className="flex gap-2 items-center">
                <div className="font-normal text-sm cursor-pointer">Sản phẩm áp dụng:</div>
                {errors.products && touched.products && typeof errors.products === 'string' && (
                    <div className="text-red-500 text-sm">{errors.products}</div>
                )}
            </div>
            <div className="border p-2 rounded">
                <div className="flex gap-3">
                    <div className="relative w-96">
                        <input className="border rounded h-8 px-2 text-sm w-full"
                               value={search} onChange={onChangeSearchValue}
                               onClick={() => setShowListProduct(true)}
                               placeholder="Tìm theo tên hoặc mã sản phẩm" />
                        {
                            showListProduct && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border overflow-auto">
                                    {
                                        productsSearch?.map(product => {
                                            if (values.products.find(p => p.id === product.id)) return null;

                                            return (
                                                <div key={product.id} className="p-2 hover:bg-gray-100 cursor-pointer"
                                                     onClick={() => handleAddProduct(product)}>
                                                    <div className="flex gap-3">
                                                        <div
                                                            className="relative w-12 h-12 rounded border overflow-hidden">
                                                            <Image src={product.image || NOT_FOUND_PRODUCT_IMAGE} alt={`Ảnh combo ${product.name}`}
                                                                   fill
                                                                   className="object-cover" />
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-center">
                                                            <div className="text-sm font-medium line-clamp-1">
                                                                #{product.code} - {product.name} {product.name} {product.name}
                                                            </div>
                                                            <div className="text-xs line-clamp-1">
                                                                {product.description}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-center items-center">
                                                            <button className="text-brand-500"><FaPlus /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    {
                                        productsSearch?.length === 0 && (
                                            <div className="text-center text-gray-400 py-2">
                                                Không tìm thấy sản phẩm nào
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="mt-3 h-80 max-h-80 overflow-y-auto border-t">
                    <FieldArray name="products" render={arrayHelper => (
                        <div>
                            {
                                values.products.map((product, index) => (
                                    <div key={`product-${index}`}
                                         className={`flex justify-between gap-3 py-1 ${index !== 0 && 'border-t'}`}>
                                        <div className="flex gap-2">
                                            <div className="flex justify-center items-center w-8">
                                                {index + 1}
                                            </div>
                                            <div className="relative w-14 h-14 border rounded overflow-hidden">
                                                <Image src={product.image || NOT_FOUND_PRODUCT_IMAGE} alt={`Ảnh của ${product.name}`} fill
                                                       className="object-cover" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div
                                                    className="text-sm font-medium line-clamp-1">{product.code} - {product.name}</div>
                                                <div className="text-xs line-clamp-1">{product.description}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-36">
                                                <InputCurrency name={`products.${index}.price`} wrapperClassName='' placeholder="VND"/>
                                            </div>
                                            <div className="w-14 flex items-center justify-center">
                                                <button onClick={() => arrayHelper.remove(index)}>
                                                    <MdRemoveCircleOutline size={20}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )} />
                </div>
            </div>
            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit />
            </div>
        </Form>
    );
};

const ModalAddProductPrice = ({ onClose, isOpen }: ModalAddProductPriceProps) => {
    /**
     * React query
     */
    const createProductPrice = useCreateProductPrice();


    if (!isOpen) return null;

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            await createProductPrice.mutateAsync({
                startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                status: values.status,
                products: values.products.map(product => ({
                    id: product.id,
                    price: product.price,
                })),
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thêm giá" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent onClose={onClose} />
            </Formik>
        </Modal>
    );
};

export default ModalAddProductPrice;