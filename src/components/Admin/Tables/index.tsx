import React from 'react';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState
} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import Card from "@/components/Admin/Card";
import {TiArrowSortedDown, TiArrowSortedUp} from "react-icons/ti";
import Pagination from "@/components/Admin/Pagination";

type TableProps<T> = {
    data: T[],
    columns: ColumnDef<T>[];
    currentPage: number;
    totalPages: number;
    onChangePage: (page: number) => void;
}

const Table = <T,>({data, columns, currentPage, totalPages, onChangePage}: TableProps<T>) => {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    })

    return (
        <Card extra="h-full w-full sm:overflow-auto px-6 py-4">
            <div className="w-full mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}
                                        className="text-sm font-bold text-gray-600 dark:text-white uppercase border-b border-gray-200 pb-2 pr-4 pt-4">
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none flex items-center justify-center gap-x-3'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {
                                                header.column.getCanSort() && (
                                                    <div className="flex items-center flex-col justify-center">
                                                        <TiArrowSortedUp
                                                            className={`${header.column.getIsSorted() === 'asc' ? 'text-gray-900' : 'text-gray-400'} size-3  translate-y-0.5`}/>
                                                        <TiArrowSortedDown
                                                            className={`${header.column.getIsSorted() === 'desc' ? 'text-gray-900' : 'text-gray-400'} size-3 -translate-y-0.5`}/>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}
                                            className="text-sm font-bold text-navy-700 dark:text-white py-3 pr-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <div className="pt-7">
                <Pagination totalPages={totalPages} currentPage={currentPage} onChangePage={onChangePage}/>
            </div>
        </Card>
);
};


export default Table;