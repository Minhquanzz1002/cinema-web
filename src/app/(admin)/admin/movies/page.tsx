"use client";
import React, {useEffect, useState} from 'react';
import {makeData, Person} from "@/variables/tables/makeData";
import {ColumnDef} from "@tanstack/table-core";
import Table from "@/components/Admin/Tables";
import {LuTrash} from "react-icons/lu";
import {FaEdit} from "react-icons/fa";
import Link from "next/link";
import Card from "@/components/Admin/Card";
import {RiFileExcel2Line} from "react-icons/ri";
import {FaFileImport, FaPlus} from "react-icons/fa6";
import {MdCancel, MdCheckCircle, MdOutlineFormatListBulleted} from "react-icons/md";
import {GoSearch} from "react-icons/go";
import {BsGrid3X3Gap} from "react-icons/bs";
import {PiListBold} from "react-icons/pi";
import FilterModal from "@/components/Admin/Pages/Movies/FilterModal";
import AddModal from "@/components/Admin/Pages/Movies/AddModal";
import ImportModal from "@/components/Admin/Pages/Movies/ImportModal";

const Movies = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(10);
    const [displayType, setDisplayType] = useState<"Grid" | "Table">("Table");
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);

    const onChangePage = (page: number) => {
        setData(makeData(10));
        setCurrentPage(page);
    }

    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'firstName',
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">First name</p>
                ),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.lastName,
                id: 'lastName',
                cell: info => info.getValue(),
                header: () => <span>Last Name</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'age',
                header: () => 'Age',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({cell}) => {
                    if (cell.getValue() === 'ACTIVE') {
                        return <div className="flex items-center gap-x-2"><MdCheckCircle
                            className="text-green-500 dark:text-green-300"/>Bình thường</div>
                    } else {
                        return <div className="flex items-center gap-x-2"><MdCancel
                            className="text-red-500 dark:text-red-300"/>Hết hàng</div>
                    }
                },
                footer: props => props.column.id,
            },
            {
                accessorKey: 'progress',
                header: 'Profile Progress',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: () => (
                    <div className="inline-flex gap-2 items-center">
                        <Link href="#" type="button" className="text-blue-500">
                            <FaEdit size={18}/>
                        </Link>
                        <button type="button" className="text-red-500">
                            <LuTrash size={18}/>
                        </button>
                    </div>
                ),
                enableSorting: false,
            }
        ],
        []
    )

    const [data, setData] = React.useState<Person[]>([]);

    useEffect(() => {
        setData(makeData(10));
    }, []);

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-x-2">
                            <div
                                className="flex flex-nowrap items-center border h-9 px-3 rounded gap-x-1 focus-within:shadow-xl focus-within:border-brand-500 dark:text-white text-gray-500">
                                <GoSearch/>
                                <input type="search" className="outline-none w-[300px] text-sm bg-white/0"
                                       placeholder="Tìm theo mã hoặc theo tên (/)"/>
                                <button type="button" title="Lọc theo danh mục" onClick={() => setShowFilter(true)}>
                                    <MdOutlineFormatListBulleted/>
                                </button>
                            </div>

                            <button type="button"
                                    onClick={() => setDisplayType(displayType === 'Grid' ? 'Table' : 'Grid')}
                                    title={displayType !== 'Grid' ? 'Hiển thị dạng thẻ' : 'Hiển thị dạng bảng'}
                                    className="bg-brand-500 h-9 aspect-square rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                {
                                    displayType !== "Grid" ? <BsGrid3X3Gap/> : <PiListBold/>
                                }
                            </button>

                        </div>

                        <div className="flex gap-2 h-9">
                            <button type="button"
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <FaPlus className="h-4 w-4"/> Thêm
                            </button>
                            <button type="button"
                                    onClick={() => setShowImportModal(true)}
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <FaFileImport className="h-4 w-4"/> Import
                            </button>
                            <button type="button"
                                    className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                                <RiFileExcel2Line className="h-5 w-5"/> Export
                            </button>
                        </div>
                    </div>
                </Card>
                <Table<Person> data={data} columns={columns} currentPage={currentPage} totalPages={totalPages}
                               onChangePage={onChangePage}/>
            </div>
            {
                showFilter && (<FilterModal onClose={() => setShowFilter(false)}/>)
            }
            {
                showAddModal && <AddModal onClose={() => setShowAddModal(false)}/>
            }
            {
                showImportModal && <ImportModal onClose={() => setShowImportModal(false)}/>
            }
        </>
    );
};

export default Movies;