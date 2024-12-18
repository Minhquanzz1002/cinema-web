'use client';
import React, { useEffect, useState } from 'react';
import Card from '@/components/Admin/Card';
import { exportEmployeeSaleReport } from '@/utils/exportToExcel';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { useEmployeeSalesPerformanceReport } from '@/modules/reports/repository';
import lodash from 'lodash';
import { EmployeeSalesReport, GroupedEmployeeSalesReport } from '@/modules/reports/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateToLocalDate } from '@/utils/formatDate';
import TableCore from '@/components/Admin/Tables/TableCore';
import { DatePickerWithRange } from '@/components/Admin/DatePickerWithRange';
import dayjs from 'dayjs';
import TableSkeleton from '@/components/Admin/Tables/TableSkeleton';
import EmptyState from '@/components/Admin/Tables/EmptyState';
import Input from '@/components/Admin/Input';

interface EmployeeSaleReportFilter {
    fromDate: Date;
    toDate: Date;
    search: string;
}

const INITIAL_FILTERS: EmployeeSaleReportFilter = {
    fromDate: dayjs().startOf('month').toDate(),
    toDate: dayjs().toDate(),
    search: '',
};

const groupEmployeeSaleReports = (reports: EmployeeSalesReport[]): GroupedEmployeeSalesReport[] => {
    const grouped = lodash.groupBy(reports, report =>
        `${report.employeeName}-${report.employeeCode}`,
    );

    return Object.entries(grouped).map(([key, groupReports]) => {
        const [employeeName, employeeCode] = key.split('-');

        return {
            employeeName,
            employeeCode,
            reports: groupReports,
            totalPrice: lodash.sumBy(groupReports, 'totalPrice'),
            totalDiscount: lodash.sumBy(groupReports, 'totalDiscount'),
            finalAmount: lodash.sumBy(groupReports, 'finalAmount'),
        };
    });
};

const FilterSection = (
    { onExport, isLoading, hasData }: {
        onExport: () => void;
        isLoading: boolean;
        hasData: boolean;
    },
) => {
    return (
        <Form>
            <div className="px-4 pb-3">
                <div className="flex justify-between mb-3">
                    <Typography.Title level={4}>Bộ lọc</Typography.Title>
                    <ButtonAction.Export
                        disabled={isLoading || !hasData} text="Xuất báo cáo"
                        onClick={onExport} />
                </div>
                <div className="grid sm-max:grid-cols-1 grid-cols-3 gap-4">
                    <DatePickerWithRange label="Ngày" fromName="fromDate" toName="toDate" />
                    <Input label="Mã hoặc tên nhân viên"
                           name="search"
                           placeholder="Mã hoặc tên nhân viên"
                    />
                </div>
            </div>
            <AutoSubmitForm />
        </Form>
    );
};

const TableHeader = () => (
    <TableCore.Header>
        <TableCore.RowHeader>
            <TableCore.Head>STT</TableCore.Head>
            <TableCore.Head>NVBH</TableCore.Head>
            <TableCore.Head>Tên NVBH</TableCore.Head>
            <TableCore.Head>Ngày</TableCore.Head>
            <TableCore.Head>Chiếc khấu</TableCore.Head>
            <TableCore.Head>Doanh số trước chiếc khấu</TableCore.Head>
            <TableCore.Head>Doanh số sau chiếc khấu</TableCore.Head>
        </TableCore.RowHeader>
    </TableCore.Header>
);

