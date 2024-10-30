'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Image from 'next/image';
import { ProductPriceHistory } from '@/modules/products/interface';
import { useParams } from 'next/navigation';
import Table from '@/components/Admin/Tables';
import { ColumnDef, Row } from '@tanstack/table-core';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Loader from '@/components/Admin/Loader';
import ItemInfo from '@/components/Admin/ItemInfo';
import ButtonAction from '@/components/Admin/ButtonAction';
import ModalUpdateProductPrice from '@/components/Admin/Pages/Product/ModalUpdateProductPrice';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useAllPromotionLines, usePromotionByCode } from '@/modules/promotions/repository';
import HTMLContent from '@/components/Admin/HTMLContent';
import {
    AdminPromotionLineOverview,
    AdminPromotionOverview,
    PromotionLineType,
    PromotionLineTypeVietnamese,
} from '@/modules/promotions/interface';
import NotFound from '@/components/Admin/NotFound';
import { LuSearch } from 'react-icons/lu';
import { SeatTypeVietnamese } from '@/modules/seats/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ModalAddPromotionLine from '@/components/Admin/Pages/Promotions/ModalAddPromotionLine';

interface ProductPriceFilter extends PaginationState {
    status: BaseStatus | 'ALL';
}

const ViewPromotionPage = () => {
    const { code } = useParams<{ code: string }>();
    const { data: promotion, isLoading: isLoadingPromotion } = usePromotionByCode(code);


    const [promotionToAddPromotionLine, setPromotionToAddPromotionLine] = useState<AdminPromotionOverview | null>(null);
    const [productPriceToUpdate, setProductPriceToUpdate] = useState<ProductPriceHistory | null>(null);

    const [filters, setFilters] = useState<ProductPriceFilter>({
        page: 1,
        status: 'ALL',
    });

    const productPricesQuery = useAllPromotionLines({
        id: promotion?.id,
        page: filters.page - 1,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: histories,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: productPricesQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });


    useEffect(() => {
        document.title = 'B&Q Cinema - Chi tiết sản phẩm';
    }, []);

    const columns = useMemo<ColumnDef<AdminPromotionLineOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã',
            },
            {
                accessorKey: 'name',
                header: 'Tên',
            },
            {
                accessorKey: 'type',
                header: 'Loại',
                cell: ({ row }) => PromotionLineTypeVietnamese[row.original.type],
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
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Update href={`/admin/promotions/${code}/lines/${row.original.code}/edit`} />
                        <ButtonAction.Delete />
                    </div>
                ),
                header: '',
            },
        ],
        [code],
    );

    const renderSubComponent = React.useCallback(
        ({ row }: { row: Row<AdminPromotionLineOverview> }) => (
            <div className="bg-gray-100">
                <div className="ml-14 bg-white overflow-x-scroll xl:overflow-x-hidden">
                    <table className="w-full">
                        <thead>
                        <tr className="h-10 border-t">
                            <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
                                colSpan={3}>
                                Thông tin giảm giá
                            </td>
                            <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
                                colSpan={2}>
                                Sản phẩm yêu cầu
                            </td>
                            <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
                                colSpan={2}>
                                Vé yêu cầu
                            </td>
                            <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
                                colSpan={2}>
                                Quả tặng sản phẩm
                            </td>
                            <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
                                colSpan={2}>
                                Quà tặng vé
                            </td>
                            <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
                                colSpan={2}>
                                Sử dụng
                            </td>
                            {/*<td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">*/}
                            {/*</td>*/}
                            {/*<td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">*/}
                            {/*    {*/}
                            {/*        row.original.status !== BaseStatus.ACTIVE ? (*/}
                            {/*            <div className="flex justify-end">*/}
                            {/*                <button className="bg-brand-500 text-white px-2 py-1.5 rounded-md">*/}
                            {/*                    <FaPlus className="h-4 w-4" />*/}
                            {/*                </button>*/}
                            {/*            </div>*/}
                            {/*        ) : null*/}
                            {/*    }*/}
                            {/*</td>*/}
                        </tr>
                        <tr className="h-10 border-t">
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Giá trị
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Tối đa
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Đơn tối thiểu
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Sản phẩm
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">
                                SL
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Loại vé
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">
                                SL
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Sản phẩm
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">
                                SL
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Loại vé
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">
                                SL
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-dashed border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Giới hạn
                            </td>
                            <td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Đã dùng
                            </td>
                            {/*<td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0">*/}
                            {/*    Trạng thái*/}
                            {/*</td>*/}
                            {/*<td className="text-[12px] font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">*/}
                            {/*    {*/}
                            {/*        row.original.status !== BaseStatus.ACTIVE ? (*/}
                            {/*            <div className="flex justify-end">*/}
                            {/*                <button className="bg-brand-500 text-white px-2 py-1.5 rounded-md">*/}
                            {/*                    <FaPlus className="h-4 w-4" />*/}
                            {/*                </button>*/}
                            {/*            </div>*/}
                            {/*        ) : null*/}
                            {/*    }*/}
                            {/*</td>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            row.original.promotionDetails.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="text-center py-4 border-t ">
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            <LuSearch size={50} className="text-gray-600" />
                                            <span
                                                className="text-sm font-normal">Không có dữ liệu nào được tìm thấy</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                row.original.promotionDetails.map((details) => (
                                    <tr key={details.id} className="border-t last-of-type:border-b">
                                        <td className="text-tiny dark:text-white px-4 py-2 border-r border-dashed">{row.original.type === PromotionLineType.PRICE_DISCOUNT ? details.discountValue + ' %' : formatNumberToCurrency(details.discountValue)}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r border-dashed">{formatNumberToCurrency(details.maxDiscountValue)}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">{formatNumberToCurrency(details.minOrderValue)}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r border-dashed">{details?.requiredProduct?.name || ''}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">{details?.requiredProductQuantity}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r border-dashed">{SeatTypeVietnamese[details?.requiredSeatType]}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">{details?.requiredSeatQuantity}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r border-dashed">{details?.giftProduct?.name || ''}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">{details?.giftQuantity}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r border-dashed">{SeatTypeVietnamese[details?.giftSeatType]}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">{details?.giftSeatQuantity}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r border-dashed">{details.usageLimit}</td>
                                        <td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">{details?.currentUsageCount}</td>
                                        {/*<td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0 border-r">*/}
                                        {/*    <BaseStatusBadge status={details.status} />*/}
                                        {/*</td>*/}
                                        {/*<td className="text-tiny dark:text-white px-4 py-2 first-of-type:pr-0">*/}
                                        {/*    <div className="flex gap-2 items-center justify-end">*/}
                                        {/*        <ButtonAction.Update />*/}
                                        {/*        <ButtonAction.Delete />*/}
                                        {/*    </div>*/}
                                        {/*</td>*/}
                                    </tr>
                                ))
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        ),
        [],
    );

    if (isLoadingPromotion) {
        return <Loader />;
    }

    if (!promotion) return (
        <NotFound />
    );

    return (
        <>
            <div className="mt-5 flex flex-col gap-4">
                <Card className="p-[18px]">
                    <div className="flex gap-1 text-xl font-nunito font-medium">
                        <div>Mã khuyến mãi</div>
                        <div className="text-brand-500">#{promotion.code}</div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <Card className="p-[18px]">
                        <Typography.Title level={4}>Hình ảnh</Typography.Title>
                        <div className="relative aspect-[4/5] rounded overflow-hidden">
                            <Image
                                src={promotion.imagePortrait || 'https://firebasestorage.googleapis.com/v0/b/cinema-782ef.appspot.com/o/products%2Fmenuboard-coonline-2024-combo1-min_1711699834430.jpg?alt=media'}
                                alt={`Hình ảnh của ${promotion.name}`} fill className="object-contain" />
                        </div>
                    </Card>
                    <Card className="p-[18px] lg:col-span-4">
                        <Typography.Title level={4}>Thông tin chung</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo label="Tên" value={promotion.name} />
                            <ItemInfo label="Ngày bắt đầu" value={formatDateToLocalDate(promotion.startDate)} />
                            <ItemInfo label="Ngày kết thúc" value={formatDateToLocalDate(promotion.endDate)} />
                            <ItemInfo label="Trạng thái" value={BaseStatusVietnamese[promotion.status]} />
                        </div>
                    </Card>
                </div>

                <Card className="p-[18px] lg:col-span-4">
                    <Typography.Title level={4}>Mô tả</Typography.Title>
                    <HTMLContent content={promotion.description || 'Chưa cập nhật'} />
                </Card>

                <Card className="py-4">
                    <div className="flex justify-between items-center px-4 pb-3">
                        <Typography.Title level={4}>Danh sách chương trình</Typography.Title>
                        {
                            promotion.status !== BaseStatus.ACTIVE && (
                                <ButtonAction.Add text="Thêm chương trình" href={`/admin/promotions/${code}/lines/new`} />
                            )
                        }
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
                    <Table<AdminPromotionLineOverview> data={histories} columns={columns}
                                                       currentPage={currentPage}
                                                       totalPages={totalPages}
                                                       isLoading={isLoading}
                                                       isExpandable={true}
                                                       onChangePage={onPageChange}
                                                       renderSubComponent={renderSubComponent}
                    />
                </Card>

            </div>
            <ModalAddPromotionLine onClose={() => setPromotionToAddPromotionLine(null)}
                                   promotion={promotionToAddPromotionLine} />

            {
                productPriceToUpdate && (
                    <ModalUpdateProductPrice onClose={() => setProductPriceToUpdate(null)} productCode={code}
                                             productPrice={productPriceToUpdate} />
                )
            }
        </>
    );
};

export default ViewPromotionPage;