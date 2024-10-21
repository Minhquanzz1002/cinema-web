'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ColumnDef, Row } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '@/components/Admin/Card';
import { ButtonSquare } from '@/components/Admin/Button';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { BaseProductWithPrice, ProductStatus } from '@/modules/products/interface';
import { useAllProducts, useDeleteProduct } from '@/modules/products/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ProductStatusBadge from '@/components/Admin/Badge/ProductStatusBadge';
import ButtonAction from '@/components/Admin/ButtonAction';
import usePagination from '@/hook/usePagination';
import DropdownInput, { DropDownInputOption, DropdownInputProps } from '@/components/Admin/Filters/DropdownInput';
import { toast } from 'react-toastify';
import ModalAlert from '@/components/Admin/ModalAlert';

const ProductPage = () => {
    const [displayType, setDisplayType] = useState<'Grid' | 'Table'>('Table');
    const [productToDelete, setProductToDelete] = useState<BaseProductWithPrice | null>(null);
    const deleteProduct = useDeleteProduct();
    const options: DropdownInputProps['options'] = [
        { label: 'Tìm theo tên', value: 'name' },
        { label: 'Tìm theo mã', value: 'code' },
    ];
    const [selectedOption, setSelectedOption] = useState<DropDownInputOption>(options[0]);
    const [searchValue, setSearchValue] = useState<string>('');

    const handleChangeDropdown = (option: DropDownInputOption) => {
        setSelectedOption(option);
    };

    const handleChangeSearchValue = (value: string) => {
        setSearchValue(value);
    };

    const [page, setPage] = useState(0);
    const productsQuery = useAllProducts({
        page,
        name: selectedOption.value === 'name' ? searchValue : undefined,
        code: selectedOption.value === 'code' ? searchValue : undefined,
    });
    const {
        currentPage,
        totalPages,
        data: products,
        onChangePage,
    } = usePagination<BaseProductWithPrice>({
        queryResult: productsQuery,
        initialPage: 1,
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage - 1);
        onChangePage(newPage);
    }, [onChangePage]);


    useEffect(() => {
        document.title = 'B&Q Cinema - Sản phẩm';
    }, []);

    const columns = React.useMemo<ColumnDef<BaseProductWithPrice>[]>(
        () => [
            {
                accessorKey: 'code',
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">Mã</p>
                ),
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
                header: () => <span>Ảnh</span>,
                enableSorting: false,
            },
            {
                accessorKey: 'name',
                header: () => <span>Tên</span>,
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
                header: () => <span>Giá hiện tại</span>,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
                header: () => <span>Trạng thái</span>,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/admin/products/${row.original.code}`} />
                        <ButtonAction.Update href={`/admin/products/${row.original.code}/edit`} />
                        <ButtonAction.Delete onClick={() => handleClickDeleteProduct(row)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<BaseProductWithPrice>(products, 'products.xlsx');
    };

    const handleClickDeleteProduct = (row: Row<BaseProductWithPrice>) => {
        if (row.original.status === ProductStatus.ACTIVE) {
            toast.warning('Không thể xóa sản phẩm đang hoạt động');
            return;
        } else {
            setProductToDelete(row.original);
        }
    };

    const handleDeleteProduct = async (product: BaseProductWithPrice) => {
        try {
            await deleteProduct.mutateAsync(product.code);
            setProductToDelete(null);
        } catch (error) {
            console.error(error);
        }
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
                            <ButtonAction.Add href={'/admin/products/new'} />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Table<BaseProductWithPrice> data={products} columns={columns} currentPage={currentPage}
                                             totalPages={totalPages}
                                             onChangePage={handlePageChange}>
                    <div className="grid grid-cols-3 mb-3">
                        <DropdownInput options={options} onChangeDropdown={handleChangeDropdown}
                                       onChangeInputSearch={handleChangeSearchValue} />
                    </div>
                </Table>
            </div>

            {
                productToDelete && (
                    <ModalAlert onClose={() => setProductToDelete(null)}
                                title="Xóa sản phẩm?"
                                content={`Bạn có chắc chắn muốn xóa sản phẩm \`${productToDelete.name}\` này không?`}
                                footer={
                                    <div className="flex justify-center items-center gap-3 mt-4">
                                        <ButtonAction.Cancel onClick={() => setProductToDelete(null)} />
                                        <ButtonAction.SubmitDelete onClick={() => handleDeleteProduct(productToDelete)} />
                                    </div>
                                }
                    />
                )
            }
        </>
    );
};

export default ProductPage;