'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { ProductPriceHistory, ProductStatusVietnamese } from '@/modules/products/interface';
import { useParams } from 'next/navigation';
import { useAllProductPriceHistories, useDeleteProductPrice, useProductByCode } from '@/modules/products/repository';
import usePagination from '@/hook/usePagination';
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

const ProductDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: product } = useProductByCode(code);

    const [productPriceToDelete, setProductPriceToDelete] = useState<ProductPriceHistory | null>(null);
    const deleteProductPrice = useDeleteProductPrice();

    const [showModalAddProductPrice, setShowModalAddProductPrice] = useState(false);
    const [productPriceToUpdate, setProductPriceToUpdate] = useState<ProductPriceHistory | null>(null);

    const [page, setPage] = useState(0);
    const productPricesQuery = useAllProductPriceHistories({
        code,
        page,
    });
    const {
        currentPage,
        totalPages,
        data: histories,
        onChangePage,
    } = usePagination<ProductPriceHistory>({
        queryResult: productPricesQuery,
        initialPage: 1,
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage - 1);
        onChangePage(newPage);
    }, [onChangePage]);

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
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">Mã</p>
                ),
            },
            {
                accessorKey: 'startDate',
                cell: ({ row }) => <span>{formatDateToLocalDate(row.original.startDate)}</span>,
                header: () => <span>Ngày bắt đầu</span>,
            },
            {
                accessorKey: 'endDate',
                cell: ({ row }) => <span>{formatDateToLocalDate(row.original.endDate)}</span>,
                header: () => <span>Ngày kết thúc</span>,
            },
            {
                accessorKey: 'price',
                cell: ({ row }) => <span>{formatNumberToCurrency(row.original.price)}</span>,
                header: () => <span>Số tiền</span>,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: () => <span>Trạng thái</span>,
            },
            {
                accessorKey: 'actions',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center">
                        <ButtonAction.Update onClick={() => setProductPriceToUpdate(row.original)}/>
                        <ButtonAction.Delete onClick={() => handleClickDeleteProductPrice(row)} />
                    </div>
                ),
                header: '',
                enableSorting: false,
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

                <div className="grid grid-cols-5 gap-4">
                    <Card className="p-[18px]">
                        <Typography.Title level={4}>Hình ảnh</Typography.Title>
                        <div className="relative aspect-square rounded overflow-hidden">
                            <Image
                                src={product.image || 'https://firebasestorage.googleapis.com/v0/b/cinema-782ef.appspot.com/o/products%2Fmenuboard-coonline-2024-combo1-min_1711699834430.jpg?alt=media'}
                                alt={`Hình ảnh của ${product.name}`} fill className="object-cover" />
                        </div>
                    </Card>
                    <Card className="p-[18px] col-span-4">
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
                <Table<ProductPriceHistory> data={histories} columns={columns}
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onChangePage={handlePageChange}
                >
                    <div className="flex justify-between items-center">
                        <Typography.Title level={4}>Lịch sử giá</Typography.Title>
                        <ButtonAction.Add onClick={() => setShowModalAddProductPrice(true)} />
                    </div>
                </Table>
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