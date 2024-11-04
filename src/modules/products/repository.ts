import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { BaseProduct, BaseProductWithPrice, ProductPriceHistory, ProductStatus } from '@/modules/products/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';
import { BaseStatus } from '@/modules/base/interface';

export const PRODUCT_QUERY_KEY = 'products';
export const PRODUCT_PRICE_QUERY_KEY = 'product-prices';

/**
 * Fetch all products
 */
interface FetchAllProductParams {
    page?: number;
    search?: string;
    status?: ProductStatus;
}

const findAllProducts = (params: FetchAllProductParams): Promise<SuccessResponse<PageObject<BaseProductWithPrice>>> => {
    return httpRepository.get<PageObject<BaseProductWithPrice>>('/admin/v1/products', {
        page: params.page?.toString() || '0',
        search: params.search,
        status: params.status,
    });
};

export const useAllProducts = (params: FetchAllProductParams) => {
    return useQuery({
        queryKey: [PRODUCT_QUERY_KEY, params],
        queryFn: () => findAllProducts(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });
};

/**
 * Fetch product by code
 * @param code product code
 */

const findProductByCode = (code: string): Promise<SuccessResponse<BaseProductWithPrice>> => {
    return httpRepository.get<BaseProductWithPrice>(`/admin/v1/products/${code}`);
};

export const useProductByCode = (code: string) => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY, code],
        () => findProductByCode(code),
        { enabled: !!code },
    );
};

/**
 * Fetch all product price histories
 */
interface FetchAllProductPriceHistoriesParams {
    code: string;
    page?: number;
    status?: BaseStatus;
    startDate?: string;
    endDate?: string;
}

const findAllProductPriceHistories = ({
                                          code,
                                          page = 0,
                                          status,
                                          startDate,
                                          endDate,
                                      }: FetchAllProductPriceHistoriesParams): Promise<SuccessResponse<PageObject<ProductPriceHistory>>> => {
    return httpRepository.get<PageObject<ProductPriceHistory>>(`/admin/v1/products/${code}/price-histories`, {
        page,
        status,
        startDate,
        endDate,
    });
};

export const useAllProductPriceHistories = (params: FetchAllProductPriceHistoriesParams) => {
    return useQuery({
        queryKey: [PRODUCT_QUERY_KEY, PRODUCT_PRICE_QUERY_KEY, params],
        queryFn: () => findAllProductPriceHistories(params),
        enabled: !!params.code,
    });
};
/**
 * Get all active products
 */
const findAllProductActive = (): Promise<SuccessResponse<BaseProductWithPrice[]>> => {
    return httpRepository.get<BaseProductWithPrice[]>(`/admin/v1/products/all-active`);
};

export const useAllProductActive = () => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY],
        () => findAllProductActive()
    );
};

/**
 * Create product
 */

interface CreateProductData {
    code?: string;
    name: string;
    description: string;
    status: ProductStatus;
    image: string;
}

const createProduct = (data: CreateProductData): Promise<SuccessResponse<BaseProduct>> => {
    return httpRepository.post<BaseProduct, CreateProductData>('/admin/v1/products', data);
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Thêm sản phẩm thành công');
        },
        onError: error => {
            toast.error('Thêm sản phẩm thất bại');
            console.error('Create ticket price line error:', error);
        },
    });
};


/**
 * Delete product
 */
const deleteProduct = (code: string): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/products/${code}`);
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Xóa sản phẩm thành công');
        },
        onError: (error) => {
            toast.error('Xóa sản phẩm thất bại');
            console.error('Delete ticket price error:', error);
        },
    });
};

/**
 * Update product
 */
interface UpdateProductData {
    name?: string;
    description?: string;
    status: ProductStatus;
}

const updateProduct = ({ code, data }: {
    code: string,
    data: UpdateProductData
}): Promise<SuccessResponse<BaseProduct>> => {
    return httpRepository.put<BaseProduct, UpdateProductData>(`/admin/v1/products/${code}`, data);
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message);
            console.error('Delete ticket price error:', error);
        },
    });
};

/**
 * Create product price
 */

interface CreateProductPriceData {
    startDate: string;
    endDate: string;
    status: BaseStatus;
    price: number;
}

const createProductPrice = ({ code, data }: {
    code: string,
    data: CreateProductPriceData
}): Promise<SuccessResponse<ProductPriceHistory>> => {
    return httpRepository.post<ProductPriceHistory, CreateProductPriceData>(`/admin/v1/products/${code}/prices`, data);
};

export const useCreateProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProductPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Thêm giá sản phẩm thành công');
        },
        onError: (error) => {
            toast.error('Thêm giá sản phẩm thất bại');
            console.error('Create ticket price error:', error);
        },
    });
};

/**
 * Delete product price
 */

const deleteProductPrice = ({ code, id }: { code: string, id: number }): Promise<SuccessResponse<void>> => {
    return httpRepository.delete<void>(`/admin/v1/products/${code}/prices/${id}`);
};

export const useDeleteProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProductPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Xóa bảng giá sản phẩm thành công');
        },
        onError: (error) => {
            toast.error('Xóa bảng giá sản phẩm thất bại');
            console.error('Delete ticket price error:', error);
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

const updateProductPrice = ({ code, data, id }: {
    code: string,
    id: number
    data: UpdateProductPriceData
}): Promise<SuccessResponse<ProductPriceHistory>> => {
    return httpRepository.put<ProductPriceHistory, UpdateProductPriceData>(`/admin/v1/products/${code}/prices/${id}`, data);
};

export const useUpdateProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProductPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Cập nhật bảng giá thành công');
        },
        onError: (error) => {
            toast.error('Cập nhật bảng giá thất bại');
            console.error('Delete ticket price error:', error);
        },
    });
};

/**
 * Fetch all product for sale
 */
const findAllProductsForSale = (): Promise<SuccessResponse<BaseProductWithPrice[]>> => {
    return httpRepository.get<BaseProductWithPrice[]>('/v1/products');
};

export const useAllProductsForSale = () => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY, PRODUCT_PRICE_QUERY_KEY, 'sale'],
        () => findAllProductsForSale()
    );
};
