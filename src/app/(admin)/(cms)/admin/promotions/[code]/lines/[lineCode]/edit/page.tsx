'use client';
import React, { useEffect } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import { object, string } from 'yup';
import Card from '@/components/Admin/Card';
import Typography from '@/components/Admin/Typography';
import Input from '@/components/Admin/Input';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import DatePicker from '@/components/Admin/DatePicker';
import { PromotionLineType, PromotionLineTypeVietnamese } from '@/modules/promotions/interface';
import InputCurrency from '@/components/Admin/InputCurrency';
import { ButtonIcon } from '@/components/Admin/Button';
import { TiArrowBackOutline } from 'react-icons/ti';
import { FaSave } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import ButtonAction from '@/components/Admin/ButtonAction';
import { SeatType, SeatTypeVietnamese } from '@/modules/seats/interface';
import ItemInfo from '@/components/Admin/ItemInfo';
import { usePromotionByCode, usePromotionLineByCode } from '@/modules/promotions/repository';
import Loader from '@/components/Admin/Loader';
import NotFound from '@/components/Admin/NotFound';
import { formatDateToLocalDate } from '@/utils/formatDate';
import dayjs from 'dayjs';
import Table from '@/components/Admin/Pages/PromotionLine/Table';

const DetailFields = ({ index }: { index: number }) => {
    const { values } = useFormikContext<FormValues>();

    if (!values.type) return null;

    switch (values.type) {
        case PromotionLineType.CASH_REBATE:
            return (
                <>
                    <Table.Cell>
                        <InputCurrency name={`promotionDetails.${index}.discountValue`} unit="VND"
                                       placeholder="Nhập số tiền giảm" required />
                    </Table.Cell>
                    <Table.Cell>
                        <InputCurrency name={`promotionDetails.${index}.minOrderValue`} unit="VND"
                                       placeholder="Nhập số tiền đơn hàng tối thiểu" />
                    </Table.Cell>
                    <Table.Cell>
                        <Input name={`promotionDetails.${index}.usageLimit`}
                               placeholder="Nhập số lượng áp dụng tối đa" required />
                    </Table.Cell>
                </>
            );
        case PromotionLineType.PRICE_DISCOUNT:
            return (
                <>
                    <Table.Cell>
                        <InputCurrency name={`promotionDetails.${index}.discountValue`} unit="%"
                                       placeholder="Nhập phần trăm giảm" required />
                    </Table.Cell>
                    <Table.Cell>
                        <InputCurrency name={`promotionDetails.${index}.maxDiscountValue`} unit="VND"
                                       placeholder="Nhập số tiền giảm tối đa" />
                    </Table.Cell>
                    <Table.Cell>
                        <InputCurrency name={`promotionDetails.${index}.minOrderValue`} unit="VND"
                                       placeholder="Nhập số tiền đơn hàng tối thiểu" />
                    </Table.Cell>
                    <Table.Cell>
                        <Input name={`promotionDetails.${index}.usageLimit`}
                               placeholder="Nhập số lượng áp dụng tối đa" required />
                    </Table.Cell>
                </>
            );
        case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
            return (
                <>
                    <Table.Cell>
                        <Select name={`promotionDetails.${index}.requiredSeatType`} options={[
                            ...Object.keys(SeatType).map((seatType) => ({
                                label: SeatTypeVietnamese[seatType as SeatType],
                                value: seatType,
                            })),
                        ]} />
                    </Table.Cell>
                    <Table.Cell>
                        <Input name={`promotionDetails.${index}.requiredSeatQuantity`}
                               placeholder="Nhập số lượng yêu cầu" />
                    </Table.Cell>
                    <Table.Cell>
                        <Select name={`promotionDetails.${index}.giftProduct`} options={[
                            ...Object.keys(SeatType).map((seatType) => ({
                                label: SeatTypeVietnamese[seatType as SeatType],
                                value: seatType,
                            })),
                        ]} />
                    </Table.Cell>
                    <Table.Cell>
                        <Input name={`promotionDetails.${index}.usageLimit`}
                               placeholder="Nhập số lượng áp dụng tối đa" required />
                    </Table.Cell>
                </>
            );
        default:
            return null;
    }
};

