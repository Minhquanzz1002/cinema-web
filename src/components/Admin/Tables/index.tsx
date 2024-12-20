import React, { useMemo, useState } from 'react';
import { ColumnDef, ExpandedState, getCoreRowModel, getExpandedRowModel, Row } from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';
import Pagination from '@/components/Admin/Pagination';
import { LuChevronDown } from 'react-icons/lu';
import EmptyState from '@/components/Admin/Tables/EmptyState';
import TableSkeleton from '@/components/Admin/Tables/TableSkeleton';

type TableProps<T> = {
    data: T[],
    columns: ColumnDef<T>[];
    currentPage: number;
    totalPages: number;
    onChangePage: (page: number) => void;
    children?: React.ReactNode;
    isExpandable?: boolean;
    renderSubComponent?: (props: { row: Row<T> }) => React.ReactNode;
    showAllData?: boolean;
    isLoading?: boolean;
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
                        showAllData = false,
                        isLoading = false,
                    }: TableProps<T>) => {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const pagination = useMemo(() => ({
        pageIndex: currentPage - 1,
        pageSize: 5,
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
                            className={`border rounded h-7 aspect-square flex items-center justify-center text-brand-500 bg-white`}
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
        manualPagination: true,
        getExpandedRowModel: getExpandedRowModel(),
        pageCount: totalPages,
        state: {
            expanded,
            pagination,
        },
    });

    return (
        <div>
            {children}
            <div className="w-full overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="h-14 border-t">
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}
                                        className="text-tiny text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">
                                        <div className="flex justify-start"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {
                        isLoading ? (
                            <TableSkeleton columnCount={expandableColumns.length} />
                        ) : table.getRowModel().rows.length === 0 ? (
                            <EmptyState colSpan={expandableColumns.length} />
                        ) : (
                            table.getRowModel().rows.map(row => {
                                return (
                                    <React.Fragment key={row.id}>
                                        <tr className={`border-t last-of-type:border-b ${isExpandable && row.getIsExpanded() ? 'bg-gray-100' : ''}`}>
                                            {row.getVisibleCells().map(cell => {
                                                return (
                                                    <td key={cell.id}
                                                        className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">
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
                                                    <td colSpan={expandableColumns.length} className="p-0">
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
                !isLoading && !showAllData && table.getRowModel().rows.length > 0 && (
                    <div className="pt-7">
                        <Pagination totalPages={totalPages} currentPage={currentPage} onChangePage={onChangePage} />
                    </div>
                )
            }
        </div>
    );
};


export default Table;