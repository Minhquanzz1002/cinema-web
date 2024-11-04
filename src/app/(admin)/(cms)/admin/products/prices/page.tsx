'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Filters/Input';
import Typography from '@/components/Admin/Typography';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import Select from '@/components/Admin/Filters/Select';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useAllProductPrices } from '@/modules/productPrices/repository';
import { AdminProductPriceOverview } from '@/modules/productPrices/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';
import { DatePickerWithRange } from '@/components/Admin/DatePickerWithRange';
import ModalAddProductPrice from '@/components/Admin/Pages/ProductPrice/ModalAddProductPrice';
import { useDeleteProductPrice } from '@/modules/products/repository';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import ModalUpdateProductPrice from '@/components/Admin/Pages/Product/ModalUpdateProductPrice';

interface ProductPriceFilter extends PaginationState {
    status: BaseStatus | 'ALL';
    search: string;
}

const ProductPricePage = () => {
    const initialFilters: ProductPriceFilter = {
        page: 1,
        status: 'ALL',
        search: '',
    };

    const [filters, setFilters] = useState<ProductPriceFilter>(initialFilters);
    const [showModalAddProductPrice, setShowModalAddProductPrice] = useState<boolean>(false);
    const [productPriceToUpdate, setProductPriceToUpdate] = useState<AdminProductPriceOverview | null>(null);

    /**
     * React query
     */
    const productsQuery = useAllProductPrices({
        page: filters.page - 1,
        status: filters.status === 'ALL' ? undefined : filters.status,
        search: filters.search,
    });
    const deleteProductPrice = useDeleteProductPrice();

    const {
        data: products,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: productsQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<AdminProductPriceOverview>({
        onDelete: async (price: AdminProductPriceOverview) => {
            await deleteProductPrice.mutateAsync(price.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (price) => price.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa bảng giá sản phẩm đang hoạt động',
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Bảng giá sản phẩm';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminProductPriceOverview>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
            },
            {
                assessorKey: 'startDate',
                cell: ({ row }) => formatDateToLocalDate(row.original.startDate),
                header: 'Ngày bắt đầu',
            },
            {
                assessorKey: 'endDate',
                cell: ({ row }) => formatDateToLocalDate(row.original.endDate),
                header: 'Ngày kết thúc',
            },
            {
                accessorKey: 'product',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <div className="relative w-14 h-14 rounded overflow-hidden">
                            <Image src={row.original.product.image || avatar}
                                   alt={`Ảnh của sản phẩm ${row.original.product.name}`} fill
                                   className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div
                                className="text-nowrap">#{row.original.product.code} - {row.original.product.name}</div>
                            <div className="text-gray-800 font-normal">{row.original.product.description}</div>
                        </div>
                    </div>
                ),
                header: 'Sản phẩm',
            },
            {
                accessorKey: 'price',
                cell: ({ row }) =>
                    <span>{row.original.price ? formatNumberToCurrency(row.original.price) : 'Chưa cập nhật'}</span>,
                header: 'Giá',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Update onClick={() => setProductPriceToUpdate(row.original)}/>
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = async () => {
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">

                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add onClick={() => setShowModalAddProductPrice(true)} />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-3 gap-4">
                                    <Input name="search" placeholder="Tìm theo tên hoặc mã sản phẩm" />
                                    <Select name="status"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.keys(BaseStatus).map(status => ({
                                                    label: BaseStatusVietnamese[status as BaseStatus],
                                                    value: status,
                                                })),
                                            ]}
                                    />
                                    <DatePickerWithRange />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <div>

                    </div>
                    <Table<AdminProductPriceOverview> data={products} columns={columns} currentPage={currentPage}
                                                      isLoading={isLoading}
                                                      totalPages={totalPages}
                                                      onChangePage={onPageChange} />
                </Card>
            </div>

            <ModalAddProductPrice onClose={() => setShowModalAddProductPrice(false)}
                                  isOpen={showModalAddProductPrice} />

            <ModalUpdateProductPrice onClose={() => setProductPriceToUpdate(null)}
                                     productPrice={productPriceToUpdate} />

            <ModalDeleteAlert onClose={deleteModal.closeDeleteModal}
                              onConfirm={deleteModal.handleDelete}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xóa giá sản phẩm?"
                              content={
                                  <>Bạn có chắc chắn muốn xóa giá sản
                                      phẩm <HighlightedText>{deleteModal.selectedData?.product.name}</HighlightedText> không?</>
                              }
            />
        </>
    );
};

export default ProductPricePage;