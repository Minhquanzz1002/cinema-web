import { ErrorResponse, SuccessResponse } from '@/core/repository/interface';
import { BaseProduct, BaseProductWithPrice, ProductStatus } from '@/modules/products/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

export const PRODUCT_QUERY_KEY = 'products';
export const PRODUCT_PRICE_QUERY_KEY = 'product-prices';

/*======================================= Products ====================================*/
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
 * Fetch list of products (non paginated)
 */

const findListProducts = (search?: string): Promise<SuccessResponse<BaseProduct[]>> => {
    return httpRepository.get<BaseProduct[]>('/admin/v1/products/list', {
        search: search,
    });
};

export const useListProducts = (search?: string) => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY, 'list', search],
        () => findListProducts(search),
    );
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
 * Get all active products
 */
const findAllProductActive = (): Promise<SuccessResponse<BaseProductWithPrice[]>> => {
    return httpRepository.get<BaseProductWithPrice[]>(`/admin/v1/products/all-active`);
};

export const useAllProductActive = () => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY],
        () => findAllProductActive(),
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
    image?: string;
}

const createProduct = (data: CreateProductData): Promise<SuccessResponse<BaseProduct>> => {
    return httpRepository.post<BaseProduct, CreateProductData>('/admin/v1/products', data);
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success(res.message);
        },
        onError: (error: ErrorResponse) => {
            toast.error(error.message || 'Thêm sản phẩm không thành công. Hãy thử lại');
            console.error('Create product error:', error);
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
 * Fetch all product for sale
 */
const findAllProductsForSale = (): Promise<SuccessResponse<BaseProductWithPrice[]>> => {
    return httpRepository.get<BaseProductWithPrice[]>('/v1/products');
};

export const useAllProductsForSale = () => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY, PRODUCT_PRICE_QUERY_KEY, 'sale'],
        () => findAllProductsForSale(),
    );
};
