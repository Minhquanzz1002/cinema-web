import React from 'react';
import { ProductPriceStatusVietnamese } from '@/modules/ticketPrices/interface';
import { ProductPriceStatus } from '@/modules/products/interface';

const statusColors: Record<ProductPriceStatus, string> = {
    [ProductPriceStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [ProductPriceStatus.INACTIVE]: 'text-red-700 bg-red-100',
};

type ProductPriceStatusBadgeProps = {
    status: ProductPriceStatus;
};


const TicketPriceStatusBadge = ({ status }: ProductPriceStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {ProductPriceStatusVietnamese[status] || status}
        </span>
    );
};

export default TicketPriceStatusBadge;