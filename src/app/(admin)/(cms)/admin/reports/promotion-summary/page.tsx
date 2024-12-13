'use client';
import React, { useEffect, useState } from 'react';
import Card from '@/components/Admin/Card';
import ButtonAction from '@/components/Admin/ButtonAction';
import { Form, Formik } from 'formik';
import Typography from '@/components/Admin/Typography';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { usePromotionSummaryReport } from '@/modules/reports/repository';
import TableCore from '@/components/Admin/Tables/TableCore';
import { DatePickerWithRange } from '@/components/Admin/DatePickerWithRange';
import dayjs from 'dayjs';
import TableSkeleton from '@/components/Admin/Tables/TableSkeleton';
import EmptyState from '@/components/Admin/Tables/EmptyState';
import { PromotionLineType, PromotionLineTypeVietnamese } from '@/modules/promotions/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';
import { exportPromotionSummaryReport } from '@/utils/exportToExcel';

interface PromotionSummaryReportFilter {
    fromDate: Date;
    toDate: Date;
}

const PromotionSummaryReportPage = () => {
    const initialFilters: PromotionSummaryReportFilter = {
        fromDate: dayjs().startOf('month').toDate(),
        toDate: dayjs().endOf('month').toDate(),
    };

    const [filters, setFilters] = useState<PromotionSummaryReportFilter>(initialFilters);

    const { data: reports, isLoading } = usePromotionSummaryReport({
        fromDate: dayjs(filters.fromDate).format('YYYY-MM-DD'),
        toDate: dayjs(filters.toDate).format('YYYY-MM-DD'),
    });

    useEffect(() => {
        document.title = 'B&Q Cinema - Danh số bán hàng theo ngày';
    }, []);

    const handleExportExcel = async () => {
        if (reports) {
            await exportPromotionSummaryReport(reports, filters.fromDate, filters.toDate);
        }
    };

    const handleSubmit = (values: PromotionSummaryReportFilter) => {
        setFilters(values);
    };

    return (
        <>
            <div className="mt-3">
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={handleSubmit} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <div className="flex justify-between mb-3">
                                    <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                    <ButtonAction.Export disabled={isLoading || reports?.length === 0}
                                                         text="Xuất báo cáo" onClick={handleExportExcel} />
                                </div>
                                <div className="grid sm-max:grid-cols-1 grid-cols-3 gap-4">
                                    <DatePickerWithRange fromName="fromDate" toName="toDate" />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>

                    <TableCore>
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head className="border-r border-dashed">Mã CTKM</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-x border-dashed">Tên CTKM</TableCore.Head>
                                <TableCore.Head className="border-x border-dashed">Ngày bắt đầu</TableCore.Head>
                                <TableCore.Head className="border-x border-dashed">Ngày kết thúc</TableCore.Head>
                                <TableCore.Head className="min-w-32 border-x border-dashed">Loại khuyến
                                    mãi</TableCore.Head>
                                <TableCore.Head className="min-w-32 border-x border-dashed">Tiền hoặc phần trăm
                                    KM</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-x border-dashed">Số tiền KM tối
                                    đa</TableCore.Head>
                                <TableCore.Head className="min-w-32 border-x border-dashed">Mã SP tặng</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-x border-dashed">Tên SP tặng</TableCore.Head>
                                <TableCore.Head className="min-w-32 border-x border-dashed">Loại vé
                                    tặng</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-x border-dashed">SL tặng trên
                                    đơn</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-x border-dashed">SL áp dụng tối
                                    đa</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-x border-dashed">SL đã áp
                                    dụng</TableCore.Head>
                                <TableCore.Head className="min-w-52 border-l border-dashed">SL áp dụng còn
                                    lại</TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>

                        <TableCore.Body>
                            {
                                isLoading ? (
                                    <TableSkeleton columnCount={14} />
                                ) : !reports || reports?.length === 0 ? (
                                    <EmptyState colSpan={14} />
                                ) : (
                                    <>
                                        {
                                            reports.map((report, index) => (
                                                <React.Fragment key={`${report.id}-${index}`}>
                                                    {
                                                        report.promotionDetails.map((promotionDetail) => (
                                                            <TableCore.RowBody
                                                                key={`${report.id}-${promotionDetail.id}`}>
                                                                <TableCore.Cell
                                                                    className="border-r border-dashed">{report.code}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{report.name}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{dayjs(report.startDate).format('DD/MM/YYYY')}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{dayjs(report.endDate).format('DD/MM/YYYY')}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{PromotionLineTypeVietnamese[report.type as PromotionLineType]}</TableCore.Cell>
                                                                <TableCore.Cell className="border-x border-dashed">
                                                                    {
                                                                        {
                                                                            [PromotionLineType.CASH_REBATE]: formatNumberToCurrency(promotionDetail.discountValue),
                                                                            [PromotionLineType.PRICE_DISCOUNT]: `${promotionDetail.discountValue}%`,
                                                                        } [report.type] || ''
                                                                    }
                                                                </TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{promotionDetail.maxDiscountValue ? formatNumberToCurrency(promotionDetail.maxDiscountValue) : ''}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{promotionDetail?.giftProduct?.code || ''}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{promotionDetail?.giftProduct?.name || ''}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{SeatTypeVietnamese[promotionDetail?.giftSeatType as SeatType] || ''}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{promotionDetail?.giftQuantity || promotionDetail?.giftSeatQuantity || ''}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{promotionDetail.usageLimit}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-x border-dashed">{promotionDetail.currentUsageCount}</TableCore.Cell>
                                                                <TableCore.Cell
                                                                    className="border-l border-dashed">{promotionDetail.usageLimit - promotionDetail.currentUsageCount}</TableCore.Cell>
                                                            </TableCore.RowBody>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
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

export default PromotionSummaryReportPage;