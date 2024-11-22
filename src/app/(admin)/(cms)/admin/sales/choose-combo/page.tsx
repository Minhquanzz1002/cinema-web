'use client';

import React, { useEffect } from 'react';
import { useSaleContext } from '@/context/SaleContext';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import NotFound from '@/components/Admin/NotFound';
import { useAllProductsForSale } from '@/modules/products/repository';
import Loader from '@/components/Admin/Loader';
import { BaseProductWithPrice } from '@/modules/products/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import BookingDetails from '@/components/Admin/BookingDetails';
import { NOT_FOUND_PRODUCT_IMAGE } from '@/variables/images';

const CardProduct = ({ product }: { product: BaseProductWithPrice }) => {
    const { selectedProducts, addProduct, updateProductQuantity } = useSaleContext();

    const currentItem = selectedProducts.find((item) => item.product.id === product.id);
    const currentQuantity = currentItem?.quantity || 0;

    const handleIncrease = () => {
        if (currentQuantity === 0) {
            addProduct(product);
        } else {
            updateProductQuantity(product.id, currentQuantity + 1);
        }
    };

    const handleDecrease = () => {
        if (currentQuantity > 0) {
            updateProductQuantity(product.id, currentQuantity - 1);
        }
    };

    return (
        <div>
            <div className="flex gap-2 p-2 rounded-lg">
                <div className="relative w-36 h-20 border rounded overflow-hidden shadow">
                    <Image src={product.image || NOT_FOUND_PRODUCT_IMAGE} alt={`Ảnh sản phẩm ${product.name}`} fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div className="flex flex-col justify-around">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs">{product.description}</div>
                            <div
                                className="font-bold text-[#4a4a4a]">Giá: {formatNumberToCurrency(product.price!)}</div>
                        </div>
                        <div className="self-end">
                            <div className="flex gap-3 rounded shadow px-2 h-8">
                                <button onClick={handleDecrease}><FaMinus /></button>
                                <div className="flex justify-center items-center w-10 text-sm">{currentQuantity}</div>
                                <button onClick={handleIncrease}><FaPlus /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminChooseComboPage = () => {
    const { isLoadingRedirect } = useSaleContext();
    const { movie, showTime, selectedSeats, proceedToPaymentSelection, selectedProducts } = useSaleContext();
    const { data: products, isLoading: isLoadingProducts } = useAllProductsForSale();

    useEffect(() => {
        document.title = 'B&Q Cinema - Chọn combo';
    }, []);

    if (isLoadingProducts) {
        return <Loader />;
    }

    if (!movie || !showTime || !products) {
        return <NotFound />;
    }

    return (
        <div className="mt-2">
            <div className="flex gap-2">
                <div className="w-4/6 bg-white rounded-lg p-3">
                    <Typography.Title level={4}>Chọn combo bắp & nước</Typography.Title>
                    <div className="overflow-auto max-h-[500px]">
                        <div className="flex flex-col gap-4">
                            {
                                products.map((product) => (
                                    <CardProduct key={product.id} product={product} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <BookingDetails movie={movie} showTime={showTime}
                                selectedSeats={selectedSeats}
                                selectedProducts={selectedProducts}
                                footer={
                                    <div className="flex justify-end gap-5 items-center mt-5">
                                        <button
                                            className="text-brand-500 py-2 px-5 rounded flex items-center justify-center gap-x-2">
                                            Quay lại
                                        </button>
                                        <button disabled={selectedSeats.length === 0 || isLoadingRedirect}
                                                onClick={proceedToPaymentSelection}
                                                className="disabled:bg-brand-200 bg-brand-500 py-2 px-5 rounded flex items-center justify-center text-white gap-x-2">
                                            {isLoadingProducts ? 'Đang xử lý...' : 'Tiếp tục'}
                                        </button>
                                    </div>
                                }
                />
            </div>
        </div>
    );
};

export default AdminChooseComboPage;