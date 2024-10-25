'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef, Row } from '@tanstack/table-core';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import usePagination from '@/hook/usePagination';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import {
    AdminTicketPriceDetailOverview,
    AdminTicketPriceLineOverview,
    AdminTicketPriceOverview,
    ApplyForDayVietnamese,
} from '@/modules/ticketPrices/interface';
import { TICKET_PRICES_QUERY_KEY, useAllTicketPrices, useDeleteTicketPrice } from '@/modules/ticketPrices/repository';
import ButtonAction from '@/components/Admin/ButtonAction';
import { SeatTypeVietnamese } from '@/modules/seats/interface';
import ModalAddTicketPrice from '@/components/Admin/Pages/TicketPrice/ModalAddTicketPrice';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ModalAlert from '@/components/Admin/ModalAlert';
import ModalAddTicketPriceLine from '@/components/Admin/Pages/TicketPrice/ModalAddTicketPriceLine';
import ModalUpdateTicketPrice from '@/components/Admin/Pages/TicketPrice/ModalUpdateTicketPrice';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ModalAddTicketPriceDetail from '@/components/Admin/Pages/TicketPrice/ModalAddTicketPriceDetail';

const TicketPricePage = () => {
    const queryClient = useQueryClient();
    const deleteTicketPrice = useDeleteTicketPrice();
    const [showModalAddTicketPrice, setShowModalAddTicketPrice] = useState<boolean>(false);
    const [showModalAddTicketPriceLine, setShowModalAddTicketPriceLine] = useState<boolean>(false);
    const [ticketPriceToDelete, setTicketPriceToDelete] = useState<AdminTicketPriceOverview | null>(null);
    const [ticketPriceToUpdate, setTicketPriceToUpdate] = useState<AdminTicketPriceOverview | null>(null);
    const [page, setPage] = useState<number>(0);
    const [ticketPriceId, setTicketPriceId] = useState<number>(0);
    const [ticketPriceLineId, setTicketPriceLineId] = useState<number | null>(null);

    const ticketPricesQuery = useAllTicketPrices({
        page,
        name: undefined,
    });

    const {
        currentPage,
        totalPages,
        data: ticketPrices,
        onChangePage,
    } = usePagination<AdminTicketPriceOverview>({
        queryResult: ticketPricesQuery,
        initialPage: 1,
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage - 1);
        onChangePage(newPage);
    }, [onChangePage]);

    useEffect(() => {
        document.title = 'B&Q Cinema - Giá vé';
    }, []);

    const handleClickDeleteTicketPrice = (row: Row<AdminTicketPriceOverview>) => {
        if (row.original.status === 'ACTIVE') {
            toast.warning('Không thể xóa giá vé đang hoạt động');
            return;
        } else {
            setTicketPriceToDelete(row.original);
        }
    };

    const handleDeleteTicketPrice = async (ticketPrice: AdminTicketPriceOverview) => {
        await deleteTicketPrice.mutateAsync(ticketPrice.id);
        setTicketPriceToDelete(null);
        queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
    };

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
                        <ButtonAction.Update onClick={() => setTicketPriceToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => handleClickDeleteTicketPrice(row)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const ticketPriceLineColumns = useMemo<ColumnDef<AdminTicketPriceLineOverview>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
            },
            {
                accessorKey: 'applyForDays',
                cell: ({ row }) => row.original.applyForDays.map((day) => ApplyForDayVietnamese[day]).join(', '),
                header: 'Ngày áp dụng',
            },
            {
                accessorKey: 'startTime',
                cell: ({ row }) => formatTime(row.original.startTime),
                header: 'Bắt đầu',
            },
            {
                accessorKey: 'endTime',
                cell: ({ row }) => formatTime(row.original.endTime),
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
                cell: () => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Update />
                        <ButtonAction.Delete />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const ticketPriceDetailColumns = useMemo<ColumnDef<AdminTicketPriceDetailOverview>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
            },
            {
                accessorKey: 'seatType',
                cell: ({ row }) => <span>{SeatTypeVietnamese[row.original.seatType]}</span>,
                header: 'Loại ghế',
            },
            {
                accessorKey: 'price',
                cell: ({ row }) => <span>{formatNumberToCurrency(row.original.price)}</span>,
                header: 'Giá',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: () => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Update />
                        <ButtonAction.Delete />
                    </div>
                ),
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<AdminTicketPriceOverview>(ticketPrices, 'ticket-prices.xlsx');
    };

    const renderSubComponent = React.useCallback(
        ({ row }: { row: Row<AdminTicketPriceOverview> }) => (
            <div className="pl-6 border-l-2 ">
                <div>
                    <Table<AdminTicketPriceLineOverview> data={row.original.ticketPriceLines}
                                                         columns={ticketPriceLineColumns}
                                                         currentPage={currentPage}
                                                         totalPages={totalPages}
                                                         onChangePage={handlePageChange}
                                                         showAllData={true}
                                                         isExpandable={true}
                                                         renderSubComponent={renderTicketPriceDetail}
                    >
                        <div className="flex justify-between items-center">
                            <div className="font-semibold">Chi tiết hàng:</div>
                            <div>
                                <ButtonAction.Add text="Thêm hàng mới" onClick={() => {
                                    setTicketPriceId(row.original.id);
                                    setShowModalAddTicketPriceLine(true);
                                }} />
                            </div>
                        </div>
                    </Table>
                </div>
            </div>
        ),
        [],
    );

    const renderTicketPriceDetail = React.useCallback(
        ({ row }: { row: Row<AdminTicketPriceLineOverview> }) => (
            <div className="pl-6 py-4 border-l-2">
                <div>
                    <Table<AdminTicketPriceDetailOverview> data={row.original.ticketPriceDetails}
                                                           columns={ticketPriceDetailColumns}
                                                           currentPage={currentPage}
                                                           totalPages={totalPages}
                                                           onChangePage={handlePageChange}
                                                           showAllData={true}
                    >
                        <div className="flex justify-between items-center">
                            <div className="font-semibold">Chi tiết giá:</div>
                            <div>
                                <ButtonAction.Add text="Thêm chi tiết" onClick={() => {
                                    setTicketPriceLineId(row.original.id);
                                }} />
                            </div>
                        </div>
                    </Table>
                </div>
            </div>
        ),
        [],
    );

    const handleTicketPriceCreated = async () => {
        setPage(0);
        await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
    };

    const reloadTicketPrices = async () => {
        setPage(0);
        await queryClient.invalidateQueries({ queryKey: [TICKET_PRICES_QUERY_KEY] });
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">

                    <div className="flex gap-2 h-9">
                            <ButtonAction.Add onClick={() => setShowModalAddTicketPrice(true)} />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>

                <Table<AdminTicketPriceOverview> data={ticketPrices} columns={columns} currentPage={currentPage}
                                                 totalPages={totalPages}
                                                 onChangePage={handlePageChange}
                                                 isExpandable={true}
                                                 renderSubComponent={renderSubComponent}
                />
            </div>
            {
                showModalAddTicketPrice && (
                    <ModalAddTicketPrice onClose={() => setShowModalAddTicketPrice(false)}
                                         onSuccess={handleTicketPriceCreated} />
                )
            }
            {
                showModalAddTicketPriceLine && (
                    <ModalAddTicketPriceLine onClose={() => setShowModalAddTicketPriceLine(false)} onSuccess={() => {
                    }} ticketPriceId={ticketPriceId} />
                )
            }
            {
                ticketPriceToDelete && (
                    <ModalAlert onClose={() => setTicketPriceToDelete(null)}
                                title="Xóa giá vé?"
                                content={`Bạn có chắc chắn muốn xóa giá vé \`${ticketPriceToDelete.name}\` này không?`}
                                footer={
                                    <div className="flex justify-center items-center gap-3 mt-4">
                                        <ButtonAction.Cancel onClick={() => setTicketPriceToDelete(null)} />
                                        <ButtonAction.SubmitDelete
                                            onClick={() => handleDeleteTicketPrice(ticketPriceToDelete)} />
                                    </div>
                                }
                    />
                )
            }
            {
                ticketPriceToUpdate && (
                    <ModalUpdateTicketPrice onClose={() => setTicketPriceToUpdate(null)} onSuccess={reloadTicketPrices} ticketPrice={ticketPriceToUpdate} />
                )
            }
            {
                ticketPriceLineId && (
                    <ModalAddTicketPriceDetail onClose={() => setTicketPriceLineId(null)} onSuccess={() => {
                    }} lineId={ticketPriceLineId}/>
                )
            }
        </>
    );
};

export default TicketPricePage;