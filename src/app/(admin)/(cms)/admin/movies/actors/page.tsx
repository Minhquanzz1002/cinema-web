'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import { Actor } from '@/modules/actors/interface';
import Card from '@/components/Admin/Card';
import Table from '@/components/Admin/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { useAllActors } from '@/modules/actors/repository';
import avatar from '/public/img/avatar/avt.png';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import usePagination from '@/hook/usePagination';
import DropdownInput, { DropDownInputOption, DropdownInputProps } from '@/components/Admin/Filters/DropdownInput';
import ButtonAction from '@/components/Admin/ButtonAction';
import Modal from '@/components/Admin/Modal';
import ItemInfo from '@/components/Admin/ItemInfo';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { BaseStatusVietnamese } from '@/modules/base/interface';

const ActorPage = () => {
    const options: DropdownInputProps['options'] = [
        { label: 'Tìm theo tên', value: 'name' },
        { label: 'Tìm theo mã', value: 'code' },
    ];
    const [selectedOption, setSelectedOption] = useState<DropDownInputOption>(options[0]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [actorDetail, setActorDetail] = useState<Actor | null>(null);

    const handleChangeDropdown = (option: DropDownInputOption) => {
        setSelectedOption(option);
    };

    const handleChangeSearchValue = (value: string) => {
        setSearchValue(value);
    };

    const [page, setPage] = useState(0);
    const actorsQuery = useAllActors({
        page,
        name: selectedOption.value === 'name' ? searchValue : undefined,
        code: selectedOption.value === 'code' ? searchValue : undefined,
    });
    const {
        currentPage,
        totalPages,
        data: actors,
        onChangePage,
    } = usePagination<Actor>({
        queryResult: actorsQuery,
        initialPage: 1,
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage - 1);
        onChangePage(newPage);
    }, [onChangePage]);

    useEffect(() => {
        document.title = 'B&Q Cinema - Diễn viên';
    }, []);

    const columns = useMemo<ColumnDef<Actor>[]>(
        () => [
            {
                accessorKey: 'code',
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white uppercase">Mã</p>
                ),
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
                enableSorting: false,
                header: () => <span>Ảnh</span>,
            },
            {
                accessorKey: 'name',
                header: () => <span>Tên</span>,
            },
            {
                accessorKey: 'country',
                cell: ({ row }) => <span>{row.original.country || 'Chưa cập nhật'}</span>,
                header: () => <span>Quốc gia</span>,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: () => <span>Trạng thái</span>,
            },
            {
                id: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View onClick={() => setActorDetail(row.original)} />
                        <ButtonAction.Update href={`/admin/movies/actors/${row.original.code}/update`} />
                        <ButtonAction.Delete />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = useCallback(async () => {
        await exportToExcel<Actor>(actors, 'actors.xlsx');
    }, [actors]);

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/admin/movies/actors/new'} />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Table<Actor> data={actors} columns={columns}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onChangePage={handlePageChange}
                >
                    <div className="grid grid-cols-3 mb-3">
                        <DropdownInput options={options} onChangeDropdown={handleChangeDropdown}
                                       onChangeInputSearch={handleChangeSearchValue} />
                    </div>
                </Table>
            </div>
            {
                actorDetail && (
                    <Modal title={`Thông tin diễn viên #${actorDetail.code}`} onClose={() => setActorDetail(null)} open={true}>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="relative aspect-square">
                                <Image src={actorDetail.image || avatar} alt={actorDetail.name} fill
                                       quality={85}
                                       className="rounded-md object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-3 col-span-3">
                                <ItemInfo label="Tên" value={actorDetail.name}/>
                                <ItemInfo label="Ngày sinh" value={actorDetail.birthday ? formatDateToLocalDate(actorDetail.birthday) : 'Chưa cập nhật'}/>
                                <ItemInfo label="Quốc gia" value={actorDetail.country || 'Chưa cập nhật'}/>
                                <ItemInfo label="Tiểu sử" value={actorDetail.bio || "Chưa cập nhật"}/>
                                <ItemInfo label="Trạng thái" value={BaseStatusVietnamese[actorDetail.status]}/>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
};

export default ActorPage;