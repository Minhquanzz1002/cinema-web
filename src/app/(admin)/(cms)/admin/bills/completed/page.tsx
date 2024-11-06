'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Admin/Card';
import { RiFileExcel2Line } from 'react-icons/ri';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { BaseOrder, OrderStatus } from '@/modules/orders/interface';
import { useAllOrders } from '@/modules/orders/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';
import OrderStatusBadge from '@/components/Admin/Badge/OrderStatusBadge';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Filters/Input';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import dayjs from 'dayjs';
import { DatePickerWithRange } from '@/components/Admin/DatePickerWithRange';
import ButtonAction from '@/components/Admin/ButtonAction';

interface BillFilter extends PaginationState{
    code: string;
    fromDate?: Date;
    toDate?: Date;
}

const BillPage = () => {
    const [filters, setFilters] = useState<BillFilter>({
        page: 1,
        code: '',
    });

    const productsQuery = useAllOrders({
        page: filters.page - 1,
        code: filters.code,
        status: OrderStatus.COMPLETED,
        fromDate: filters.fromDate ? dayjs(filters.fromDate).format('YYYY-MM-DD') : undefined,
        toDate: filters.toDate ? dayjs(filters.toDate).format('YYYY-MM-DD') : undefined,
    });

    const {
        data: orders,
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

    const columns = React.useMemo<ColumnDef<BaseOrder>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã hóa đơn',
            },
            {
                accessorKey: 'user',
                header: 'Khách hàng',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.user?.name || 'Khách hàng vãng lai'}</div>
                        <div className="text-xs text-gray-700">{row.original.user?.phone}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'orderDate',
                header: 'Thời gian đặt',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{formatDateInOrder(row.original.orderDate)}</div>
                        <div className="text-xs text-gray-700">{timeFromNow(row.original.orderDate)}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'totalPrice',
                cell: ({ row }) => formatNumberToCurrency(row.original.totalPrice),
                header: 'Tổng tiền hàng',
            },
            {
                accessorKey: 'finalAmount',
                cell: ({ row }) => formatNumberToCurrency(row.original.finalAmount),
                header: 'Thành tiền',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <OrderStatusBadge status={row.original.status}/>,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: () => '',
                cell: ({row}) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/admin/bills/completed/${row.original.code}`}/>
                        <ButtonAction.Refund />
                    </div>
                ),
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<BaseOrder>(orders,'bills.xlsx');
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
                                    <Input name="code" placeholder="Mã hóa đơn" />
                                    <DatePickerWithRange fromName="fromDate" toName="toDate"/>
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<BaseOrder> data={orders} columns={columns} currentPage={currentPage}
                                      totalPages={totalPages}
                                      isLoading={isLoading}
                                      onChangePage={onPageChange} />
                </Card>
            </div>
        </>
    );
};

export default BillPage;