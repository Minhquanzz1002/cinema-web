'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Admin/Tables';
import Card from '@/components/Admin/Card';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
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
import { UserStatus } from '@/modules/authentication/interface';
import { AdminCustomerOverview } from '@/modules/customers/interface';
import { useAllCustomers, useDeleteCustomer } from '@/modules/customers/repository';
import Image from 'next/image';
import { AVATAR_DEFAULT_IMAGE } from '@/variables/images';
import ModalUpdateCustomer from '@/components/Admin/Pages/Customers/ModalUpdateCustomer';
import UserStatusBadge from '@/components/Admin/Badge/UserStatusBadge';
import dayjs from 'dayjs';

const exportColumns: ExcelColumn[] = [
    {
        field: 'code',
        header: 'Mã khách hàng',
    },
    {
        field: 'name',
        header: 'Họ và tên',
    },
    {
        field: 'gender',
        header: 'Giới tính',
        formatter: (value: boolean) => value ? 'Nam' : 'Nữ',
    },
    {
        field: 'birthday',
        header: 'Ngày sinh',
        formatter: (value: Date | undefined) => value ? dayjs(value).format('DD-MM-YYYY') : '',
    },
    {
        field: 'phone',
        header: 'Số điện thoại',
    },
    {
        field: 'email',
        header: 'Email',
    },
];

interface CustomerFilter extends PaginationState {
    search: string;
    status: 'ALL' | UserStatus;
    phone: string;
    email: string;
}

const INITIAL_FILTERS: CustomerFilter = {
    page: 1,
    search: '',
    status: 'ALL',
    phone: '',
    email: '',
};

const CustomerPage: React.FC = () => {
    const [filters, setFilters] = useState<CustomerFilter>(INITIAL_FILTERS);
    const [customerToUpdate, setCustomerToUpdate] = useState<AdminCustomerOverview | null>(null);

    const employeeQuery = useAllCustomers({
        page: filters.page - 1,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
        phone: filters.phone,
        email: filters.email,
    });
    const deleteCustomerMutation = useDeleteCustomer();

    const {
        data: customers,
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

    const deleteModal = useDeleteModal<AdminCustomerOverview>({
        onDelete: async (customer: AdminCustomerOverview) => {
            await deleteCustomerMutation.mutateAsync(customer.id);
        },
        onSuccess: () => {
            setFilters((prev) => ({ ...prev, page: 1 }));
        },
        canDelete: (customer: AdminCustomerOverview) => customer.status !== UserStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa tài khoản khách hàng đang hoạt động',
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Quản lý khách hàng';
    }, []);

    /**
     * @function columns
     * @description Table columns configuration
     */
    const columns = React.useMemo<ColumnDef<AdminCustomerOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã khách hàng',
            },
            {
                accessorKey: 'avatar',
                header: 'Hình ảnh',
                cell: ({ row }) => (
                    <div className="relative w-16 h-16 border rounded overflow-hidden shadow">
                        <Image
                            src={row.original.avatar || AVATAR_DEFAULT_IMAGE} alt={row.original.name} fill
                            className="object-cover"
                        />
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Tên khách hàng',
                cell: ({ row }) => (
                    <div className="flex gap-3 items-center">
                        <div className="flex flex-col">
                            <div className="flex gap-3">
                                {row.original.name}
                            </div>
                            <div className="text-xs text-gray-800">{row.original.gender ? 'Nam' : 'Nữ'}</div>
                        </div>

                    </div>
                ),
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
                cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="flex gap-2 items-center justify-end">
                        <ButtonAction.Update onClick={() => setCustomerToUpdate(row.original)} />
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

    const handleExportExcel = async () => {
        await exportToExcel<AdminCustomerOverview>(customers, exportColumns, 'danh-sach-khach-hang.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
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
                                    <Input name="search" placeholder="Mã hoặc tên khách hàng" />
                                    <Input name="phone" placeholder="Số điện thoại" />
                                    <Input name="email" placeholder="Email" />
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
                    <Table<AdminCustomerOverview> data={customers} columns={columns} currentPage={currentPage}
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
                content={<>Bạn có chắc chắn muốn xóa tài khoản
                    khách hàng <HighlightedText>{deleteModal.selectedData?.code}</HighlightedText> không?</>}
            />
            {
                customerToUpdate && (
                    <ModalUpdateCustomer onClose={() => setCustomerToUpdate(null)} customer={customerToUpdate} />
                )
            }
        </>
    );
};

export default CustomerPage;