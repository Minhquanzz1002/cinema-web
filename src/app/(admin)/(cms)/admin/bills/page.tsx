'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import Card from '@/components/Admin/Card';
import { GoSearch } from 'react-icons/go';
import { RiFileExcel2Line } from 'react-icons/ri';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { BaseOrder } from '@/modules/orders/interface';
import { useAllOrders } from '@/modules/orders/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';
import OrderStatusBadge from '@/components/Admin/Badge/OrderStatusBadge';

const OrderPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const { data: responseData } = useAllOrders();
    const [orders, setOrders] = useState<BaseOrder[]>([]);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Đơn hàng';
    }, []);

    const columns = React.useMemo<ColumnDef<BaseOrder>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã hóa đơn',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'user',
                header: 'Khách hàng',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.user.name}</div>
                        <div className="text-xs text-gray-700">{row.original.user.phone}</div>
                    </div>
                ),
                footer: props => props.column.id,
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
                footer: props => props.column.id,
            },
            {
                accessorKey: 'totalPrice',
                cell: ({ row }) => <span>{formatNumberToCurrency(row.original.totalPrice)}</span>,
                header: 'Tổng tiền hàng',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'finalAmount',
                cell: ({ row }) => <span>{formatNumberToCurrency(row.original.finalAmount)}</span>,
                header: 'Thành tiền',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <OrderStatusBadge status={row.original.status}/>,
                header: 'Trạng thái',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({row}) => (
                    <div className="inline-flex gap-2 items-center">
                        <Link href={`/admin/bills/${row.original.code}`} type="button" title="Chi tiết" className="text-gray-600 hover:text-gray-800">
                            <FaEye size={18} />
                        </Link>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<BaseOrder>(orders,'bills.xlsx');
    };

    useEffect(() => {
        if (responseData?.data) {
            const { content, page } = responseData.data;
            setOrders(content);
            setTotalPages(page.totalPages);
            setCurrentPage(page.number + 1);
        }
    }, [responseData]);

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-x-2">
                            <div
                                className="flex flex-nowrap items-center border h-9 px-3 rounded gap-x-1 focus-within:shadow-xl focus-within:border-brand-500 dark:text-white text-gray-500">
                                <GoSearch />
                                <input type="search" className="outline-none w-[300px] text-sm bg-white/0"
                                       placeholder="Tìm theo mã hoặc theo tên (/)" />
                                <button type="button" title="Lọc theo danh mục">
                                    <MdOutlineFormatListBulleted />
                                </button>
                            </div>

                        </div>

                        <div className="flex gap-2 h-9">
                            <button type="button"
                                    onClick={handleExportExcel}
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <RiFileExcel2Line className="h-5 w-5" /> Export
                            </button>
                        </div>
                    </div>
                </Card>
                <Table<BaseOrder> data={orders} columns={columns} currentPage={currentPage}
                                             totalPages={totalPages}
                                             onChangePage={onChangePage} />
            </div>
        </>
    );
};

export default OrderPage;