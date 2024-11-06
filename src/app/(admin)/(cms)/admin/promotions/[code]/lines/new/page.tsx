'use client';
import React, { useEffect } from 'react';
import { FieldArray, FieldArrayRenderProps, Form, Formik, useFormikContext } from 'formik';
import { date, object, string } from 'yup';
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
import { useCreatePromotionLine, usePromotionByCode } from '@/modules/promotions/repository';
import Loader from '@/components/Admin/Loader';
import NotFound from '@/components/Admin/NotFound';
import { formatDateToLocalDate } from '@/utils/formatDate';
import dayjs from 'dayjs';
import Table from '@/components/Admin/Pages/PromotionLine/Table';
import { useAllProductActive } from '@/modules/products/repository';

const DetailFields = ({ index }: { index: number }) => {
    const { values } = useFormikContext<FormValues>();
    const { data: products = [] } = useAllProductActive();

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
                    <Table.Cell>
                        <Select name={`promotionDetails.${index}.status`} options={[
                            ...Object.keys(BaseStatus).map((status) => ({
                                label: BaseStatusVietnamese[status as BaseStatus],
                                value: status,
                            })),
                        ]} />
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
                        <InputCurrency name={`promotionDetails.${index}.usageLimit`}
                                       placeholder="Nhập số lượng áp dụng tối đa" required />
                    </Table.Cell>
                    <Table.Cell>
                        <Select name={`promotionDetails.${index}.status`} options={[
                            ...Object.keys(BaseStatus).map((status) => ({
                                label: BaseStatusVietnamese[status as BaseStatus],
                                value: status,
                            })),
                        ]} />
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
                    <Table.Cell className="max-w-32">
                        <Input name={`promotionDetails.${index}.requiredSeatQuantity`} />
                    </Table.Cell>
                    <Table.Cell className="min-w-96">
                        <Select name={`promotionDetails.${index}.giftProduct`}
                                options={products?.map(product => ({
                                    label: `#${product.code} - ${product.name}`,
                                    value: product.id,
                                })) ?? []} />
                    </Table.Cell>
                    <Table.Cell className="max-w-32">
                        <Input name={`promotionDetails.${index}.giftQuantity`} />
                    </Table.Cell>
                    <Table.Cell className="max-w-32">
                        <Input name={`promotionDetails.${index}.usageLimit`} required />
                    </Table.Cell>
                    <Table.Cell>
                        <Select name={`promotionDetails.${index}.status`} options={[
                            ...Object.keys(BaseStatus).map((status) => ({
                                label: BaseStatusVietnamese[status as BaseStatus],
                                value: status,
                            })),
                        ]} />
                    </Table.Cell>
                </>
            );
        case PromotionLineType.BUY_TICKETS_GET_TICKETS:
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
                        <Select name={`promotionDetails.${index}.giftSeatType`} options={[
                            ...Object.keys(SeatType).map((seatType) => ({
                                label: SeatTypeVietnamese[seatType as SeatType],
                                value: seatType,
                            })),
                        ]} />
                    </Table.Cell>
                    <Table.Cell>
                        <Input name={`promotionDetails.${index}.giftSeatQuantity`}
                               placeholder="Nhập số lượng vé tặng" />
                    </Table.Cell>
                    <Table.Cell>
                        <Input name={`promotionDetails.${index}.usageLimit`} required />
                    </Table.Cell>
                    <Table.Cell>
                        <Select name={`promotionDetails.${index}.status`} options={[
                            ...Object.keys(BaseStatus).map((status) => ({
                                label: BaseStatusVietnamese[status as BaseStatus],
                                value: status,
                            })),
                        ]} />
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
                    <Table.CellHeader>Giá trị đơn hàng tối thiểu</Table.CellHeader>
                    <Table.CellHeader>Giới hạn số lần sử dụng</Table.CellHeader>
                    <Table.CellHeader>Trạng thái</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        case PromotionLineType.PRICE_DISCOUNT:
            return (
                <tr>
                    <Table.CellHeader>Tỷ lệ giảm</Table.CellHeader>
                    <Table.CellHeader>Giới hạn số tiền giảm</Table.CellHeader>
                    <Table.CellHeader>Giá trị đơn hàng tối thiểu</Table.CellHeader>
                    <Table.CellHeader>Giới hạn số lần sử dụng</Table.CellHeader>
                    <Table.CellHeader>Trạng thái</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        case PromotionLineType.BUY_TICKETS_GET_TICKETS:
            return (
                <tr>
                    <Table.CellHeader>Loại vé điều kiện</Table.CellHeader>
                    <Table.CellHeader>SL vé điều kiện</Table.CellHeader>
                    <Table.CellHeader>Vé tặng</Table.CellHeader>
                    <Table.CellHeader>Số vé tặng</Table.CellHeader>
                    <Table.CellHeader>Giới hạn số lần sử dụng</Table.CellHeader>
                    <Table.CellHeader>Trạng thái</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
            return (
                <tr>
                    <Table.CellHeader>Loại vé điều kiện</Table.CellHeader>
                    <Table.CellHeader>SL vé điều kiện</Table.CellHeader>
                    <Table.CellHeader>Sản phẩm tặng</Table.CellHeader>
                    <Table.CellHeader>SL quà tặng</Table.CellHeader>
                    <Table.CellHeader>GH số lần sử dụng</Table.CellHeader>
                    <Table.CellHeader>Trạng thái</Table.CellHeader>
                    <Table.CellHeader></Table.CellHeader>
                </tr>
            );
        default:
            return null;
    }
};

