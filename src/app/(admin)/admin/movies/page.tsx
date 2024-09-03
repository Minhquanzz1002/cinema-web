"use client";
import React, {useEffect, useState} from 'react';
// const Table = dynamic(() => import("@/components/Admin/Tables"), { ssr: false })
import {makeData, Person} from "@/variables/tables/makeData";
import {ColumnDef} from "@tanstack/table-core";
import Table from "@/components/Admin/Tables";
import {LuTrash} from "react-icons/lu";
import {FaEdit} from "react-icons/fa";
import Link from "next/link";

const Movies = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(10);

    const onChangePage = (page: number) => {
        setData(makeData(10));
        setCurrentPage(page);
    }

    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'firstName',
                header: () =>  (
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
        <div>
            <Table<Person> data={data} columns={columns} currentPage={currentPage} totalPages={totalPages} onChangePage={onChangePage}/>
        </div>
    );
};

export default Movies;