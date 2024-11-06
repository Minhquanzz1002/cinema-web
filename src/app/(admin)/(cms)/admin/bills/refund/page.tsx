'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Admin/Card';
import { RiFileExcel2Line } from 'react-icons/ri';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateInOrder } from '@/utils/formatDate';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Filters/Input';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import ButtonAction from '@/components/Admin/ButtonAction';
import RefundStatusBadge from '@/components/Admin/Badge/RefundStatusBadge';
import { useAllRefunds } from '@/modules/refunds/repository';
import { AdminRefundOverview, RefundMethodVietnamese } from '@/modules/refunds/interface';

interface BillFilter extends PaginationState{
    refundCode?: string;
    orderCode?: string;
    fromDate?: Date;
    toDate?: Date;
}

const BillRefundPage = () => {
    const [filters, setFilters] = useState<BillFilter>({
        page: 1,
        refundCode: '',
    });

    const productsQuery = useAllRefunds({
        page: filters.page - 1,
        refundCode: filters.refundCode,
        orderCode: filters.orderCode,
    });

    const {
        data: refunds,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange
    } = useFilterPagination({
        queryResult: productsQuery,
        initialFilters: filters,
        onFilterChange: setFilters
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Hóa đơn đã hoàn thành';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminRefundOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã đơn hoàn',
            },
            {
                accessorKey: 'order.code',
                header: 'Mã hóa đơn',
            },
            {
                accessorKey: 'refundMethod',
                cell: ({ row }) => RefundMethodVietnamese[row.original.refundMethod],
                header: 'Phương thức hoàn tiền',
            },
            {
                accessorKey: 'reason',
                header: 'Lý do',
            },
            {
                accessorKey: 'refundDate',
                cell: ({ row }) => row.original.refundDate ? formatDateInOrder(row.original.refundDate) : 'Chưa cập nhật',
                header: 'Ngày hoàn tiền',
            },
            {
                accessorKey: 'amount',
                cell: ({ row }) => formatNumberToCurrency(row.original.amount),
                header: 'Tổng hoàn tiền',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <RefundStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: () => '',
                cell: ({row}) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.View href={`/admin/bills/refund/${row.original.code}`}/>
                    </div>
                ),
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<AdminRefundOverview>(refunds,'refunds.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">

                        <div className="flex gap-2 h-9">
                            <button type="button"
                                    onClick={handleExportExcel}
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <RiFileExcel2Line className="h-5 w-5" /> Export
                            </button>
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-3 gap-4">
                                    <Input name="refundCode" placeholder="Mã đơn hoàn" />
                                    <Input name="orderCode" placeholder="Mã hóa đơn mua" />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<AdminRefundOverview> data={refunds} columns={columns} currentPage={currentPage}
                                      totalPages={totalPages}
                                      isLoading={isLoading}
                                      onChangePage={onPageChange} />
                </Card>
            </div>
        </>
    );
};

export default BillRefundPage;