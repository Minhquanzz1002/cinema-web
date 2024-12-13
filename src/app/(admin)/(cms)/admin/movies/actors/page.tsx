'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import { Actor } from '@/modules/actors/interface';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
import { useAllActors, useDeleteActor } from '@/modules/actors/repository';
import avatar from '/public/img/avatar/avt.png';
import ButtonAction from '@/components/Admin/ButtonAction';
import Modal from '@/components/Admin/Modal';
import ItemInfo from '@/components/Admin/ItemInfo';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Input';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import dayjs from 'dayjs';

const exportColumns : ExcelColumn[] = [
    {
        field: 'code',
        header: 'Mã diễn viên',
    },
    {
        field: 'name',
        header: 'Tên diễn viên',
    },
    {
        field: 'birthday',
        header: 'Ngày sinh',
        formatter: (value: Date | undefined) => value ? dayjs(value).format('DD-MM-YYYY') : '',
    },
    {
        field: 'country',
        header: 'Quốc gia',
        formatter: (value: string | undefined) => value || ''
    },
    {
        field: 'bio',
        header: 'Tiểu sử',
        width: 50,
        formatter: (value: string | undefined) => value || ''
    },
];

interface ActorFilter extends PaginationState {
    search: string;
    country: string;
    status: 'ALL' | BaseStatus;
}

const ActorPage = () => {
    const [actorDetail, setActorDetail] = useState<Actor | null>(null);
    const deleteMutation = useDeleteActor();
    const [filters, setFilters] = useState<ActorFilter>({
        page: 1,
        search: '',
        country: '',
        status: 'ALL',
    });

    const actorsQuery = useAllActors({
        page: filters.page - 1,
        search: filters.search,
        country: filters.country,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: actors,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: actorsQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Diễn viên';
    }, []);

    const deleteModal = useDeleteModal<Actor>({
        onDelete: async (actor: Actor) => {
            await deleteMutation.mutateAsync(actor.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (actor) => actor.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa diễn viên hiển thị',
    });

    const columns = useMemo<ColumnDef<Actor>[]>(
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
                            <Image src={row.original.image || avatar}
                                   alt={row.original.name} fill
                                   sizes="56px" quality={85}
                                   className="rounded-md object-cover"
                            />
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
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.View onClick={() => setActorDetail(row.original)} />
                        <ButtonAction.Update href={`/admin/movies/actors/${row.original.code}/edit`} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = useCallback(async () => {
        await exportToExcel<Actor>(actors, exportColumns, 'danh-sach-dien-vien.xlsx');
    }, [actors]);

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/admin/movies/actors/new'} />
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
                                    <Input name="search" placeholder="Mã hoặc tên diễn viên" />
                                    <Input name="country" placeholder="Quốc gia" />
                                    <Select name="status"
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
                    <Table<Actor> data={actors} columns={columns}
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  onChangePage={onPageChange}
                                  isLoading={isLoading}
                    />
                </Card>
            </div>
            {
                actorDetail && (
                    <Modal title={`Thông tin diễn viên #${actorDetail.code}`} onClose={() => setActorDetail(null)}
                           open={true}>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="relative aspect-square">
                                <Image src={actorDetail.image || avatar} alt={actorDetail.name} fill
                                       quality={85}
                                       className="rounded-md object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-3 col-span-3">
                                <ItemInfo label="Tên" value={actorDetail.name} />
                                <ItemInfo label="Ngày sinh"
                                          value={actorDetail.birthday ? formatDateToLocalDate(actorDetail.birthday) : 'Chưa cập nhật'} />
                                <ItemInfo label="Quốc gia" value={actorDetail.country || 'Chưa cập nhật'} />
                                <ItemInfo label="Tiểu sử" value={actorDetail.bio || 'Chưa cập nhật'} />
                                <ItemInfo label="Trạng thái" value={BaseStatusVietnamese[actorDetail.status]} />
                            </div>
                        </div>
                    </Modal>
                )
            }
            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={
                                    <>
                                        Bạn có chắc chắn muốn xóa diễn viên <HighlightedText>{deleteModal.selectedData?.name}</HighlightedText> không?
                                    </>
                              }
            />
        </>
    );
};

export default ActorPage;