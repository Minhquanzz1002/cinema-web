'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import Card from '@/components/Admin/Card';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Filters/Input';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import { useAllCinemas, useDeleteCinema } from '@/modules/cinemas/repository';
import { AdminCinemaOverview } from '@/modules/cinemas/interface';
import ModalAddCinema from '@/components/Admin/Pages/Cinemas/ModalAddCinema';

interface CinemaFilter extends PaginationState {
    search: string;
    status: 'ALL' | BaseStatus;
}

const INITIAL_FILTERS: CinemaFilter = {
    page: 1,
    search: '',
    status: 'ALL',
};

const CinemaPage: React.FC = () => {
    const [filters, setFilters] = useState<CinemaFilter>(INITIAL_FILTERS);
    const [showModalAddCinema, setShowModalAddCinema] = useState<boolean>(false);
    // const [cinemaToUpdate, setCinemaToUpdate] = useState<AdminCinemaOverview | null>(null);

    const cinemaQuery = useAllCinemas({
        page: filters.page - 1,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const deleteCinemaMutation = useDeleteCinema();

    const {
        data: cinemas,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: cinemaQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<AdminCinemaOverview>({
        onDelete: async (cinema: AdminCinemaOverview) => {
            await deleteCinemaMutation.mutateAsync(cinema.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (cinema: AdminCinemaOverview) => cinema.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Rạp đang hoạt động không thể xóa',
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Quản lý rạp chiếu phim';
    }, []);

    /**
     * @function columns
     * @description Table columns configuration
     */
    const columns = React.useMemo<ColumnDef<AdminCinemaOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã rạp',
            },
            {
                accessorKey: 'name',
                header: 'Tên rạp',
                cell: ({ row }) => (
                    <div>
                        <div>{row.original.name}</div>
                        <div className="text-xs text-gray-800">{row.original.hotline}</div>
                    </div>
                )
            },
            {
                id: 'address',
                header: 'Địa chỉ',
                cell: ({ row }) => (
                    <div className="max-w-96 w-96">
                        {`${row.original.address}, ${row.original.city.name}, ${row.original.district}, ${row.original.ward}`}
                    </div>
                )
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Update
                            // onClick={() => setCinemaToUpdate(row.original)}
                        />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );

    const statusOptions = [
        { label: 'Tất cả trạng thái', value: 'ALL' },
        ...Object.values(BaseStatus).map(value => ({
            label: BaseStatusVietnamese[value],
            value,
        })),
    ];

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add
                                text="Thêm rạp"
                                onClick={() => setShowModalAddCinema(true)}
                            />
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-4">
                                    <Input name="search" placeholder="Mã hoặc tên rạp" />
                                    <Select
                                        name="status"
                                        placeholder="Lọc theo trạng thái"
                                        options={statusOptions}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<AdminCinemaOverview> data={cinemas} columns={columns} currentPage={currentPage}
                                                  totalPages={totalPages}
                                                  onChangePage={onPageChange}
                                                  isLoading={isLoading}
                    />
                </Card>
            </div>
            <ModalDeleteAlert
                onConfirm={deleteModal.handleDelete}
                onClose={deleteModal.closeDeleteModal}
                isOpen={deleteModal.showDeleteModal}
                title="Xác nhận xóa?"
                content={<>Bạn có chắc chắn muốn xóa rạp <HighlightedText>{deleteModal.selectedData?.code} - {deleteModal.selectedData?.name}</HighlightedText> không?</>}
            />
            {
                showModalAddCinema && (
                    <ModalAddCinema onClose={() => setShowModalAddCinema(false)} />
                )
            }
        </>
    );
};

export default CinemaPage;