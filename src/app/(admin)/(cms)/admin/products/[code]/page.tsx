'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { ProductPriceHistory, ProductStatusVietnamese } from '@/modules/products/interface';
import { useParams } from 'next/navigation';
import { useAllProductPriceHistories, useDeleteProductPrice, useProductByCode } from '@/modules/products/repository';
import Table from '@/components/Admin/Tables';
import { ColumnDef, Row } from '@tanstack/table-core';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Loader from '@/components/Admin/Loader';
import ItemInfo from '@/components/Admin/ItemInfo';
import ButtonAction from '@/components/Admin/ButtonAction';
import ModalAddProductPrice from '@/components/Admin/Pages/Product/ModalAddProductPrice';
import { toast } from 'react-toastify';
import ModalAlert from '@/components/Admin/ModalAlert';
import ModalUpdateProductPrice from '@/components/Admin/Pages/Product/ModalUpdateProductPrice';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';

interface ProductPriceFilter extends PaginationState {
    status: BaseStatus | 'ALL';
}

const ProductDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: product } = useProductByCode(code);

    const [productPriceToDelete, setProductPriceToDelete] = useState<ProductPriceHistory | null>(null);
    const deleteProductPrice = useDeleteProductPrice();

    const [showModalAddProductPrice, setShowModalAddProductPrice] = useState(false);
    const [productPriceToUpdate, setProductPriceToUpdate] = useState<ProductPriceHistory | null>(null);

    const [filters, setFilters] = useState<ProductPriceFilter>({
        page: 1,
        status: 'ALL',
    });

    const productPricesQuery = useAllProductPriceHistories({
        code,
        page: filters.page - 1,
        status: filters.status === 'ALL' ? undefined : filters.status
    });

    const {
        data: histories,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange
    } = useFilterPagination({
        queryResult: productPricesQuery,
        initialFilters: filters,
        onFilterChange: setFilters
    });


    useEffect(() => {
        document.title = 'B&Q Cinema - Chi tiết sản phẩm';
    }, []);

    const handleClickDeleteProductPrice = (row: Row<ProductPriceHistory>) => {
        if (row.original.status === 'ACTIVE') {
            toast.warning('Không thể bảng giá đang hoạt động');
            return;
        } else {
            setProductPriceToDelete(row.original);
        }
    };

    const handleDeleteProductPrice = async (productPrice: ProductPriceHistory) => {
        await deleteProductPrice.mutateAsync({
            code,
            id: productPrice.id,
        });
        setProductPriceToDelete(null);
    };

    const columns = useMemo<ColumnDef<ProductPriceHistory>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
            },
            {
                accessorKey: 'startDate',
                cell: ({ row }) => formatDateToLocalDate(row.original.startDate),
                header: 'Ngày bắt đầu',
            },
            {
                accessorKey: 'endDate',
                cell: ({ row }) => formatDateToLocalDate(row.original.endDate),
                header: 'Ngày kết thúc',
            },
            {
                accessorKey: 'price',
                cell: ({ row }) => <span className="text-nowrap">{formatNumberToCurrency(row.original.price)}</span>,
                header: 'Số tiền',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center">
                        <ButtonAction.Update onClick={() => setProductPriceToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => handleClickDeleteProductPrice(row)} />
                    </div>
                ),
                header: '',
            },
        ],
        [],
    );

    if (!product) return (
        <Loader />
    );

    return (
        <>
            <div className="mt-5 flex flex-col gap-4">
                <Card className="p-[18px]">
                    <div className="flex gap-1 text-xl font-nunito font-medium">
                        <div>Mã sản phẩm</div>
                        <div className="text-brand-500">#{product.code}</div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <Card className="p-[18px]">
                        <Typography.Title level={4}>Hình ảnh</Typography.Title>
                        <div className="relative aspect-square rounded overflow-hidden">
                            <Image
                                src={product.image || 'https://firebasestorage.googleapis.com/v0/b/cinema-782ef.appspot.com/o/products%2Fmenuboard-coonline-2024-combo1-min_1711699834430.jpg?alt=media'}
                                alt={`Hình ảnh của ${product.name}`} fill className="object-cover" />
                        </div>
                    </Card>
                    <Card className="p-[18px] lg:col-span-4">
                        <Typography.Title level={4}>Thông tin chung</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo label="Tên" value={product.name} />
                            <ItemInfo label="Giá hiện tại"
                                      value={product.price ? formatNumberToCurrency(product.price) : 'Chưa cập nhật'} />
                            <ItemInfo label="Mô tả" value={product.description} />
                            <ItemInfo label="Trạng thái" value={ProductStatusVietnamese[product.status]} />
                        </div>
                    </Card>
                </div>

                <Card className="py-4">
                    <div className="flex justify-between items-center px-4 pb-3">
                        <Typography.Title level={4}>Lịch sử giá</Typography.Title>
                        <ButtonAction.Add text="Thêm giá mới" onClick={() => setShowModalAddProductPrice(true)} />
                    </div>
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3 border-t py-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-3 gap-4">
                                    <Select name="status"
                                            options={[
                                                { label: 'Tất cả', value: 'ALL' },
                                                {
                                                    label: BaseStatusVietnamese[BaseStatus.ACTIVE],
                                                    value: BaseStatus.ACTIVE,
                                                },
                                                {
                                                    label: BaseStatusVietnamese[BaseStatus.INACTIVE],
                                                    value: BaseStatus.INACTIVE,
                                                },
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ProductPriceHistory> data={histories} columns={columns}
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                isLoading={isLoading}
                                                onChangePage={onPageChange}
                    />
                </Card>

            </div>
            {
                showModalAddProductPrice && (
                    <ModalAddProductPrice onClose={() => setShowModalAddProductPrice(false)} productCode={code} />
                )
            }
            {
                productPriceToDelete && (
                    <ModalAlert onClose={() => setProductPriceToDelete(null)}
                                title="Xóa giá sản phẩm?"
                                content={`Bạn có chắc chắn muốn xóa bảng giá \`${formatDateToLocalDate(productPriceToDelete.startDate)} - ${formatDateToLocalDate(productPriceToDelete.endDate)}\` này không?`}
                                footer={
                                    <div className="flex justify-center items-center gap-3 mt-4">
                                        <ButtonAction.Cancel onClick={() => setProductPriceToDelete(null)} />
                                        <ButtonAction.SubmitDelete
                                            onClick={() => handleDeleteProductPrice(productPriceToDelete)} />
                                    </div>
                                }
                    />
                )
            }
            {
                productPriceToUpdate && (
                    <ModalUpdateProductPrice onClose={() => setProductPriceToUpdate(null)} productCode={code}
                                             productPrice={productPriceToUpdate} />
                )
            }
        </>
    );
};

export default ProductDetailPage;