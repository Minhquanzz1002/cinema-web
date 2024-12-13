'use client';
import React, { useEffect, useState } from 'react';
import Card from '@/components/Admin/Card';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { useMovieSalesPerformanceReport } from '@/modules/reports/repository';
import lodash from 'lodash';
import { GroupedMovieSalesReport, MovieSalesReport } from '@/modules/reports/interface';
import { formatNumber, formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateToLocalDate } from '@/utils/formatDate';
import TableCore from '@/components/Admin/Tables/TableCore';
import { DatePickerWithRange } from '@/components/Admin/DatePickerWithRange';
import dayjs from 'dayjs';
import TableSkeleton from '@/components/Admin/Tables/TableSkeleton';
import EmptyState from '@/components/Admin/Tables/EmptyState';
import Input from '@/components/Admin/Input';
import { exportMovieSaleReport } from '@/utils/exportToExcel';

interface MovieSaleReportFilter {
    fromDate: Date;
    toDate: Date;
    search: string;
}

const INITIAL_FILTERS: MovieSaleReportFilter = {
    fromDate: dayjs().startOf('month').toDate(),
    toDate: dayjs().toDate(),
    search: '',
};

const groupMovieSaleReports = (reports: MovieSalesReport[]): GroupedMovieSalesReport[] => {
    const grouped = lodash.groupBy(reports, report =>
        `${report.movieTitle}-${report.movieCode}`,
    );

    return Object.entries(grouped).map(([key, groupReports]) => {
        const [movieTitle, movieCode] = key.split('-');

        return {
            movieTitle,
            movieCode,
            reports: groupReports,
            totalPrice: lodash.sumBy(groupReports, 'totalPrice'),
            totalShows: lodash.sumBy(groupReports, 'totalShows'),
            totalTickets: lodash.sumBy(groupReports, 'totalTickets'),
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
                    <DatePickerWithRange fromName="fromDate" toName="toDate" />
                    <Input name="search" placeholder="Mã hoặc tên phim" />
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
            <TableCore.Head>Mã phim</TableCore.Head>
            <TableCore.Head>Tên phim</TableCore.Head>
            <TableCore.Head>Ngày</TableCore.Head>
            <TableCore.Head>Số suất chiếu</TableCore.Head>
            <TableCore.Head>Số vé bán</TableCore.Head>
            <TableCore.Head>Doanh thu</TableCore.Head>
        </TableCore.RowHeader>
    </TableCore.Header>
);

const MovieSalesReportPage = () => {
    const [filters, setFilters] = useState<MovieSaleReportFilter>(INITIAL_FILTERS);

    const { data: reports, isLoading } = useMovieSalesPerformanceReport({
        fromDate: dayjs(filters.fromDate).format('YYYY-MM-DD'),
        toDate: dayjs(filters.toDate).format('YYYY-MM-DD'),
        search: filters.search,
    });
    const groupedReports = groupMovieSaleReports(reports || []);
    const grandTotal = {
        totalShows: lodash.sumBy(reports, 'totalShows'),
        totalTickets: lodash.sumBy(reports, 'totalTickets'),
        totalPrice: lodash.sumBy(reports, 'totalPrice'),
    };

    useEffect(() => {
        document.title = 'B&Q Cinema - Tổng kết doanh số';
    }, []);

    const handleExportExcel = async () => {
        await exportMovieSaleReport(groupedReports, filters.fromDate, filters.toDate);
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
                                                <React.Fragment key={group.movieCode}>
                                                    {group.reports.map((report, reportIndex) => (
                                                        <TableCore.RowBody key={`${group.movieCode}-${report.date}`}>
                                                            {reportIndex === 0 && (
                                                                <TableCore.Cell rowSpan={group.reports.length + 1}>
                                                                    {groupIndex + 1}
                                                                </TableCore.Cell>
                                                            )}
                                                            <TableCore.Cell>{report.movieCode}</TableCore.Cell>
                                                            <TableCore.Cell>{report.movieTitle}</TableCore.Cell>
                                                            <TableCore.Cell>{formatDateToLocalDate(report.date)}</TableCore.Cell>
                                                            <TableCore.Cell>
                                                                {formatNumber(report.totalShows)}
                                                            </TableCore.Cell>
                                                            <TableCore.Cell>
                                                                {formatNumber(report.totalTickets)}
                                                            </TableCore.Cell>
                                                            <TableCore.Cell>
                                                                {formatNumberToCurrency(report.totalPrice)}
                                                            </TableCore.Cell>
                                                        </TableCore.RowBody>
                                                    ))}
                                                    <TableCore.RowBody>
                                                        <TableCore.Cell />
                                                        <TableCore.Cell />
                                                        <TableCore.Cell className="font-bold">
                                                            Tổng cộng
                                                        </TableCore.Cell>
                                                        <TableCore.Cell>
                                                            {formatNumber(group.totalShows)}
                                                        </TableCore.Cell>
                                                        <TableCore.Cell>
                                                            {formatNumber(group.totalTickets)}
                                                        </TableCore.Cell>
                                                        <TableCore.Cell>
                                                            {formatNumberToCurrency(group.totalPrice)}
                                                        </TableCore.Cell>
                                                    </TableCore.RowBody>
                                                </React.Fragment>
                                            ))
                                        }
                                        <TableCore.RowBody className="font-bold text-lg">
                                            <TableCore.Cell colSpan={4}>Tổng cộng</TableCore.Cell>
                                            <TableCore.Cell>
                                                {formatNumber(grandTotal.totalShows)}
                                            </TableCore.Cell>
                                            <TableCore.Cell>
                                                {formatNumber(grandTotal.totalTickets)}
                                            </TableCore.Cell>
                                            <TableCore.Cell>
                                                {formatNumberToCurrency(grandTotal.totalPrice)}
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

export default MovieSalesReportPage;