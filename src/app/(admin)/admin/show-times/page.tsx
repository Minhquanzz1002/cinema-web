'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
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
import { AdminShowTime } from '@/modules/showTimes/interface';
import { useAllShowTimes } from '@/modules/showTimes/repository';
import { formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';

const ShowTimePage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const { data: responseData } = useAllShowTimes({page: currentPage - 1});
    const [showTimes, setShowTimes] = useState<AdminShowTime[]>([]);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Diễn viên';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminShowTime>[]>(
        () => [
            {
                accessorKey: 'movieTitle',
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.movieTitle}
                        </div>
                    );
                },
                header: () => <span>Phim</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'cinemaName',
                header: () => <span>Rạp</span>,
                cell: ({ row }) => {
                    return (
                        <div className="">
                            <div>{row.original.cinemaName}</div>
                        </div>
                    );
                },
                footer: props => props.column.id,
            },
            {
                accessorKey: 'roomName',
                header: () => <span>Phòng</span>,
                cell: ({ row }) => {
                    return (
                        <div className="">
                            <div>{row.original.roomName}</div>
                        </div>
                    );
                },
                footer: props => props.column.id,
            },
            {
                accessorKey: 'startDate',
                header: () => <span>Phòng</span>,
                cell: ({ row }) => {
                    return (
                        <div className="">
                            <div>{formatDateToLocalDate(row.original.startDate)}</div>
                        </div>
                    );
                },
                footer: props => props.column.id,
            },
            {
                accessorKey: 'startTime',
                cell: ({ row }) => (
                    <div className="">
                        <div>{`${formatTime(row.original.startTime)} - ${formatTime(row.original.endTime)}`}</div>
                    </div>
                ),
                header: () => <span>Suất chiếu</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => (<BaseStatusBadge status={row.original.status}/>),
                header: () => <span>Trạng thái</span>,
                footer: props => props.column.id,
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

    const handleExportExcel = () => {
        exportToExcel<AdminShowTime>(showTimes, [], 'showTimes.xlsx');
    };

    useEffect(() => {
        if (responseData?.data) {
            const { content, page } = responseData.data;
            setShowTimes(content);
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
                <Table<AdminShowTime> data={showTimes} columns={columns} currentPage={currentPage} totalPages={totalPages}
                              onChangePage={onChangePage} />
            </div>
        </>
    );
};

export default ShowTimePage;