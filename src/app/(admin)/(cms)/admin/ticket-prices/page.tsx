'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef, Row } from '@tanstack/table-core';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import {
    AdminTicketPriceLineOverview,
    AdminTicketPriceOverview,
    ApplyForDayVietnamese,
} from '@/modules/ticketPrices/interface';
import { useAllTicketPrices, useDeleteTicketPrice, useDeleteTicketPriceLine } from '@/modules/ticketPrices/repository';
import ButtonAction from '@/components/Admin/ButtonAction';
import ModalAddTicketPrice from '@/components/Admin/Pages/TicketPrice/ModalAddTicketPrice';
import ModalAddTicketPriceLine from '@/components/Admin/Pages/TicketPrice/ModalAddTicketPriceLine';
import ModalUpdateTicketPrice from '@/components/Admin/Pages/TicketPrice/ModalUpdateTicketPrice';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Input';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import { SeatTypeVietnamese } from '@/modules/seats/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { FaPlus } from 'react-icons/fa6';
import { LuSearch } from 'react-icons/lu';
import ModalUpdateTicketPriceLine from '@/components/Admin/Pages/TicketPrice/ModalUpdateTicketPriceLine';
import dayjs from 'dayjs';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import { DatePickerWithRange } from '@/components/Admin/DatePickerWithRange';
import ModalCopyTicketPrice from '@/components/Admin/Pages/TicketPrice/ModalCopyTicketPrice';

interface TicketPriceFilter extends PaginationState {
    name: string;
    startDate?: Date;
    endDate?: Date;
    status: BaseStatus | 'ALL';
}

