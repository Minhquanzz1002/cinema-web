'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';

import { useParams } from 'next/navigation';
import Table from '@/components/Admin/Tables';
import { ColumnDef, Row } from '@tanstack/table-core';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Loader from '@/components/Admin/Loader';
import ItemInfo from '@/components/Admin/ItemInfo';
import ButtonAction from '@/components/Admin/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import {
    useAllPromotionLines,
    useDeletePromotionDetail,
    useDeletePromotionLine,
    usePromotionByCode,
} from '@/modules/promotions/repository';
import {
    AdminPromotionDetailOverview,
    AdminPromotionLineOverview,
    PromotionLineType,
    PromotionLineTypeVietnamese,
} from '@/modules/promotions/interface';
import NotFound from '@/components/Admin/NotFound';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import RangePicker from '@/components/Admin/RangePicker';
import EmptyState from '@/components/Admin/Tables/EmptyState';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';
import { FaPlus } from 'react-icons/fa6';
import ModalUpdatePromotionLine from '@/components/Admin/Pages/PromotionLine/ModalUpdatePromotionLine';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import ModalAddPromotionDetail from '@/components/Admin/Pages/PromotionDetail/ModalAddPromotionDetail';

const TableCell: React.FC<{ children?: React.ReactNode; dashed?: boolean }> = ({ children, dashed }) => (
    <td className={`text-tiny dark:text-white px-4 py-2 border-r ${dashed ? 'border-dashed' : ''}`}>
        {children}
    </td>
);

const TableHeaderCell: React.FC<{ children?: React.ReactNode; colSpan?: number }> = ({ children, colSpan }) => (
    <td className="text-[12px] text-center font-bold text-gray-800 dark:text-white uppercase border-r border-gray-200 px-4 py-2 first-of-type:pr-0"
        colSpan={colSpan}>
        {children}
    </td>
);

const SubHeaderCell: React.FC<{ children?: React.ReactNode; dashed?: boolean }> = ({ children, dashed }) => (
    <td className={`text-[12px] font-bold text-gray-800 dark:text-white uppercase border-r ${dashed ? 'border-dashed' : ''} border-gray-200 px-4 py-2 first-of-type:pr-0`}>
        {children}
    </td>
);

interface ProductPriceFilter extends PaginationState {
    status: BaseStatus | 'ALL';
}

