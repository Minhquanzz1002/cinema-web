'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import { LuTrash } from 'react-icons/lu';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import Card from '@/components/Admin/Card';
import { RiFileExcel2Line } from 'react-icons/ri';
import { FaFileImport, FaPlus } from 'react-icons/fa6';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import FilterModal from '@/components/Admin/Pages/Movies/FilterModal';
import ImportModal from '@/components/Admin/Pages/Movies/ImportModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { AdminMovie, AgeRating } from '@/modules/movies/interface';
import { useAllMovies } from '@/modules/movies/repository';
import Image from 'next/image';
import { ButtonSquare } from '@/components/Admin/Button';
import MovieStatusBadge from '@/components/Admin/Badge/MovieStatusBadge';

const MoviePage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [displayType, setDisplayType] = useState<'Grid' | 'Table'>('Table');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const { data: responseData } = useAllMovies();
    const [movies, setMovies] = React.useState<AdminMovie[]>([]);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Quản lý phim';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminMovie>[]>(
        () => [
            {
                accessorKey: 'id',
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">ID</p>
                ),
                footer: props => props.column.id,
            },
            {
                accessorKey: 'imagePortrait',
                cell: ({ row }) => {
                    return (
                        <div className="w-28 h-40 relative">
                            <Image src={row.original.imagePortrait} alt={row.original.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="rounded-md object-cover" priority />
                        </div>
                    );
                },
                header: () => <span>Ảnh</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => ({ title: row.title, ageRating: row.ageRating }),
                id: 'titleAndAge',
                cell: ({ getValue }) => {
                    const { title, ageRating } = getValue() as { title: string; ageRating: AgeRating };
                    return (
                        <div className="flex flex-col gap-2">
                            <div>{title}</div>
                            <div>
                                <span className="px-2 py-1 bg-brand-300 rounded text-white">{ageRating}</span>
                            </div>
                        </div>
                    );
                },
                header: () => <span>Tiêu đề</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'duration',
                header: () => <span>Thời lượng (phút)</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'country',
                header: () => <span>Quốc gia</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <MovieStatusBadge status={row.original.status}/>
                ),
                footer: props => props.column.id,
            },
            {
                accessorKey: 'rating',
                header: 'Đánh giá',
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
        exportToExcel<AdminMovie>(movies, [], 'person.xlsx');
    };

    useEffect(() => {
        if (responseData?.data) {
            const { content, page } = responseData.data;
            setMovies(content);
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
                                <button type="button" title="Lọc theo danh mục" onClick={() => setShowFilter(true)}>
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
                                    onClick={() => setShowImportModal(true)}
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
                <Table<AdminMovie> data={movies} columns={columns} currentPage={currentPage} totalPages={totalPages}
                                   onChangePage={onChangePage} />
            </div>
            {
                showFilter && (<FilterModal onClose={() => setShowFilter(false)} />)
            }
            {
                showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />
            }
        </>
    );
};

export default MoviePage;