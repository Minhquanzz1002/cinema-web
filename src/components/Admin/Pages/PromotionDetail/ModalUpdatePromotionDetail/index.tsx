import React from 'react';
import { Form, Formik } from 'formik';
import Modal from '@/components/Admin/Modal';
import Select from '@/components/Admin/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';
import InputCurrency from '@/components/Admin/InputCurrency';
import { AdminPromotionLineOverview, PromotionLineType } from '@/modules/promotions/interface';
import { number, object, string } from 'yup';
import { useCreatePromotionDetail } from '@/modules/promotions/repository';

type ModalAddPromotionDetailProps = {
    onClose: () => void;
    promotionLine: AdminPromotionLineOverview | null;
}

// interface CashRebateFormValues {
//     status: BaseStatus;
//     discountValue: number;
//     minOrderValue?: number;
//     usageLimit: number;
// }

const CashRebateForm = ({onClose} : {onClose: () => void}) => {

    return (
        <Form>
            <InputCurrency name="discountValue" label="Số tiền giảm" placeholder="Nhập số tiền giảm" required unit="VND"/>
            <InputCurrency name="minOrderValue" label="Giá trị đơn hàng tối thiểu" placeholder="Nhập giá trị đơn hàng tối thiểu" unit="VND"/>
            <InputCurrency name="usageLimit" label="Số lượng áp dụng tối đa" placeholder="Nhập số lượng áp dụng tối đa" required/>
            <Select name="status" label="Trạng thái" readOnly tooltip="Trạng thái mặc định khi tạo là `Ngưng kích hoạt`" options={[
                { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
            ]}/>
            <div className="flex justify-end items-center gap-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit />
            </div>
        </Form>
    );
};

const PriceDiscountForm = ({onClose} : {onClose: () => void}) => {
    return (
        <Form>
            <InputCurrency name="discountValue" label="Tỷ lệ giảm" placeholder="Nhập tỷ lệ giảm" required unit="%"/>
            <InputCurrency name="maxDiscountValue" label="Giới hạn số tiền giảm" placeholder="Nhập giới hạn số tiền giảm" unit="VND"/>
            <InputCurrency name="minOrderValue" label="Giá trị đơn hàng tối thiểu" placeholder="Nhập giá trị đơn hàng tối thiểu" unit="VND"/>
            <InputCurrency name="usageLimit" label="Số lượng áp dụng tối đa" placeholder="Nhập số lượng áp dụng tối đa" required/>
            <Select name="status" label="Trạng thái" readOnly tooltip="Trạng thái mặc định khi tạo là `Ngưng kích hoạt`" options={[
                { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
            ]}/>
            <div className="flex justify-end items-center gap-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit />
            </div>
        </Form>
    );
};

const ModalAddPromotionDetail = ({onClose, promotionLine} : ModalAddPromotionDetailProps) => {
    const createPromotionDetail = useCreatePromotionDetail();

    const getValidationSchema = () => {
        const baseSchema = object({
            status: string().required('Trạng thái là bắt buộc'),
        });

        switch (promotionLine?.type) {
            case PromotionLineType.CASH_REBATE:
                return baseSchema.shape({
                    discountValue: number().required('Số tiền giảm là bắt buộc').min(0),
                    minOrderValue: number().optional().min(0),
                    usageLimit: number().required('Giới hạn sử dụng là bắt buộc').min(1, 'Giới hạn sử dụng tối thiểu là 1'),
                });
            default:
                return baseSchema;
        }
    };

    const getInitialValues = () => {
        const baseValues = {
            status: BaseStatus.INACTIVE,
        };

        switch (promotionLine?.type) {
            case PromotionLineType.CASH_REBATE:
                return {
                    ...baseValues,
                    discountValue: 0,
                    minOrderValue: undefined,
                    usageLimit: 1,
                };
            case PromotionLineType.PRICE_DISCOUNT:
                return {
                    ...baseValues,
                    discountValue: 0,
                    maxDiscountValue: undefined,
                    minOrderValue: 0,
                    usageLimit: 1,
                };
            default:
                return baseValues;
        }
    };

    const getFormContent = () => {
        switch (promotionLine?.type) {
            case PromotionLineType.CASH_REBATE:
                return <CashRebateForm onClose={onClose}/>;
            case PromotionLineType.PRICE_DISCOUNT:
                return <PriceDiscountForm onClose={onClose}/>;
            // case PromotionLineType.BUY_TICKETS_GET_TICKETS:
            //     return <BuyTicketsGetTicketsForm />;
            // case PromotionLineType.BUY_TICKETS_GET_PRODUCTS:
            //     return <BuyTicketsGetProductsForm />;
            default:
                return null;
        }
    };

    if (!promotionLine) {
        return null;
    }

    const handleSubmit = async (values: any) => {
        console.log(values);
        try {
            await createPromotionDetail.mutateAsync({
                promotionLineId: promotionLine.id,
                payload: {
                    ...values,
                }
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thêm chi tiết khuyến mãi" open={true} onClose={onClose}>
            <Formik initialValues={getInitialValues()} onSubmit={handleSubmit} validationSchema={getValidationSchema}>
                {getFormContent()}
            </Formik>
        </Modal>
    );
};

export default ModalAddPromotionDetail;