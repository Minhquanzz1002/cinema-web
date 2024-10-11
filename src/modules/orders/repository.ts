import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { BaseOrder, AdminOrderOverview } from '@/modules/orders/interface';

const findAllOrders = () : Promise<SuccessResponse<PageObject<BaseOrder>>> => {
    return httpRepository.execute({path: '/admin/v1/orders'});
};

const findOrderByCode = (code: string) : Promise<SuccessResponse<AdminOrderOverview>> => {
    return httpRepository.execute({path: `/admin/v1/orders/${code}`});
};

export const useAllOrders = () => {
    return useQuery({ queryKey: ['orders'], queryFn: findAllOrders });
};

export const useOrderDetail = (code: string | string[] | undefined) => {
    return useQuery({ queryKey: ['orders', code], queryFn: () => findOrderByCode(code) , enabled: !!code});
};