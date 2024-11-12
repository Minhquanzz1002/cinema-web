'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import Card from '@/components/Admin/Card';
import ImportModal from '@/components/Admin/Pages/Movies/ImportModal';
import { exportToExcel } from '@/utils/exportToExcel';
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
import { useAllEmployees, useDeleteEmployee } from '@/modules/employees/repository';
import { AdminEmployeeOverview } from '@/modules/employees/interface';
import BaseStatusBadge from '@/components/Admin/Badge/BaseStatusBadge';
import { UserStatus } from '@/modules/authentication/interface';

interface EmployeeFilter extends PaginationState {
    search: string;
    status: 'ALL' | UserStatus;
}

const EmployeePage = () => {
    const [filters, setFilters] = useState<EmployeeFilter>({
        page: 1,
        search: '',
        status: 'ALL',
    });

    /**
     * React query
     */
    const employeeQuery = useAllEmployees({
        page: filters.page - 1,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });
    const deleteEmployeeMutation = useDeleteEmployee();

    /**
     * Custom hooks CRUD
     */
    const {
        data: employees,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: employeeQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<AdminEmployeeOverview>({
        onDelete: async (employee: AdminEmployeeOverview) => {
            await deleteEmployeeMutation.mutateAsync(employee.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (employee: AdminEmployeeOverview) => employee.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa nhân viên đang hoạt động',
    });

    const [showImportModal, setShowImportModal] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'B&Q Cinema - Quản lý nhân viên';
    }, []);

    const columns = React.useMemo<ColumnDef<AdminEmployeeOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã nhân viên',
            },
            {
                accessorKey: 'name',
                header: 'Tên nhân viên',
            },
            {
                accessorKey: 'gender',
                header: 'Giới tính',
                cell: ({ row }) => row.original.gender ? 'Nam' : 'Nữ',
            },
            {
                accessorKey: 'phone',
                header: 'Số điện thoại',
            },
            {
                accessorKey: 'email',
                header: 'Email',
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
                        <ButtonAction.View href={`/admin/employees/${row.original.code}`} />
                        <ButtonAction.Update href={`/admin/employees/${row.original.code}/edit`} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );


    const handleExportExcel = async () => {
        await exportToExcel<AdminEmployeeOverview>(employees, 'DSNV', ['ID', 'Mã nhân viên', 'Tên', 'Giới tính', 'Email', 'Số điện thoại', 'Sinh nhật']);
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Thêm nhân viên" href="/admin/employees/new" />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-4">
                                    <Input name="search" placeholder="Mã hoặc tên nhân viên" />
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
                                    <Select name="role"
                                            placeholder="Lọc theo chức vụ"
                                            options={[
                                                { label: 'Tất cả chức vụ', value: 'ALL' },
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<AdminEmployeeOverview> data={employees} columns={columns} currentPage={currentPage}
                                                  totalPages={totalPages}
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
                              content={<>Bạn có chắc chắn muốn xóa
                                  nhân
                                  viên <HighlightedText>{deleteModal.selectedData?.code}</HighlightedText> không?</>}
            />
        </>
    );
};

export default EmployeePage;