const DynamicDetailsList = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();

    useEffect(() => {
        const getInitialDetail = () => {
            switch (values.type) {
                case PromotionLineType.CASH_REBATE:
                    return [{
                        discountValue: 0,
                        usageLimit: 1,
                        minOrderValue: 0,
                        status: BaseStatus.INACTIVE,
                    }];
                case PromotionLineType.PRICE_DISCOUNT:
                    return [{
                        discountValue: 0,
                        usageLimit: 1,
                        minOrderValue: 0,
                        maxDiscountValue: undefined,
                        status: BaseStatus.INACTIVE,
                    }];
                case PromotionLineType.BUY_TICKETS_GET_TICKETS:
                    return [{
                        requiredSeatType: undefined,
                        requiredSeatQuantity: undefined,
                        giftSeatType: undefined,
                        giftSeatQuantity: undefined,
                        usageLimit: 1,
                        status: BaseStatus.INACTIVE,
                    }];
                case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
                    return [{
                        requiredSeatType: undefined,
                        requiredSeatQuantity: undefined,
                        giftProduct: undefined,
                        giftQuantity: undefined,
                        usageLimit: 1,
                        status: BaseStatus.INACTIVE,
                    }];
                default:
                    return [];
            }
        };

        setFieldValue('promotionDetails', getInitialDetail());
    }, [values.type, setFieldValue]);

    if (!values.type) return null;

    const handleAddDetail = (arrayHelper: FieldArrayRenderProps) => {
        const type = values.type;
        switch (type) {
            case PromotionLineType.CASH_REBATE:
                arrayHelper.push({ discountValue: 0, usageLimit: 1, minOrderValue: 0, status: BaseStatus.INACTIVE });
                break;
            case PromotionLineType.PRICE_DISCOUNT:
                arrayHelper.push({ discountValue: 0, usageLimit: 1, minOrderValue: 0, maxDiscountValue: undefined, status: BaseStatus.INACTIVE });
                break;
            default:
                arrayHelper.push({});
                break;
        }
    };

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
                                        <ButtonAction.Add onClick={() => handleAddDetail(arrayHelper)}
                                                          text="Thêm chi tiết" />
                                    </Table.Cell>
                                </tr>
                            </>
                        )}
            />
            </tbody>
        </table>

    );
};

const basePromotionLineSchema = object({
    code: string().required('Mã chương trình là bắt buộc')
        .min(4, 'Mã chương trình phải có ít nhất 4 ký tự'),
    name: string().required('Tên chương trình là bắt buộc'),
    type: string().required('Loại chương trình là bắt buộc').oneOf(
        Object.values(PromotionLineType),
        'Loại chương trình không hợp lệ',
    ),
    startDate: date().required('Ngày bắt đầu là bắt buộc'),
    endDate: date().required('Ngày kết thúc là bắt buộc'),
    status: string().required('Trạng thái là bắt buộc'),
});

// const cashRebateDetailSchema = object({
//     discountValue: number().required('Số tiền giảm là bắt buộc').min(0),
//     minOrderValue: number().optional().min(0),
//     usageLimit: number().required('Số lượng áp dụng tối đa là bắt buộc').min(1),
// });
//
// const priceDiscountDetailSchema = object({
//     discountValue: number().required('Phần trăm giảm là bắt buộc').min(0).max(100),
//     maxDiscountValue: number().optional().min(0),
//     minOrderValue: number().optional().min(0),
//     usageLimit: number().required('Số lượng áp dụng tối đa là bắt buộc').min(1),
// });

