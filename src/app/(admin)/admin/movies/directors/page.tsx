'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import { LuTrash } from 'react-icons/lu';
import Card from '@/components/Admin/Card';
import { GoSearch } from 'react-icons/go';
import { ButtonSquare } from '@/components/Admin/Button';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import { FaFileImport, FaPlus } from 'react-icons/fa6';
import { RiFileExcel2Line } from 'react-icons/ri';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import avatar from '/public/img/avatar/avt.png';
import { Director } from '@/modules/directors/interface';
import { useAllDirectors } from '@/modules/directors/repository';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';

const DirectorPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [displayType, setDisplayType] = useState<'Grid' | 'Table'>('Table');
    const { data: responseData } = useAllDirectors();
    const [directors, setDirectors] = useState<Director[]>([]);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Đạo diễn';
    }, []);

    const columns = React.useMemo<ColumnDef<Director>[]>(
        () => [
            {
                accessorKey: 'id',
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">ID</p>
                ),
                footer: props => props.column.id,
            },
            {
                accessorKey: 'image',
                cell: ({ row }) => {
                    return (
                        <div className="w-14 h-14 relative rounded shadow overflow-hidden">
                            {
                                row.original.image ?
                                    <Image src={row.original.image} alt={row.original.name} fill
                                           className="rounded-md object-cover"
                                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                           priority /> :
                                    <Image src={avatar} alt={row.original.name} fill className="object-cover"
                                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                            }
                        </div>
                    );
                },
                header: () => <span>Ảnh</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'name',
                header: () => <span>Tên</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'country',
                cell: ({ row }) => <span>{row.original.country || 'Chưa cập nhật'}</span>,
                header: () => <span>Quốc gia</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status}/>,
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
        exportToExcel<Director>(directors, [], 'directors.xlsx');
    };

    useEffect(() => {
        if (responseData?.data) {
            const { content, page } = responseData.data;
            setDirectors(content);
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

                            <ButtonSquare title={displayType !== 'Grid' ? 'Hiển thị dạng thẻ' : 'Hiển thị dạng bảng'}
                                          onClick={() => setDisplayType(displayType === 'Grid' ? 'Table' : 'Grid')}>
                                {
                                    displayType !== 'Grid' ? <BsGrid3X3Gap /> : <PiListBold />
                                }
                            </ButtonSquare>

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
                <Table<Director> data={directors} columns={columns} currentPage={currentPage} totalPages={totalPages}
                                 onChangePage={onChangePage} />
            </div>
        </>
    );
};

export default DirectorPage;