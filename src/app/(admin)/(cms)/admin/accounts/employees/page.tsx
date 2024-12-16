'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import Card from '@/components/Admin/Card';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Input';
import Select from '@/components/Admin/Select';
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
import { useListRoles } from '@/modules/roles/repository';
import ModalAddEmployee from '@/components/Admin/Pages/Employee/ModalAddEmployee';
import ModalUpdateEmployee from '@/components/Admin/Pages/Employee/ModalUpdateEmployee';
import { Role } from '@/modules/roles/interface';
import { useAuth } from '@/hook/useAuth';

interface EmployeeFilter extends PaginationState {
    search: string;
    status: 'ALL' | UserStatus;
    role?: string | 'ALL';
}

const INITIAL_FILTERS: EmployeeFilter = {
    page: 1,
    search: '',
    status: 'ALL',
    role: 'ALL',
};

const exportColumns : ExcelColumn[] = [
    {
        field: 'code',
        header: 'Mã nhân viên',
    },
    {
        field: 'name',
        header: 'Tên nhân viên',
    },
    {
        field: 'gender',
        header: 'Giới tính',
        formatter: (value: boolean) => value ? 'Nam' : 'Nữ'
    },
    {
        field: 'phone',
        header: 'Số điện thoại',
    },
    {
        field: 'email',
        header: 'Email'
    },
    {
        field: 'role.description',
        header: 'Chức vụ'
    }
];

const EmployeePage: React.FC = () => {
    const { data: roles } = useListRoles();
    const [filters, setFilters] = useState<EmployeeFilter>(INITIAL_FILTERS);
    const [roleFiltered, setRoleFiltered] = useState<Role[]>([]);
    const [showModalAddEmployee, setShowModalAddEmployee] = useState<boolean>(false);
    const [employeeToUpdate, setEmployeeToUpdate] = useState<AdminEmployeeOverview | null>(null);
    const { user } = useAuth();

    const employeeQuery = useAllEmployees({
        page: filters.page - 1,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
        role: filters.role === 'ALL' ? undefined : filters.role,
    });
    const deleteEmployeeMutation = useDeleteEmployee();

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
        canDelete: (employee: AdminEmployeeOverview) => employee.status !== BaseStatus.ACTIVE || employee.id !== user?.id,
        unableDeleteMessage: 'Không thể xóa nhân viên đang hoạt động hoặc chính bạn',
    });

    useEffect(() => {
        if (roles && roles.length > 0) {
            setRoleFiltered(roles.filter(role => role.name !== 'ROLE_CLIENT'));
        }
    }, [roles]);

    useEffect(() => {
        document.title = 'B&Q Cinema - Quản lý nhân viên';
    }, []);

    /**
     * @function columns
     * @description Table columns configuration
     */
    const columns = React.useMemo<ColumnDef<AdminEmployeeOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã nhân viên',
            },
            {
                accessorKey: 'name',
                header: 'Tên nhân viên',
                cell: ({ row }) => (
                    <div className="flex gap-3 items-center">
                        <div className="flex flex-col">
                            <div className="flex gap-3">
                                {row.original.name}
                                {
                                    user?.id === row.original.id && (<div className="bg-brand-500 text-white rounded px-1 py-0.5 text-xs h-fit">Me</div>)
                                }
                            </div>
                            <div className="text-xs text-gray-800">{row.original.role.description}</div>
                        </div>

                    </div>
                )
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
                        <ButtonAction.Update onClick={() => setEmployeeToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal, user],
    );

    const statusOptions = [
        { label: 'Tất cả trạng thái', value: 'ALL' },
        ...Object.values(BaseStatus).map(value => ({
            label: BaseStatusVietnamese[value],
            value,
        })),
    ];

    const roleOptions = [
        { label: 'Tất cả chức vụ', value: 'ALL' },
        ...(roleFiltered || []).map(role => ({
            label: role.description,
            value: role.name,
        })),
    ];

    const handleExportExcel = async () => {
        await exportToExcel<AdminEmployeeOverview>(employees, exportColumns, 'danh-sach-nhan-vien.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add
                                text="Cấp tài khoản"
                                onClick={() => setShowModalAddEmployee(true)}
                            />
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
                                    <Input name="search"
                                           label="Mã hoặc tên"
                                           placeholder="Mã hoặc tên nhân viên"
                                    />
                                    <Select
                                        label="Trạng thái"
                                        name="status"
                                        placeholder="Lọc theo trạng thái"
                                        options={statusOptions}
                                    />
                                    <Select
                                        label="Chức vụ"
                                        name="role"
                                        placeholder="Lọc theo chức vụ"
                                        options={roleOptions}
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
            <ModalDeleteAlert
                onConfirm={deleteModal.handleDelete}
                onClose={deleteModal.closeDeleteModal}
                isOpen={deleteModal.showDeleteModal}
                title="Xác nhận xóa?"
                content={<>Bạn có chắc chắn muốn xóa
                    nhân
                    viên <HighlightedText>{deleteModal.selectedData?.code}</HighlightedText> không?</>}
            />
            {
                roleFiltered && showModalAddEmployee && (
                    <ModalAddEmployee onClose={() => setShowModalAddEmployee(false)} roles={roleFiltered} />
                )
            }
            {
                roleFiltered && employeeToUpdate && (
                    <ModalUpdateEmployee onClose={() => setEmployeeToUpdate(null)} roles={roleFiltered} employee={employeeToUpdate} />
                )
            }
        </>
    );
};

export default EmployeePage;