import { BaseStatus } from '@/modules/base/interface';
import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { AdminProductPriceOverview } from '@/modules/productPrices/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductPriceHistory } from '@/modules/products/interface';
import { toast } from 'react-toastify';

export const PRODUCT_PRICE_QUERY_KEY = 'product-prices';

/**
 * Fetch all product price
 */
interface FetchAllProductPriceParams {
    page?: number;
    search?: string;
    status?: BaseStatus;
    startDate?: string;
    endDate?: string;
}

const findAllProductPrices = (params: FetchAllProductPriceParams): Promise<SuccessResponse<PageObject<AdminProductPriceOverview>>> => {
    return httpRepository.get<PageObject<AdminProductPriceOverview>>(`/admin/v1/product-prices`, {
        ...params,
    });
};

export const useAllProductPrices = (params: FetchAllProductPriceParams) => {
    return useQuery({
        queryKey: [PRODUCT_PRICE_QUERY_KEY, params],
        queryFn: () => findAllProductPrices(params),
    });
};

/**
 * Create product price
 */

interface CreateProductPriceData {
    startDate: string;
    endDate: string;
    status: BaseStatus;
    products: {
        id: number;
        price: number;
    }[];
}

const createProductPrice = (data: CreateProductPriceData): Promise<SuccessResponse<void>> => {
    return httpRepository.post<void, CreateProductPriceData>(`/admin/v1/product-prices`, data);
};

export const useCreateProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProductPrice,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_PRICE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Thêm bảng giá không thành công. Hãy thử lại');
            console.error('Create product price error:', error);
        },
    });
};

/**
 * Delete product price
 */

const deleteProductPrice = (id: number): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/product-prices/${id}`);
};

export const useDeleteProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProductPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_PRICE_QUERY_KEY] });
            toast.success('Xóa bảng giá sản phẩm thành công');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Xóa bảng giá sản phẩm không thành công. Hãy thử lại');
            console.error('Delete product price error:', error);
        },
    });
};

/**
 * Update product price
 */
interface UpdateProductPriceData {
    startDate: string;
    endDate: string;
    price: number;
    status: BaseStatus;
}

const updateProductPrice = ({ data, id }: {
    id: number
    data: UpdateProductPriceData
}): Promise<SuccessResponse<ProductPriceHistory>> => {
    return httpRepository.put<ProductPriceHistory, UpdateProductPriceData>(`/admin/v1/product-prices/${id}`, data);
};

export const useUpdateProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProductPrice,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_PRICE_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Cập nhật bảng giá không thành công. Hãy thử lại');
            console.error('Update product price error:', error);
        },
    });
};