const ViewPromotionPage = () => {
        const { code } = useParams<{ code: string }>();
        const { data: promotion, isLoading: isLoadingPromotion } = usePromotionByCode(code);


        /**
         * States for add promotion details
         */
        const [promotionLineToAddPromotionDetail, setPromotionLineToAddPromotionDetail] = useState<AdminPromotionLineOverview | null>(null);

        /**
         * States for update promotion lines
         */
        const [promotionLineToUpdate, setPromotionLineToUpdate] = useState<AdminPromotionLineOverview | null>(null);

        const [filters, setFilters] = useState<ProductPriceFilter>({
            page: 1,
            status: 'ALL',
        });

        const productPricesQuery = useAllPromotionLines({
            id: promotion?.id,
            page: filters.page - 1,
            status: filters.status === 'ALL' ? undefined : filters.status,
        });

        const deletePromotionLine = useDeletePromotionLine();
        const deletePrmotionDetail = useDeletePromotionDetail();

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

        const deleteModal = useDeleteModal<AdminPromotionLineOverview>({
            onDelete: async (line: AdminPromotionLineOverview) => {
                await deletePromotionLine.mutateAsync(line.id);
            },
            onSuccess: () => {
                setFilters((prev) => ({ ...prev, page: 1 }));
            },
            canDelete: (line) => line.status !== BaseStatus.ACTIVE,
            unableDeleteMessage: 'Không thể xóa khuyến mãi đang áp dụng',
        });

        const deleteModalPromotionDetail = useDeleteModal<AdminPromotionDetailOverview>({
            onDelete: async (detail: AdminPromotionDetailOverview) => {
                await deletePrmotionDetail.mutateAsync(detail.id);
            },
            onSuccess: () => {
                setFilters((prev) => ({ ...prev, page: 1 }));
            },
            canDelete: (detail) => detail.status !== BaseStatus.ACTIVE,
            unableDeleteMessage: 'Không thể chi tiết khuyến mãi đang áp dụng',
        });


        useEffect(() => {
            document.title = 'B&Q Cinema - Chi tiết khuyến mãi';
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
                            <ButtonAction.Update onClick={() => setPromotionLineToUpdate(row.original)} />
                            <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                        </div>
                    ),
                    header: '',
                },
            ],
            [deleteModal],
        );

        const CashRebateHeaders = ({ row }: { row: Row<AdminPromotionLineOverview> }) => (
            <>
                <tr className="h-10 border-t">
                    <TableHeaderCell colSpan={2}>Thông tin giảm giá</TableHeaderCell>
                    <TableHeaderCell colSpan={2}>Sử dụng</TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                </tr>
                <tr className="h-10 border-t">
                    <SubHeaderCell dashed>Giá trị</SubHeaderCell>
                    <SubHeaderCell dashed>Đơn tối thiểu</SubHeaderCell>
                    <SubHeaderCell dashed>Giới hạn</SubHeaderCell>
                    <SubHeaderCell>Đã dùng</SubHeaderCell>
                    <SubHeaderCell>Trạng thái</SubHeaderCell>
                    <SubHeaderCell>
                        {
                            promotion?.status !== BaseStatus.ACTIVE && (
                                <div className="flex justify-end">
                                    <button className="bg-brand-500 text-white px-2 py-1.5 rounded-md"
                                            onClick={() => setPromotionLineToAddPromotionDetail(row.original)}
                                    >
                                        <FaPlus className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        }
                    </SubHeaderCell>
                </tr>
            </>
        );

        const CashRebateRow: React.FC<{ detail: AdminPromotionDetailOverview }> = ({ detail }) => (
            <>
                <TableCell dashed>{formatNumberToCurrency(detail.discountValue)}</TableCell>
                <TableCell dashed>{formatNumberToCurrency(detail.minOrderValue)}</TableCell>
                <TableCell dashed>{detail.usageLimit}</TableCell>
                <TableCell>{detail.currentUsageCount}</TableCell>
                <TableCell>
                    <BaseStatusBadge status={detail.status} />
                </TableCell>
                <TableCell>
                    <div className="flex justify-end items-center gap-2">
                        <ButtonAction.Update />
                        <ButtonAction.Delete onClick={() => deleteModalPromotionDetail.openDeleteModal(detail)}/>
                    </div>
                </TableCell>
            </>
        );

        const PriceDiscountHeaders = ({ row }: { row: Row<AdminPromotionLineOverview> }) => (
            <>
                <tr className="h-10 border-t">
                    <TableHeaderCell colSpan={3}>Thông tin giảm giá</TableHeaderCell>
                    <TableHeaderCell colSpan={2}>Sử dụng</TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                </tr>
                <tr className="h-10 border-t">
                    <SubHeaderCell dashed>Giá trị (%)</SubHeaderCell>
                    <SubHeaderCell dashed>Tối đa</SubHeaderCell>
                    <SubHeaderCell dashed>Đơn tối thiểu</SubHeaderCell>
                    <SubHeaderCell dashed>Giới hạn</SubHeaderCell>
                    <SubHeaderCell>Đã dùng</SubHeaderCell>
                    <SubHeaderCell>Trạng thái</SubHeaderCell>
                    <SubHeaderCell>
                        {
                            promotion?.status !== BaseStatus.ACTIVE && (
                                <div className="flex justify-end">
                                    <button className="bg-brand-500 text-white px-2 py-1.5 rounded-md"
                                            title="Thêm chi tiết khuyến mãi"
                                            onClick={() => setPromotionLineToAddPromotionDetail(row.original)}
                                    >
                                        <FaPlus className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        }
                    </SubHeaderCell>
                </tr>
            </>
        );

        const PriceDiscountRow: React.FC<{ detail: AdminPromotionDetailOverview }> = ({ detail }) => (
            <>
                <TableCell dashed>{detail.discountValue}%</TableCell>
                <TableCell dashed>{formatNumberToCurrency(detail.maxDiscountValue)}</TableCell>
                <TableCell dashed>{formatNumberToCurrency(detail.minOrderValue)}</TableCell>
                <TableCell dashed>{detail.usageLimit}</TableCell>
                <TableCell>{detail.currentUsageCount}</TableCell>
                <TableCell>
                    <BaseStatusBadge status={detail.status} />
                </TableCell>
                <TableCell>
                    <div className="flex justify-end items-center gap-2">
                        <ButtonAction.Update />
                        <ButtonAction.Delete onClick={() => deleteModalPromotionDetail.openDeleteModal(detail)}/>
                    </div>
                </TableCell>
            </>
        );

        const BuyTicketsGetTicketsHeaders = () => (
            <>
                <tr className="h-10 border-t">
                    <TableHeaderCell colSpan={2}>Vé yêu cầu</TableHeaderCell>
                    <TableHeaderCell colSpan={2}>Vé tặng</TableHeaderCell>
                    <TableHeaderCell colSpan={2}>Sử dụng</TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                </tr>
                <tr className="h-10 border-t">
                    <SubHeaderCell dashed>Loại vé</SubHeaderCell>
                    <SubHeaderCell>Số lượng</SubHeaderCell>
                    <SubHeaderCell dashed>Loại vé</SubHeaderCell>
                    <SubHeaderCell>Số lượng</SubHeaderCell>
                    <SubHeaderCell dashed>Giới hạn</SubHeaderCell>
                    <SubHeaderCell>Đã dùng</SubHeaderCell>
                    <SubHeaderCell>Trạng thái</SubHeaderCell>
                    <SubHeaderCell></SubHeaderCell>
                </tr>
            </>
        );

        const BuyTicketsRow: React.FC<{ detail: any; type: PromotionLineType }> = ({ detail, type }) => (
            <>
                <TableCell dashed>{SeatTypeVietnamese[detail.requiredSeatType as SeatType]}</TableCell>
                <TableCell>{detail.requiredSeatQuantity}</TableCell>
                <TableCell dashed>
                    {type === PromotionLineType.BUY_TICKETS_GET_TICKETS
                        ? SeatTypeVietnamese[detail.giftSeatType as SeatType]
                        : detail.giftProduct?.name}
                </TableCell>
                <TableCell>
                    {type === PromotionLineType.BUY_TICKETS_GET_TICKETS
                        ? detail.giftSeatQuantity
                        : detail.giftQuantity}
                </TableCell>
                <TableCell dashed>{detail.usageLimit}</TableCell>
                <TableCell>{detail.currentUsageCount}</TableCell>
                <TableCell>
                    <BaseStatusBadge status={detail.status} />
                </TableCell>
                <TableCell>
                    <div className="flex justify-end items-center gap-2">
                        <ButtonAction.Update />
                        <ButtonAction.Delete onClick={() => deleteModalPromotionDetail.openDeleteModal(detail)}/>
                    </div>
                </TableCell>
            </>
        );

        const BuyTicketsGetProductsHeaders = () => (
            <>
                <tr className="h-10 border-t">
                    <TableHeaderCell colSpan={2}>Vé yêu cầu</TableHeaderCell>
                    <TableHeaderCell colSpan={2}>Sản phẩm tặng</TableHeaderCell>
                    <TableHeaderCell colSpan={2}>Sử dụng</TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                    <TableHeaderCell></TableHeaderCell>
                </tr>
                <tr className="h-10 border-t">
                    <SubHeaderCell dashed>Loại vé</SubHeaderCell>
                    <SubHeaderCell>Số lượng</SubHeaderCell>
                    <SubHeaderCell dashed>Sản phẩm</SubHeaderCell>
                    <SubHeaderCell>Số lượng</SubHeaderCell>
                    <SubHeaderCell dashed>Giới hạn</SubHeaderCell>
                    <SubHeaderCell>Đã dùng</SubHeaderCell>
                    <SubHeaderCell>Trạng thái</SubHeaderCell>
                    <SubHeaderCell></SubHeaderCell>
                </tr>
            </>
        );

        const renderSubComponent = React.useCallback(
            ({ row }: { row: Row<AdminPromotionLineOverview> }) => {
                const renderHeaders = () => {
                    switch (row.original.type) {
                        case PromotionLineType.CASH_REBATE:
                            return <CashRebateHeaders row={row} />;
                        case PromotionLineType.PRICE_DISCOUNT:
                            return <PriceDiscountHeaders row={row} />;
                        case PromotionLineType.BUY_TICKETS_GET_TICKETS:
                            return <BuyTicketsGetTicketsHeaders />;
                        case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
                            return <BuyTicketsGetProductsHeaders />;
                        default:
                            return null;
                    }
                };

                const renderRow = (detail: any) => {
                    switch (row.original.type) {
                        case PromotionLineType.CASH_REBATE:
                            return <CashRebateRow detail={detail} />;
                        case PromotionLineType.PRICE_DISCOUNT:
                            return <PriceDiscountRow detail={detail} />;
                        case PromotionLineType.BUY_TICKETS_GET_TICKETS:
                        case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
                            return <BuyTicketsRow detail={detail} type={row.original.type} />;
                        default:
                            return null;
                    }
                };
                return (
                    <div className="bg-gray-100">
                        <div className="ml-14 bg-white overflow-x-scroll xl:overflow-x-hidden">
                            <table className="w-full">
                                <thead>
                                {renderHeaders()}
                                </thead>
                                <tbody>
                                {row.original.promotionDetails.length === 0 ? (
                                    <EmptyState colSpan={5} />
                                ) : (
                                    row.original.promotionDetails.map((detail) => (
                                        <tr key={detail.id} className="border-t last-of-type:border-b">
                                            {renderRow(detail)}
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            },
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

                    

                    <Card className="py-4">
                        <div className="flex justify-between items-center px-4 pb-3">
                            <Typography.Title level={4}>Chi tiết khuyến mãi</Typography.Title>
                            <ButtonAction.Add text="Thêm chương trình" href={`/admin/promotions/${code}/lines/new`} />
                        </div>
                        <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                            <Form>
                                <div className="px-4 pb-3 border-t py-3">
                                    <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                    <div className="grid grid-cols-3 gap-4">
                                        <RangePicker startName="startDate" endName="endDate" />
                                        <Select name="status"
                                                options={[
                                                    { label: 'Tất cả', value: 'ALL' },
                                                    ...Object.keys(BaseStatus).map((status) => ({
                                                        label: BaseStatusVietnamese[status as BaseStatus],
                                                        value: status,
                                                    })),
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
                <ModalDeleteAlert onClose={deleteModal.closeDeleteModal}
                                  onConfirm={deleteModal.handleDelete}
                                  isOpen={deleteModal.showDeleteModal}
                                  title="Xóa chương trình khuyến mãi?"
                                  content={
                                      <>Bạn có chắc chắn muốn xóa chương trình khuyến
                                          mãi <HighlightedText>{deleteModal.selectedData?.name}</HighlightedText> không?</>
                                  }
                />
                <ModalDeleteAlert onClose={deleteModalPromotionDetail.closeDeleteModal}
                                  onConfirm={deleteModalPromotionDetail.handleDelete}
                                  isOpen={deleteModalPromotionDetail.showDeleteModal}
                                  title="Xóa chi tiết chương trình khuyến mãi?"
                                  content={
                                      <>Bạn có chắc chắn muốn xóa chi tiết chương trình khuyến
                                          mãi <HighlightedText>{deleteModalPromotionDetail.selectedData?.id}</HighlightedText> không?</>
                                  }
                />
                <ModalAddPromotionDetail onClose={() => setPromotionLineToAddPromotionDetail(null)}
                                         promotionLine={promotionLineToAddPromotionDetail} />
                <ModalUpdatePromotionLine onClose={() => setPromotionLineToUpdate(null)}
                                          promotionLine={promotionLineToUpdate} promotion={promotion} />
            </>
        );
    }
;

export default ViewPromotionPage;