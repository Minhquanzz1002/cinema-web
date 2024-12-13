'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import Card from '@/components/Admin/Card';
import ImportModal from '@/components/Admin/Pages/Movies/ImportModal';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
import { AdminMovie, AgeRating, MovieStatus, MovieStatusVietnamese } from '@/modules/movies/interface';
import { useAllMovies, useDeleteMovie } from '@/modules/movies/repository';
import Image from 'next/image';
import MovieStatusBadge from '@/components/Admin/Badge/MovieStatusBadge';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Select from '@/components/Admin/Filters/Select';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/Admin/ModalDeleteAlert';
import HighlightedText from '@/components/Admin/ModalDeleteAlert/HighlightedText';
import { NOT_FOUND_MOVIE_IMAGE } from '@/variables/images';
import dayjs from 'dayjs';
import Input from '@/components/Admin/Input';

const exportColumns : ExcelColumn[] = [
    {
        field: 'code',
        header: 'Mã phim',
    },
    {
        field: 'title',
        header: 'Tên phim',
    },
    {
        field: 'releaseDate',
        header: 'Ngày phát hành',
        formatter: (value: Date | undefined) => value ? dayjs(value).format('DD-MM-YYYY') : '',
    },
    {
        field: 'duration',
        header: 'Thời lượng',
        formatter: (value: number) => `${value} phút`
    },
    {
        field: 'country',
        header: 'Quốc gia',
        formatter: (value: string | undefined) => value || ''
    },
    {
        field: 'ageRating',
        header: 'Giới hạn độ tuổi',
        formatter: (value: AgeRating) => {
            switch (value) {
                case AgeRating.P:
                    return 'P - Phim dành cho mọi độ tuổi';
                case AgeRating.T13:
                    return 'T13 - Phim cấm khán giả dưới 13 tuổi';
                case AgeRating.T16:
                    return 'T16 - Phim cấm khán giả dưới 16 tuổi';
                case AgeRating.T18:
                    return 'T18 - Phim cấm khán giả dưới 18 tuổi';
                default:
                    return '';
            }
        }
    },
    {
        field: 'rating',
        header: 'Đánh giá',
        formatter: (value: number) => value.toFixed(1)
    },
    {
        field: 'summary',
        header: 'Tóm tắt',
        formatter: (value: string | undefined) => value || ''
    },
];

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

    /**
     * React query
     */
    const moviesQuery = useAllMovies({
        page: filters.page - 1,
        search: filters.search,
        country: filters.country,
        ageRating: filters.ageRating === 'ALL' ? undefined : filters.ageRating,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });
    const deleteMovieMutation = useDeleteMovie();

    /**
     * Custom hooks CRUD
     */
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

    const deleteModal = useDeleteModal<AdminMovie>({
        onDelete: async (movie: AdminMovie) => {
            await deleteMovieMutation.mutateAsync(movie.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (movie) => movie.status !== MovieStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa phim đang chiếu',
    });

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
                            <Image src={row.original.imagePortrait || NOT_FOUND_MOVIE_IMAGE} alt={row.original.title} fill
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
                        <ButtonAction.Update href={`/admin/movies/${row.original.code}/edit`}/>
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );


    const handleExportExcel = async () => {
        await exportToExcel<AdminMovie>(movies, exportColumns, 'danh-sach-phim.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Thêm phim mới" href="/admin/movies/new" />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid sm-max:grid-cols-1 grid-cols-4 gap-4">
                                    <Input name="search" placeholder="Mã hoặc tên phim" />
                                    <Input name="country" placeholder="Quốc gia" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(MovieStatus).map(value => ({
                                                    label: MovieStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                    <Select name="ageRating"
                                            placeholder="Phân loại tuổi"
                                            options={[
                                                { label: 'Tất cả nhãn', value: 'ALL' },
                                                ...Object.values(AgeRating).map(value => ({
                                                    label: value,
                                                    value,
                                                })),
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
                showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />
            }
            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={<>Bạn có chắc chắn muốn xóa phim <HighlightedText>{deleteModal.selectedData?.title}</HighlightedText> không?</>}
            />
        </>
    );
};

export default MoviePage;