const DetailHeaders = () => {
    const { values } = useFormikContext<FormValues>();
    if (!values.type) return null;

    switch (values.type) {
        case PromotionLineType.CASH_REBATE:
            return (
                <tr>
                    <Table.CellHeader>Số tiền giảm</Table.CellHeader>
                    <Table.CellHeader>Tổng tiền đơn tối thiểu</Table.CellHeader>
                    <Table.CellHeader>Số lượng áp dụng tối đa</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        case PromotionLineType.PRICE_DISCOUNT:
            return (
                <tr>
                    <Table.CellHeader>Phần trăm giảm</Table.CellHeader>
                    <Table.CellHeader>Số tiền tối đa</Table.CellHeader>
                    <Table.CellHeader>Tổng tiền đơn tối thiểu</Table.CellHeader>
                    <Table.CellHeader>Số lượng áp dụng tối đa</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
            return (
                <tr>
                    <Table.CellHeader>Loại vé yêu cầu</Table.CellHeader>
                    <Table.CellHeader>Số lượng vé yêu cầu</Table.CellHeader>
                    <Table.CellHeader>Sản phẩm tặng</Table.CellHeader>
                    <Table.CellHeader>Số lượng tặng</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        default:
            return null;
    }
};

const DynamicDetailsList = () => {
    const { values } = useFormikContext<FormValues>();
    if (!values.type) return null;

    return (
        <table>
            <thead>
            <DetailHeaders />
            </thead>
            <tbody>
            <FieldArray name="promotionDetails"
                        render={arrayHelper => (
                            <>
                                {
                                    values.promotionDetails.map((detail, index) => (
                                        <tr key={index} className="relative">
                                            <DetailFields index={index} />
                                            <Table.Cell>
                                                {
                                                    values.promotionDetails.length > 0 && (
                                                        <div className="flex justify-center items-center mb-3">
                                                            <button type="button" onClick={() => arrayHelper.remove(index)}>
                                                                <IoMdRemoveCircleOutline size={25} />
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </Table.Cell>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <Table.Cell>
                                        <ButtonAction.Add onClick={() => arrayHelper.push({})} text="Thêm chi tiết" />
                                    </Table.Cell>
                                </tr>
                            </>
                        )}
            />
            </tbody>
        </table>

    );
};

const PromotionLineSchema = object({
    code: string().required('Mã chương trình là bắt buộc'),
});

interface CashRebateDetail {
    discountValue?: number;
    minOrderValue?: number;
    usageLimit?: number;
}

interface PriceDiscountDetail {
    discountValue?: number;
    minOrderValue?: number;
    maxDiscountValue?: number;
    usageLimit?: number;
}

type PromotionDetail = CashRebateDetail | PriceDiscountDetail;

interface FormValues {
    code: string;
    name: string;
    type: PromotionLineType;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    promotionDetails: PromotionDetail[];
}

const UpdatePromotionLinePage = () => {
    const router = useRouter();
    const { code, lineCode } = useParams<{ code: string; lineCode: string }>();
    const { data: promotion, isLoading: isLoadingPromotion } = usePromotionByCode(code);
    const { data: promotionLine, isLoading: isLoadingPromotionLine } = usePromotionLineByCode(lineCode);

    useEffect(() => {
        document.title = 'B&Q Cinema - Cập nhật CTKM';
    }, []);

    if (isLoadingPromotion || isLoadingPromotionLine) {
        return <Loader />;
    }

    if (!promotion || !promotionLine) return (
        <NotFound />
    );

    const initialFormValues: FormValues = {
        code: lineCode,
        name: promotionLine.name,
        status: promotionLine.status,
        type: promotionLine.type,
        startDate: dayjs(promotionLine.startDate).toDate(),
        endDate: dayjs(promotionLine.endDate).toDate(),
        promotionDetails: promotionLine.promotionDetails?.map((detail) => {
            switch (promotionLine.type) {
                case PromotionLineType.CASH_REBATE:
                    return {
                        discountValue: detail.discountValue,
                        minOrderValue: detail.minOrderValue,
                        usageLimit: detail.usageLimit,
                    };
                case PromotionLineType.PRICE_DISCOUNT:
                    return {
                        discountValue: detail.discountValue,
                        minOrderValue: detail.minOrderValue,
                        maxDiscountValue: detail.maxDiscountValue,
                        usageLimit: detail.usageLimit,
                    };
                case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
                    return {
                        requiredSeatType: detail.requiredSeatType,
                        requiredSeatQuantity: detail.requiredSeatQuantity,
                        giftProduct: detail.giftProduct,
                        usageLimit: detail.usageLimit,
                    };
                default:
                    return {};
            }
        })
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {

            router.back();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col gap-5 mt-5">
            <Card className="p-4">
                <Typography.Title level={4}>Thông tin chiến dịch</Typography.Title>
                <div className="flex flex-col gap-3">
                    <ItemInfo label="Tên" value={promotion.name} />
                    <ItemInfo label="Thời gian"
                              value={`${formatDateToLocalDate(promotion.startDate)} - ${formatDateToLocalDate(promotion.endDate)}`} />
                </div>
            </Card>
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={PromotionLineSchema}>
                <Form>
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-5">
                            <Card className="p-4">
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <Input name="code" label="Mã chương trình" readOnly placeholder="Nhập mã chương trình"
                                       required />
                                <Input name="name" label="Tên" placeholder="Nhập tên chương trình" required />
                                <Select name="type" label="Loại" placeholder="Chọn loại" readOnly options={[
                                    {
                                        label: PromotionLineTypeVietnamese[PromotionLineType.CASH_REBATE],
                                        value: PromotionLineType.CASH_REBATE,
                                    },
                                    {
                                        label: PromotionLineTypeVietnamese[PromotionLineType.PRICE_DISCOUNT],
                                        value: PromotionLineType.PRICE_DISCOUNT,
                                    },
                                ]} />
                            </Card>

                            <Card className="p-4">
                                <Typography.Title level={4}>Thời gian & Trạng thái</Typography.Title>
                                <DatePicker name="startDate" label="Ngày bắt đầu" required
                                            minDate={dayjs(promotion.startDate).toDate()}
                                            maxDate={dayjs(promotion.endDate).toDate()} />
                                <DatePicker name="endDate" label="Ngày kết thúc" required
                                            minDate={dayjs(promotion.startDate).toDate()}
                                            maxDate={dayjs(promotion.endDate).toDate()} />
                                <Select name="status" label="Trạng thái" placeholder="Chọn trạng thái" options={[
                                    ...Object.keys(BaseStatus).map((status) => ({
                                        label: BaseStatusVietnamese[status as BaseStatus], value: status,
                                    })),
                                ]} />
                            </Card>
                        </div>

                        <Card className="p-4">
                            <Typography.Title level={4}>Danh sách chi tiết</Typography.Title>
                            <DynamicDetailsList />
                        </Card>

                        <div className="mb-10 flex justify-end items-center gap-4">
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary" type="button"
                                        onClick={() => router.back()}>
                                Hủy bỏ
                            </ButtonIcon>
                            <ButtonIcon icon={<FaSave />} type="submit">
                                Cập nhật
                            </ButtonIcon>
                        </div>

                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default UpdatePromotionLinePage;