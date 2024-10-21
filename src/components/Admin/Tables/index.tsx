import React, { useMemo, useState } from 'react';
import {
    ColumnDef,
    ExpandedState,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    Row,
} from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';
import Card from '@/components/Admin/Card';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import Pagination from '@/components/Admin/Pagination';
import { LuChevronDown, LuSearch } from 'react-icons/lu';

type TableProps<T> = {
    data: T[],
    columns: ColumnDef<T>[];
    currentPage: number;
    totalPages: number;
    onChangePage: (page: number) => void;
    children?: React.ReactNode;
    isExpandable?: boolean;
    renderSubComponent?: (props: { row: Row<T> }) => React.ReactNode;
    containerClassName?: string;
    showAllData?: boolean;
}

const Table = <T, >({
                        data,
                        columns,
                        currentPage,
                        totalPages,
                        onChangePage,
                        children,
                        isExpandable = false,
                        renderSubComponent,
                        containerClassName = '',
                        showAllData = false,
                    }: TableProps<T>) => {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const pagination = useMemo(() => ({
        pageIndex: currentPage - 1,
        pageSize: 10,
    }), [currentPage]);

    const expandableColumns = useMemo(() => {
        if (isExpandable) {
            return [
                {
                    id: 'expander',
                    header: '',
                    cell: ({ row }) => (
                        <button
                            title={row.getIsExpanded() ? 'Thu gọn' : 'Mở rộng'}
                            className={`border rounded h-7 aspect-square flex items-center justify-center text-brand-500`}
                            {...{
                                onClick: (e) => {
                                    e.stopPropagation();
                                    row.toggleExpanded();
                                },
                            }}
                        >
                            <LuChevronDown size={20}
                                           className={`transition-transform ${row.getIsExpanded() ? 'transform rotate-180' : ''}`} />
                        </button>
                    ),
                },
                ...columns,
            ];
        }
        return columns;
    }, [columns, isExpandable]);

    const table = useReactTable({
        columns: expandableColumns,
        data,
        debugTable: true,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        getExpandedRowModel: getExpandedRowModel(),
        pageCount: totalPages,
        state: {
            expanded,
            pagination,
        },
    });

    return (
        <Card extra={`h-full w-full sm:overflow-auto px-6 py-4 ${containerClassName}`}>
            {children}
            <div className="w-full overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}
                                        className="text-sm text-gray-800 dark:text-white uppercase border-b border-gray-200 pb-2 pr-4 pt-4">
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none flex items-center justify-between gap-x-3'
                                                    : 'flex justify-start',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {
                                                header.column.getCanSort() && (
                                                    <div className="flex items-center flex-col justify-center">
                                                        <TiArrowSortedUp
                                                            className={`${header.column.getIsSorted() === 'asc' ? 'text-gray-900' : 'text-gray-400'} size-3  translate-y-0.5`} />
                                                        <TiArrowSortedDown
                                                            className={`${header.column.getIsSorted() === 'desc' ? 'text-gray-900' : 'text-gray-400'} size-3 -translate-y-0.5`} />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {
                        table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={expandableColumns.length} className="text-center py-4">
                                    <div className="flex flex-col justify-center items-center gap-4">
                                        <LuSearch size={50} className="text-gray-600" />
                                        <span className="text-sm font-normal">Không có dữ liệu nào được tìm thấy</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => {
                                return (
                                    <React.Fragment key={row.id}>
                                        <tr className={`border-b`}>
                                            {row.getVisibleCells().map(cell => {
                                                return (
                                                    <td key={cell.id}
                                                        className="text-sm dark:text-white py-3 pr-4">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                        {
                                            isExpandable && row.getIsExpanded() && renderSubComponent && (
                                                <tr>
                                                    <td colSpan={expandableColumns.length}>
                                                        {renderSubComponent({ row })}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </React.Fragment>
                                );
                            })
                        )
                    }
                    </tbody>
                </table>
            </div>
            {
                !showAllData && table.getRowModel().rows.length > 0 && (
                    <div className="pt-7">
                        <Pagination totalPages={totalPages} currentPage={currentPage} onChangePage={onChangePage} />
                    </div>
                )
            }
        </Card>
    );
};


export default Table;