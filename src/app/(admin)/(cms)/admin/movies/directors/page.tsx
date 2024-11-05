'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import avatar from '/public/img/avatar/avt.png';
import { Director } from '@/modules/directors/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import { useAllDirectors } from '@/modules/directors/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Filters/Input';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';

interface DirectorFilter extends PaginationState {
    search: string;
    country: string;
    status: 'ALL' | BaseStatus;
}

const DirectorPage = () => {
    const [filters, setFilters] = useState<DirectorFilter>({
        page: 1,
        search: '',
        country: '',
        status: 'ALL',
    });

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
                                    <Image src={row.original.image} alt={row.original.name} fill
                                           className="rounded-md object-cover"
                                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                           priority /> :
                                    <Image src={avatar} alt={row.original.name} fill className="object-cover"
                                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
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
                cell: () => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.Update />
                        <ButtonAction.Delete />
                    </div>
                ),
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<Director>(directors, 'directors.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>

                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-3 gap-4">
                                    <Input name="search" placeholder="Mã hoặc tên đạo diễn" />
                                    <Input name="country" placeholder="Quốc gia" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(BaseStatus).map(value => ({
                                                    label: BaseStatusVietnamese[value],
                                                    value,
                                                }))
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
                                     onChangePage={onPageChange} />
                </Card>
            </div>
        </>
    );
};

export default DirectorPage;