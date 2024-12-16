'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
import avatar from '/public/img/avatar/avt.png';
import { Director } from '@/modules/directors/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useAllDirectors, useDeleteDirector } from '@/modules/directors/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Input';
import Select from '@/components/Admin/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import ModalInfoDirector from '@/components/Admin/Pages/Directors/ModalInfoDirector';
import useDeleteModal from '@/hook/useDeleteModal';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import dayjs from 'dayjs';

const exportColumns : ExcelColumn[] = [
    {
        field: 'code',
        header: 'Mã đạo diễn',
    },
    {
        field: 'name',
        header: 'Tên đạo diễn',
    },
    {
        field: 'birthday',
        header: 'Ngày sinh',
        formatter: (value: Date | undefined) => value ? dayjs(value).format('DD-MM-YYYY') : '',
    },
    {
        field: 'country',
        header: 'Quốc gia',
    },
    {
        field: 'bio',
        header: 'Tiểu sử',
    },
];

interface DirectorFilter extends PaginationState {
    search: string;
    country: string;
    status: 'ALL' | BaseStatus;
}

const DirectorPage = () => {
    const [directorDetail, setDirectorDetail] = useState<Director | null>(null);
    const [filters, setFilters] = useState<DirectorFilter>({
        page: 1,
        search: '',
        country: '',
        status: 'ALL',
    });

    const deleteDirectorMutation = useDeleteDirector();

    const directorsQuery = useAllDirectors({
        page: filters.page - 1,
        search: filters.search,
        country: filters.country,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: directors,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: directorsQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<Director>({
        onDelete: async (director: Director) => {
            await deleteDirectorMutation.mutateAsync(director.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (director: Director) => director.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa đạo diễn đang hoạt động',
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Đạo diễn';
    }, []);

    const columns = React.useMemo<ColumnDef<Director>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã',
            },
            {
                accessorKey: 'image',
                cell: ({ row }) => {
                    return (
                        <div className="w-14 h-14 relative rounded shadow overflow-hidden">
                            {
                                row.original.image ?
                                    <Image
                                        src={row.original.image} alt={row.original.name} fill
                                        className="rounded-md object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority
                                    /> :
                                    <Image
                                        src={avatar} alt={row.original.name} fill className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority
                                    />
                            }
                        </div>
                    );
                },
                header: 'Ảnh',
            },
            {
                accessorKey: 'name',
                header: 'Tên',
            },
            {
                accessorKey: 'country',
                cell: ({ row }) => <span>{row.original.country || 'Chưa cập nhật'}</span>,
                header: 'Quốc gia',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2 items-center">
                        <ButtonAction.View onClick={() => setDirectorDetail(row.original)} />
                        <ButtonAction.Update href={`/admin/movies/directors/${row.original.code}/edit`} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<Director>(directors, exportColumns, 'danh-sach-dao-dien.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={`/admin/movies/directors/new`} />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>

                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid sm-max:grid-cols-1 grid-cols-3 gap-4">
                                    <Input name="search" placeholder="Mã hoặc tên đạo diễn" />
                                    <Input name="country" placeholder="Quốc gia" />
                                    <Select
                                        name="status"
                                        placeholder="Lọc theo trạng thái"
                                        options={[
                                            { label: 'Tất cả trạng thái', value: 'ALL' },
                                            ...Object.values(BaseStatus).map(value => ({
                                                label: BaseStatusVietnamese[value],
                                                value,
                                            })),
                                        ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<Director> data={directors} columns={columns} currentPage={currentPage}
                                     totalPages={totalPages}
                                     isLoading={isLoading}
                                     onChangePage={onPageChange}
                    />
                </Card>
            </div>
            {
                directorDetail && (
                    <ModalInfoDirector onClose={() => setDirectorDetail(null)} director={directorDetail} />
                )
            }

            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={<>Bạn có chắc chắn muốn xóa đạo diễn <HighlightedText>{deleteModal.selectedData?.name}</HighlightedText> không?</>}
            />
        </>
    );
};

export default DirectorPage;