const EmployeeSalesReportPage = () => {
    const [filters, setFilters] = useState<EmployeeSaleReportFilter>(INITIAL_FILTERS);

    const { data: reports, isLoading } = useEmployeeSalesPerformanceReport({
        fromDate: dayjs(filters.fromDate).format('YYYY-MM-DD'),
        toDate: dayjs(filters.toDate).format('YYYY-MM-DD'),
        search: filters.search,
    });
    const groupedReports = groupEmployeeSaleReports(reports || []);
    const grandTotal = {
        discount: lodash.sumBy(reports, 'totalDiscount'),
        totalPrice: lodash.sumBy(reports, 'totalPrice'),
        finalAmount: lodash.sumBy(reports, 'finalAmount'),
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Tổng kết doanh số';
    }, []);

    const handleExportExcel = async () => {
        await exportEmployeeSaleReport(groupedReports, filters.fromDate, filters.toDate);
    };

    return (
        <>
            <div className="mt-3">
                <Card className="py-4">
                    <Formik initialValues={INITIAL_FILTERS} onSubmit={setFilters} enableReinitialize>
                        <FilterSection
                            onExport={handleExportExcel}
                            isLoading={isLoading}
                            hasData={groupedReports.length > 0}
                        />
                    </Formik>

                    <TableCore>
                        <TableHeader />

                        <TableCore.Body>
                            {
                                isLoading ? (
                                    <TableSkeleton columnCount={7} />
                                ) : groupedReports.length === 0 ? (
                                    <EmptyState colSpan={7} />
                                ) : (
                                    <>
                                        {
                                            groupedReports.map((group, groupIndex) => (
                                                <React.Fragment key={group.employeeCode}>
                                                    {group.reports.map((report, reportIndex) => (
                                                        <TableCore.RowBody key={`${group.employeeCode}-${report.date}`}>
                                                            {reportIndex === 0 && (
                                                                <TableCore.Cell rowSpan={group.reports.length + 1}>
                                                                    {groupIndex + 1}
                                                                </TableCore.Cell>
                                                            )}
                                                            <TableCore.Cell>{reportIndex === 0 && report.employeeCode}</TableCore.Cell>
                                                            <TableCore.Cell>{reportIndex === 0 && report.employeeName}</TableCore.Cell>
                                                            <TableCore.Cell>{formatDateToLocalDate(report.date)}</TableCore.Cell>
                                                            <TableCore.Cell>
                                                                {formatNumberToCurrency(report.totalDiscount)}
                                                            </TableCore.Cell>
                                                            <TableCore.Cell>
                                                                {formatNumberToCurrency(report.totalPrice)}
                                                            </TableCore.Cell>
                                                            <TableCore.Cell>
                                                                {formatNumberToCurrency(report.finalAmount)}
                                                            </TableCore.Cell>
                                                        </TableCore.RowBody>
                                                    ))}
                                                    <TableCore.RowBody>
                                                        <TableCore.Cell />
                                                        <TableCore.Cell />
                                                        <TableCore.Cell className="font-bold">Tổng cộng</TableCore.Cell>
                                                        <TableCore.Cell>{formatNumberToCurrency(group.totalDiscount)}</TableCore.Cell>
                                                        <TableCore.Cell>{formatNumberToCurrency(group.totalPrice)}</TableCore.Cell>
                                                        <TableCore.Cell>{formatNumberToCurrency(group.finalAmount)}</TableCore.Cell>
                                                    </TableCore.RowBody>
                                                </React.Fragment>
                                            ))
                                        }
                                        <TableCore.RowBody className="font-bold text-lg">
                                            <TableCore.Cell colSpan={4}>Tổng cộng</TableCore.Cell>
                                            <TableCore.Cell>
                                                {formatNumberToCurrency(grandTotal.discount)}
                                            </TableCore.Cell>
                                            <TableCore.Cell>
                                                {formatNumberToCurrency(grandTotal.totalPrice)}
                                            </TableCore.Cell>
                                            <TableCore.Cell>
                                                {formatNumberToCurrency(grandTotal.finalAmount)}
                                            </TableCore.Cell>
                                        </TableCore.RowBody>
                                    </>
                                )
                            }
                        </TableCore.Body>
                    </TableCore>
                </Card>
            </div>
        </>
    );
};

export default EmployeeSalesReportPage;