const TicketPricePage = () => {
    const deleteTicketPrice = useDeleteTicketPrice();
    const deleteTicketPriceLine = useDeleteTicketPriceLine();
    const [filters, setFilters] = useState<TicketPriceFilter>({
        page: 1,
        name: '',
        status: 'ALL',
    });
    const [showModalAddTicketPrice, setShowModalAddTicketPrice] = useState<boolean>(false);
    const [ticketPriceToUpdate, setTicketPriceToUpdate] = useState<AdminTicketPriceOverview | null>(null);
    const [ticketPriceToUpdateTicketPriceLine, setTicketPriceToUpdateTicketPriceLine] = useState<AdminTicketPriceOverview | null>(null);
    const [ticketPriceLineToUpdate, setTicketPriceLineToUpdate] = useState<AdminTicketPriceLineOverview | null>(null);
    const [ticketPriceToAddNewLine, setTicketPriceToAddNewLine] = useState<AdminTicketPriceOverview | null>(null);
    const [ticketPriceToCopy, setTicketPriceToCopy] = useState<AdminTicketPriceOverview | null>(null);

    const ticketPricesQuery = useAllTicketPrices({
        page: filters.page - 1,
        name: filters.name,
        startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : undefined,
        endDate: filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : undefined,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    /**
     * Custom hooks CRUD
     */
    const {
        data: ticketPrices,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: ticketPricesQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteTicketPriceModal = useDeleteModal<AdminTicketPriceOverview>({
        onDelete: async (ticketPrice) => {
            await deleteTicketPrice.mutateAsync(ticketPrice.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (ticketPrice) => ticketPrice.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa bảng giá đang hoạt động',
    });

    const deleteTicketPriceLineModal = useDeleteModal<AdminTicketPriceLineOverview>({
        onDelete: async (ticketPriceLine) => {
            console.log('delete ticket price line', ticketPriceLine);
            await deleteTicketPriceLine.mutateAsync(ticketPriceLine.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        unableDeleteMessage: 'Không thể xóa giá vé đang hoạt động',
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Giá vé';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminTicketPriceOverview>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
            },
            {
                accessorKey: 'name',
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
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Copy onClick={() => setTicketPriceToCopy(row.original)} />
                        <ButtonAction.Update onClick={() => setTicketPriceToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => deleteTicketPriceModal.openDeleteModal(row.original)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [deleteTicketPriceModal],
    );

    const renderSubComponent = React.useCallback(
        ({ row }: { row: Row<AdminTicketPriceOverview> }) => (
            <div className="bg-gray-100">
                <div className="ml-14 bg-white overflow-x-scroll xl:overflow-x-hidden">
                    <table className="w-full">
                        <thead>
                        <tr className="h-10 border-t">
                            <td className="text-tiny font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">Mã</td>
                            <td className="text-tiny font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Thứ áp dụng
                            </td>
                            <td className="text-tiny font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Bắt đầu
                            </td>
                            <td className="text-tiny font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">
                                Kết thúc
                            </td>
                            <td className="text-tiny font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">Giá</td>
                            <td className="text-tiny font-bold text-gray-800 dark:text-white uppercase border-gray-200 px-4 py-2 first-of-type:pr-0">
                                {
                                    row.original.status !== BaseStatus.ACTIVE ? (
                                        <div className="flex justify-end">
                                            <button className="bg-brand-500 text-white px-2 py-1.5 rounded-md"
                                                    onClick={() => setTicketPriceToAddNewLine(row.original)}>
                                                <FaPlus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : null
                                }
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            row.original.ticketPriceLines.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 border-t ">
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            <LuSearch size={50} className="text-gray-600" />
                                            <span
                                                className="text-sm font-normal">Không có dữ liệu nào được tìm thấy</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                row.original.ticketPriceLines.map((line) => (
                                    <tr key={line.id} className="border-t last-of-type:border-b">
                                        <td className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">{line.id}</td>
                                        <td className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">{line.applyForDays.map(day => ApplyForDayVietnamese[day]).join(', ')}</td>
                                        <td className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">{formatTime(line.startTime)}</td>
                                        <td className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">{formatTime(line.endTime)}</td>
                                        <td className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">
                                            {
                                                line.ticketPriceDetails.map((detail) => (
                                                    <div key={detail.id} className="flex justify-between">
                                                        <span>{SeatTypeVietnamese[detail.seatType]}</span>
                                                        <span>{formatNumberToCurrency(detail.price)}</span>
                                                    </div>
                                                ))
                                            }
                                        </td>
                                        <td className="text-sm dark:text-white px-4 py-2 first-of-type:pr-0">
                                            <div className="flex gap-2 items-center justify-end">
                                                <ButtonAction.Update
                                                    disabled={row.original.status === BaseStatus.ACTIVE}
                                                    onClick={() => {
                                                        setTicketPriceToUpdateTicketPriceLine(row.original);
                                                        setTicketPriceLineToUpdate(line);
                                                    }} />
                                                <ButtonAction.Delete
                                                    onClick={() => deleteTicketPriceLineModal.openDeleteModal(line)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        ),
        [deleteTicketPriceLineModal],
    );

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">

                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add onClick={() => setShowModalAddTicketPrice(true)} />
                        </div>
                    </div>
                </Card>

                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid sm-max:grid-cols-1 grid-cols-3 gap-4">
                                    <Input name="name" placeholder="Tên bảng giá" />
                                    <DatePickerWithRange />
                                    <Select name="status"
                                            options={[
                                                { label: 'Tất cả', value: 'ALL' },
                                                ...Object.keys(BaseStatus).map((status) => ({
                                                    label: BaseStatusVietnamese[status as BaseStatus],
                                                    value: status,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<AdminTicketPriceOverview> data={ticketPrices} columns={columns} currentPage={currentPage}
                                                     totalPages={totalPages}
                                                     onChangePage={onPageChange}
                                                     isExpandable={true}
                                                     isLoading={isLoading}
                                                     renderSubComponent={renderSubComponent}
                    />
                </Card>
            </div>
            <ModalDeleteAlert onConfirm={deleteTicketPriceModal.handleDelete}
                              onClose={deleteTicketPriceModal.closeDeleteModal}
                              isOpen={deleteTicketPriceModal.showDeleteModal}
                              title="Xác nhận xóa bảng giá"
                              content={
                                  <>Bạn có chắc chắc muốn xóa bảng
                                      giá <HighlightedText>{deleteTicketPriceModal.selectedData?.name}</HighlightedText> không?</>
                              }
            />
            <ModalDeleteAlert onConfirm={deleteTicketPriceLineModal.handleDelete}
                              onClose={deleteTicketPriceLineModal.closeDeleteModal}
                              isOpen={deleteTicketPriceLineModal.showDeleteModal}
                              title="Xác nhận xóa giá vé"
                              content={
                                  <>Bạn có chắc chắc muốn xóa giá
                                      vé <HighlightedText>{deleteTicketPriceLineModal.selectedData?.applyForDays.map((day) => ApplyForDayVietnamese[day]).join(', ')}</HighlightedText> không?</>
                              }
            />

            {
                showModalAddTicketPrice && (
                    <ModalAddTicketPrice onClose={() => setShowModalAddTicketPrice(false)} />
                )
            }
            <ModalAddTicketPriceLine onClose={() => setTicketPriceToAddNewLine(null)}
                                     ticketPrice={ticketPriceToAddNewLine} />

            <ModalUpdateTicketPriceLine onClose={() => {
                setTicketPriceToUpdateTicketPriceLine(null);
                setTicketPriceLineToUpdate(null);
            }}
                                        ticketPrice={ticketPriceToUpdateTicketPriceLine}
                                        ticketPriceLine={ticketPriceLineToUpdate}
            />
            <ModalUpdateTicketPrice onClose={() => setTicketPriceToUpdate(null)}
                                    ticketPrice={ticketPriceToUpdate} />

            {
                ticketPriceToCopy && (
                    <ModalCopyTicketPrice onClose={() => setTicketPriceToCopy(null)} ticketPrice={ticketPriceToCopy} />
                )
            }
        </>
    );
};

export default TicketPricePage;