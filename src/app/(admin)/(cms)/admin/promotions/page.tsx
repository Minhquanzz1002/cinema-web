'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ColumnDef, Row } from '@tanstack/table-core';
import Image from 'next/image';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import { LuTrash } from 'react-icons/lu';
import Card from '@/components/Admin/Card';
import { GoSearch } from 'react-icons/go';
import { FaFileImport, FaPlus } from 'react-icons/fa6';
import { RiFileExcel2Line } from 'react-icons/ri';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import avatar from '/public/img/avatar/avt.png';
import {
    AdminPromotionLineOverview,
    AdminPromotionOverview,
    PromotionLineTypeVietnamese,
} from '@/modules/promotions/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';
import usePagination from '@/hook/usePagination';
import { useAllPromotions } from '@/modules/promotions/repository';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import ButtonAction from '@/components/Admin/ButtonAction';

const PromotionPage = () => {
    const [page, setPage] = useState(0);

    const promotionsQuery = useAllPromotions({
        page,
        name: undefined,
        code: undefined,
    });

    const {
        currentPage,
        totalPages,
        data: promotions,
        onChangePage,
    } = usePagination<AdminPromotionOverview>({
        queryResult: promotionsQuery,
        initialPage: 1,
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage - 1);
        onChangePage(newPage);
    }, [onChangePage]);

    useEffect(() => {
        document.title = 'B&Q Cinema - Khuyến mãi';
    }, []);

    const promotionLineColumns = React.useMemo<ColumnDef<AdminPromotionLineOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã khuyến mãi',
            },
            {
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div>
                        <div>{row.original.name}</div>
                        {/*<div className="text-sm text-gray-800 font-normal">Mô tả: {row.original.description || "Chưa cập nhật"}</div>*/}
                    </div>
                ),
                header: 'Tên',
            },
            {
                accessorKey: 'type',
                cell: ({ row }) => <span>{PromotionLineTypeVietnamese[row.original.type]}</span>,
                header: 'Loại',
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
                cell: () => (
                    <div className="inline-flex gap-2 items-center">
                        <Link href="#" type="button" className="text-blue-500">
                            <FaEdit size={18} />
                        </Link>
                        <button type="button" className="text-red-500">
                            <LuTrash size={18} />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    // const promotionDetailColumns = React.useMemo<ColumnDef<AdminPromotionDetailOverview>[]>(
    //     () => [
    //         {
    //             header: 'Thông tin giảm giá',
    //             columns: [
    //                 {
    //                     accessorKey: 'discountValue',
    //                     header: 'Giá trị giảm',
    //                     cell: ({ row }) => `${row.original.discountValue}%`,
    //                 },
    //                 {
    //                     accessorKey: 'maxDiscountValue',
    //                     header: 'Giảm tối đa',
    //                     cell: ({ row }) => `${row.original.maxDiscountValue.toLocaleString()} VND`,
    //                 },
    //                 {
    //                     accessorKey: 'minOrderValue',
    //                     header: 'Đơn tối thiểu',
    //                     cell: ({ row }) => `${row.original.minOrderValue.toLocaleString()} VND`,
    //                 },
    //             ],
    //         },
    //         {
    //             header: 'Điều kiện áp dụng',
    //             columns: [
    //                 // {
    //                 //     accessorKey: 'requiredProduct',
    //                 //     header: 'Sản phẩm yêu cầu',
    //                 //     cell: ({ row }) => row.original.requiredProduct.name,
    //                 // },
    //                 {
    //                     accessorKey: 'requiredProductQuantity',
    //                     header: 'Số lượng',
    //                 },
    //                 {
    //                     accessorKey: 'requiredSeatType',
    //                     header: 'Loại ghế',
    //                 },
    //                 {
    //                     accessorKey: 'requiredSeatQuantity',
    //                     header: 'Số lượng ghế',
    //                 },
    //             ],
    //         },
    //         {
    //             header: 'Giới hạn sử dụng',
    //             columns: [
    //                 {
    //                     accessorKey: 'usageLimit',
    //                     header: 'Giới hạn',
    //                 },
    //                 {
    //                     accessorKey: 'currentUsageCount',
    //                     header: 'Đã sử dụng',
    //                 },
    //             ],
    //         },
    //         {
    //             accessorKey: 'status',
    //             cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
    //             header: 'Trạng thái',
    //         },
    //         {
    //             accessorKey: 'actions',
    //             header: () => '',
    //             cell: () => (
    //                 <div className="inline-flex gap-2 items-center">
    //                     <Link href="#" type="button" className="text-blue-500">
    //                         <FaEdit size={18} />
    //                     </Link>
    //                     <button type="button" className="text-red-500">
    //                         <LuTrash size={18} />
    //                     </button>
    //                 </div>
    //             ),
    //             enableSorting: false,
    //         },
    //     ],
    //     [],
    // );

    const renderSubComponent = React.useCallback(
        ({ row }: { row: Row<AdminPromotionOverview> }) => (
            <div className="pl-6 py-4 border-l-2 ">
                <div>
                    <Table<AdminPromotionLineOverview> data={row.original.promotionLines}
                                                       columns={promotionLineColumns}
                                                       currentPage={currentPage}
                                                       totalPages={totalPages}
                                                       onChangePage={handlePageChange}
                                                       showAllData={true}
                                                       // isExpandable={true}
                                                       // renderSubComponent={renderPromotionDetail}
                    >
                        <div className="flex justify-between items-center">
                            <div className="font-semibold">Danh sách chương trình:</div>
                            <div>
                                <ButtonAction.Add text="Thêm chương trình" />
                            </div>
                        </div>
                    </Table>
                </div>
            </div>
        ),
        [],
    );

    // const renderPromotionDetail = React.useCallback(
    //     ({ row }: { row: Row<AdminPromotionLineOverview> }) => (
    //         <div className="pl-6 py-4 border-l-2 ">
    //             <div>
    //                 <Table<AdminPromotionDetailOverview> data={row.original.promotionDetails}
    //                                                      columns={promotionDetailColumns}
    //                                                      currentPage={currentPage}
    //                                                      totalPages={totalPages}
    //                                                      onChangePage={handlePageChange}
    //                                                      showAllData={true}
    //                                                      containerClassName="!px-0"
    //                 >
    //                     <div className="flex justify-between items-center">
    //                         <div className="font-semibold">Danh sách chương trình:</div>
    //                         <div>
    //                             <ButtonAction.Add text="Thêm hàng mới" />
    //                         </div>
    //                     </div>
    //                 </Table>
    //             </div>
    //         </div>
    //     ),
    //     [],
    // );

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
                enableSorting: false,
            },
            {
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div>
                        <div>{row.original.name}</div>
                        <div className="text-sm text-gray-800 font-normal">Mô
                            tả: {row.original.description || 'Chưa cập nhật'}</div>
                    </div>
                ),
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
                cell: () => (
                    <div className="inline-flex gap-2 items-center">
                        <Link href="#" type="button" className="text-blue-500">
                            <FaEdit size={18} />
                        </Link>
                        <button type="button" className="text-red-500">
                            <LuTrash size={18} />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<AdminPromotionOverview>(promotions, 'promotions.xlsx');
    };

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
                            <Link href={'/admin/movies/new'}
                                  className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <FaPlus className="h-4 w-4" /> Thêm
                            </Link>
                            <button type="button"
                                // onClick={() => setShowImportModal(true)}
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <FaFileImport className="h-4 w-4" /> Import
                            </button>
                            <button type="button"
                                    onClick={handleExportExcel}
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <RiFileExcel2Line className="h-5 w-5" /> Export
                            </button>
                        </div>
                    </div>
                </Card>
                <Table<AdminPromotionOverview> data={promotions} columns={columns} currentPage={currentPage}
                                               totalPages={totalPages}
                                               renderSubComponent={renderSubComponent}
                                               onChangePage={handlePageChange} isExpandable={true}
                />
            </div>
        </>
    );
};

export default PromotionPage;