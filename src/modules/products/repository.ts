import { SuccessResponse } from '@/core/repository/interface';
import { BaseProductWithPrice } from '@/modules/products/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';

const findAllProducts = () : Promise<SuccessResponse<PageObject<BaseProductWithPrice>>> => {
    return httpRepository.execute({path: '/admin/v1/products'});
};

export const useAllProducts = () => {
    return useQuery({ queryKey: ['products'], queryFn: findAllProducts });
};