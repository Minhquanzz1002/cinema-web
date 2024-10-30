'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '@/components/Admin/Card';
import { ButtonSquare } from '@/components/Admin/Button';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { BaseProductWithPrice, ProductStatus, ProductStatusVietnamese } from '@/modules/products/interface';
import { useAllProducts, useDeleteProduct } from '@/modules/products/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ProductStatusBadge from '@/components/Admin/Badge/ProductStatusBadge';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Filters/Input';
import Typography from '@/components/Admin/Typography';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import Select from '@/components/Admin/Filters/Select';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';

interface ProductFilter extends PaginationState {
    search: string;
    status: string | ProductStatus;
}

const ProductPage = () => {
    const [displayType, setDisplayType] = useState<'Grid' | 'Table'>('Table');
    const deleteProduct = useDeleteProduct();
    const initialFilters: ProductFilter = {
        page: 1,
        search: '',
        status: 'ALL',
    };

    const [filters, setFilters] = useState<ProductFilter>(initialFilters);

    const productsQuery = useAllProducts({
        page: filters.page - 1,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status as ProductStatus,
    });

    const deleteModal = useDeleteModal<BaseProductWithPrice>({
        onDelete: async (product: BaseProductWithPrice) => {
            await deleteProduct.mutateAsync(product.code);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (product) => product.status !== ProductStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa sản phẩm đang hiển thị',
    });

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

    useEffect(() => {
        document.title = 'B&Q Cinema - Sản phẩm';
    }, []);

    const columns = React.useMemo<ColumnDef<BaseProductWithPrice>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã sản phẩm',
            },
            {
                accessorKey: 'image',
                cell: ({ row }) => {
                    return (
                        <div className="w-20 h-20 relative rounded shadow overflow-hidden">
                            <Image src={row.original.image} alt={row.original.name} fill
                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                   priority className="rounded-md object-cover w-20 h-20" />
                        </div>
                    );
                },
                header: 'Ảnh',
            },
            {
                accessorKey: 'name',
                header: 'Tên',
                cell: ({ row }) => (
                    <div>
                        <div className="text-nowrap">{row.original.name}</div>
                        <div className="text-gray-800 font-normal">{row.original.description}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'price',
                cell: ({ row }) =>
                    <span>{row.original.price ? formatNumberToCurrency(row.original.price) : 'Chưa cập nhật'}</span>,
                header: 'Giá hiện tại',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/admin/products/${row.original.code}`} />
                        <ButtonAction.Update href={`/admin/products/${row.original.code}/edit`} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = async () => {
        await exportToExcel<BaseProductWithPrice>(products, 'products.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-x-2">
                            <ButtonSquare title={displayType !== 'Grid' ? 'Hiển thị dạng thẻ' : 'Hiển thị dạng bảng'}
                                          onClick={() => setDisplayType(displayType === 'Grid' ? 'Table' : 'Grid')}>
                                {
                                    displayType !== 'Grid' ? <BsGrid3X3Gap /> : <PiListBold />
                                }
                            </ButtonSquare>

                        </div>

                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Thêm sản phẩm" href={'/admin/products/new'} />
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
                                    <Input name="search" placeholder="Tìm theo mã hoặc tên" />
                                    <Select name="status"
                                            options={[
                                                { label: 'Tất cả', value: 'ALL' },
                                                {
                                                    label: ProductStatusVietnamese[ProductStatus.ACTIVE],
                                                    value: ProductStatus.ACTIVE,
                                                },
                                                {
                                                    label: ProductStatusVietnamese[ProductStatus.INACTIVE],
                                                    value: ProductStatus.INACTIVE,
                                                },
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <div>

                    </div>
                    <Table<BaseProductWithPrice> data={products} columns={columns} currentPage={currentPage}
                                                 isLoading={isLoading}
                                                 totalPages={totalPages}
                                                 onChangePage={onPageChange} />
                </Card>
            </div>

            <ModalDeleteAlert onClose={deleteModal.closeDeleteModal}
                              onConfirm={deleteModal.handleDelete}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xóa sản phẩm?"
                              content={
                                  <>Bạn có chắc chắn muốn xóa sản
                                      phẩm <HighlightedText>{deleteModal.selectedData?.name}</HighlightedText> không?</>
                              }
            />
        </>
    );
};

export default ProductPage;