// const getPromotionLineSchema = (type: PromotionLineType) => {
//     const detailSchema = (() => {
//         switch (type) {
//             case PromotionLineType.CASH_REBATE:
//                 return cashRebateDetailSchema;
//             case PromotionLineType.PRICE_DISCOUNT:
//                 return priceDiscountDetailSchema;
//             case PromotionLineType.BUY_TICKETS_GET_TICKETS:
//                 return buyTicketsGetTicketsDetailSchema;
//             case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
//                 return buyTicketsGetProductsDetailSchema;
//             default:
//                 return object({});
//         }
//     })();
//
//     return basePromotionLineSchema.shape({
//         promotionDetails: object().shape({
//             details: detailSchema,
//         }),
//     });
// };

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

interface BuyTicketsGetTicketsDetail {
    requiredSeatType?: SeatType;
    requiredSeatQuantity?: number;
    giftSeatType?: SeatType;
    giftSeatQuantity?: number;
    usageLimit?: number;
}

interface BuyTicketsGetProductsDetail {
    requiredSeatType?: SeatType;
    requiredSeatQuantity?: number;
    giftProduct?: number;
    giftQuantity?: number;
    usageLimit?: number;
}

type PromotionDetail =
    CashRebateDetail
    | PriceDiscountDetail
    | BuyTicketsGetTicketsDetail
    | BuyTicketsGetProductsDetail;

interface FormValues {
    code: string;
    name: string;
    type: PromotionLineType;
    startDate: Date;
    endDate: Date;
    status: BaseStatus;
    promotionDetails: PromotionDetail[];
}

const NewPromotionLinePage = () => {
    const router = useRouter();
    const { code } = useParams<{ code: string }>();
    const { data: promotion, isLoading: isLoadingPromotion } = usePromotionByCode(code);
    const createPromotionLine = useCreatePromotionLine();

    useEffect(() => {
        document.title = 'B&Q Cinema - Thêm CTKM';
    }, []);

    if (isLoadingPromotion) {
        return <Loader />;
    }

    if (!promotion) return (
        <NotFound />
    );

    const initialFormValues: FormValues = {
        code: '',
        name: '',
        status: BaseStatus.ACTIVE,
        type: PromotionLineType.CASH_REBATE,
        startDate: dayjs(promotion.startDate).toDate(),
        endDate: dayjs(promotion.endDate).toDate(),
        promotionDetails: [{ discountValue: 0, usageLimit: 1, minOrderValue: 0 }],
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createPromotionLine.mutateAsync({
                promotionId: promotion.id,
                payload: {
                    ...values,
                    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
                },
            });
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
                    validationSchema={basePromotionLineSchema}>
                <Form>
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-5">
                            <Card className="p-4">
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <Input name="code" label="Mã chương trình" placeholder="Nhập mã chương trình"
                                       required uppercase />
                                <Input name="name" label="Tên" placeholder="Nhập tên chương trình" required />
                                <Select name="type" label="Loại" placeholder="Chọn loại" options={[
                                    {
                                        label: PromotionLineTypeVietnamese[PromotionLineType.CASH_REBATE],
                                        value: PromotionLineType.CASH_REBATE,
                                    },
                                    {
                                        label: PromotionLineTypeVietnamese[PromotionLineType.PRICE_DISCOUNT],
                                        value: PromotionLineType.PRICE_DISCOUNT,
                                    },
                                    {
                                        label: PromotionLineTypeVietnamese[PromotionLineType.BUY_TICKETS_GET_PRODUCTS],
                                        value: PromotionLineType.BUY_TICKETS_GET_PRODUCTS,
                                    },
                                    {
                                        label: PromotionLineTypeVietnamese[PromotionLineType.BUY_TICKETS_GET_TICKETS],
                                        value: PromotionLineType.BUY_TICKETS_GET_TICKETS,
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
                            <Typography.Title level={4}>Chi tiết khuyến mãi</Typography.Title>
                            <DynamicDetailsList />
                        </Card>

                        <div className="mb-10 flex justify-end items-center gap-4">
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary" type="button"
                                        onClick={() => router.back()}>
                                Hủy bỏ
                            </ButtonIcon>
                            <ButtonIcon icon={<FaSave />} type="submit" disabled={createPromotionLine.isPending}>
                                {createPromotionLine.isPending ? 'Đang tạo...' : 'Tạo mới'}
                            </ButtonIcon>
                        </div>

                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default NewPromotionLinePage;