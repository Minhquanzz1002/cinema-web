'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import avatar from '/public/img/avatar/avt.png';
import { AdminPromotionOverview } from '@/modules/promotions/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { useAllPromotions, useDeletePromotion } from '@/modules/promotions/repository';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Filters/Input';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import useDeleteModal from '@/hook/useDeleteModal';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import RangePicker from '@/components/Admin/RangePicker';
import dayjs from 'dayjs';


interface PromotionFilter extends PaginationState {
    search: string;
    status: 'ALL' | BaseStatus;
    startDate?: Date;
    endDate?: Date;
}

const PromotionPage = () => {
    const [filters, setFilters] = useState<PromotionFilter>({
        page: 1,
        search: '',
        status: 'ALL',
    });

    const promotionsQuery = useAllPromotions({
        page: filters.page - 1,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
        startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : undefined,
        endDate: filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : undefined,
    });

    const deletePromotion = useDeletePromotion();

    const {
        data: promotions,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: promotionsQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<AdminPromotionOverview>({
        onDelete: async (promotion: AdminPromotionOverview) => {
            await deletePromotion.mutateAsync(promotion.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (promotion) => promotion.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể khuyến mãi đang hoạt động',
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Khuyến mãi';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminPromotionOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã khuyến mãi',
            },
            {
                accessorKey: 'imagePortrait',
                cell: ({ row }) => {
                    return (
                        <div className="w-24 h-32 relative rounded shadow overflow-hidden">
                            <Image src={row.original.imagePortrait || avatar} alt={row.original.name} fill
                                   className="object-cover"
                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                        </div>
                    );
                },
                header: 'Ảnh',
            },
            {
                accessorKey: 'name',
                header: 'Tên',
            },
            {
                accessorKey: 'startDate',
                cell: ({ row }) => <span>{formatDateToLocalDate(row.original.startDate)}</span>,
                header: 'Bắt đầu',
            },
            {
                accessorKey: 'endDate',
                cell: ({ row }) => <span>{formatDateToLocalDate(row.original.endDate)}</span>,
                header: 'Kết thúc',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.View href={`/admin/promotions/${row.original.code}`} />
                        <ButtonAction.Update href={`/admin/promotions/${row.original.code}/edit`} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = async () => {
        await exportToExcel<AdminPromotionOverview>(promotions, 'promotions.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">

                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href="/admin/promotions/new" />
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
                                    <Input name="search" placeholder="Mã hoặc tên khuyến mãi" />
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
                    <Table<AdminPromotionOverview> data={promotions} columns={columns} currentPage={currentPage}
                                                   totalPages={totalPages}
                                                   isLoading={isLoading}
                                                   onChangePage={onPageChange}
                    />
                </Card>
            </div>

            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={<>Bạn có chắc chắn muốn xóa khuyến
                                  mãi <HighlightedText>{deleteModal.selectedData?.name}</HighlightedText> không?</>}
            />
        </>
    );
};

export default PromotionPage;