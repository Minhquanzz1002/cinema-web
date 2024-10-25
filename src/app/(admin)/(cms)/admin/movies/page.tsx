'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import Card from '@/components/Admin/Card';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import FilterModal from '@/components/Admin/Pages/Movies/FilterModal';
import ImportModal from '@/components/Admin/Pages/Movies/ImportModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { AdminMovie, AgeRating, MovieStatus, MovieStatusVietnamese } from '@/modules/movies/interface';
import { useAllMovies } from '@/modules/movies/repository';
import Image from 'next/image';
import { ButtonSquare } from '@/components/Admin/Button';
import MovieStatusBadge from '@/components/Admin/Badge/MovieStatusBadge';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Filters/Input';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';

interface MovieFilter extends PaginationState {
    search: string;
    country: string;
    ageRating: 'ALL' | AgeRating;
    status: 'ALL' | MovieStatus;
}

const MoviePage = () => {
    const [filters, setFilters] = useState<MovieFilter>({
        page: 1,
        search: '',
        ageRating: 'ALL',
        country: '',
        status: MovieStatus.ACTIVE,
    });

    const moviesQuery = useAllMovies({
        page: filters.page - 1,
        search: filters.search,
        country: filters.country,
        ageRating: filters.ageRating === 'ALL' ? undefined : filters.ageRating,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: movies,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: moviesQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const [displayType, setDisplayType] = useState<'Grid' | 'Table'>('Table');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'B&Q Cinema - Quản lý phim';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminMovie>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã phim',
            },
            {
                accessorKey: 'imagePortrait',
                cell: ({ row }) => {
                    return (
                        <div className="w-28 h-40 relative">
                            <Image src={row.original.imagePortrait} alt={row.original.title} fill
                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                   className="rounded-md object-cover" priority />
                        </div>
                    );
                },
                header: 'Ảnh',
            },
            {
                accessorKey: 'title',
                cell: ({ row }) => {
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="font-medium">{row.original.title}</div>
                            <div>
                                <span
                                    className="px-2 py-1 bg-brand-300 rounded text-white">{row.original.ageRating}</span>
                            </div>
                        </div>
                    );
                },
                header: 'Tiêu đề',
            },
            {
                accessorKey: 'duration',
                header: 'Thời lượng (phút)',
            },
            {
                accessorKey: 'country',
                header: 'Quốc gia',
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                cell: ({ row }) => <MovieStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'rating',
                header: 'Đánh giá',
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.View href={`/admin/movies/${row.original.code}`} />
                        <ButtonAction.Update />
                        <ButtonAction.Delete />
                    </div>
                ),
            },
        ],
        [],
    );


    const handleExportExcel = async () => {
        await exportToExcel<AdminMovie>(movies);
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-x-2">
                            <ButtonSquare title={displayType !== 'Grid' ? 'Hiển thị dạng thẻ' : 'Hiển thị dạng bảng'}
                                          onClick={() => setDisplayType(displayType === 'Grid' ? 'Table' : 'Grid')}>
                                {
                                    displayType !== 'Grid' ? <BsGrid3X3Gap /> : <PiListBold />
                                }
                            </ButtonSquare>

                        </div>

                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Thêm phim mới" href="/admin/movies/new"/>
                            <ButtonAction.Import onClick={() => setShowImportModal(true)}/>
                            <ButtonAction.Export onClick={handleExportExcel}/>
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-4">
                                    <Input name="search" placeholder="Mã hoặc tên phim" />
                                    <Input name="country" placeholder="Quốc gia" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                {
                                                    label: MovieStatusVietnamese[MovieStatus.ACTIVE],
                                                    value: MovieStatus.ACTIVE,
                                                },
                                            ]}
                                    />
                                    <Select name="ageRating"
                                            placeholder="Phân loại tuổi"
                                            options={[
                                                { label: 'Tất cả nhãn', value: 'ALL' },
                                                ...Object.values(AgeRating).map(value => ({
                                                    label: value,
                                                    value,
                                                }))
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<AdminMovie> data={movies} columns={columns} currentPage={currentPage} totalPages={totalPages}
                                       onChangePage={onPageChange}
                                       isLoading={isLoading}
                    />
                </Card>
            </div>
            {
                showFilter && (<FilterModal onClose={() => setShowFilter(false)} />)
            }
            {
                showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />
            }
        </>
    );
};

export default MoviePage;