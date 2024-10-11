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
import { BaseProductWithPrice } from '@/modules/products/interface';
import { useAllProducts } from '@/modules/products/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';

const ProductPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [displayType, setDisplayType] = useState<'Grid' | 'Table'>('Table');
    const { data: responseData } = useAllProducts();
    const [products, setProducts] = useState<BaseProductWithPrice[]>([]);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Diễn viên';
    }, []);

    const columns = React.useMemo<ColumnDef<BaseProductWithPrice>[]>(
        () => [
            {
                accessorKey: 'code',
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">Mã sản phẩm</p>
                ),
                footer: props => props.column.id,
            },
            {
                accessorKey: 'image',
                cell: ({ row }) => {
                    return (
                        <div className="w-20 h-20 relative rounded shadow overflow-hidden">
                            <Image src={row.original.image} alt={row.original.name} fill
                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                   priority className="rounded-md object-cover w-20 h-20" />
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
                accessorKey: 'price',
                cell: ({ row }) => <span>{formatNumberToCurrency(row.original.price)}</span>,
                header: () => <span>Giá hiện tại</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'description',
                cell: ({ row }) => <span>{row.original.description}</span>,
                header: () => <span>Mô tả</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: () => (
                    <div className="inline-flex gap-2 items-center">
                        <Link href="#" type="button" className="text-blue-500" title="Chỉnh sửa">
                            <FaEdit size={18} />
                        </Link>
                        <button type="button" className="text-red-500" title="Xóa">
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
        exportToExcel<BaseProductWithPrice>(products, [], 'products.xlsx');
    };

    useEffect(() => {
        if (responseData?.data) {
            const { content, page } = responseData.data;
            setProducts(content);
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
                <Table<BaseProductWithPrice> data={products} columns={columns} currentPage={currentPage}
                                             totalPages={totalPages}
                                             onChangePage={onChangePage} />
            </div>
        </>
    );
};

export default ProductPage;