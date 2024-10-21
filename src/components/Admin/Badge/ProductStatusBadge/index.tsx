import React from 'react';
import { ProductStatus, ProductStatusVietnamese } from '@/modules/products/interface';

const statusColors: Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [ProductStatus.INACTIVE]: 'text-red-700 bg-red-100',
    [ProductStatus.SUSPENDED]: 'text-yellow-700 bg-yellow-100',
};

type ProductStatusBadgeProps = {
    status: ProductStatus;
};


const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 ${colorClass}`}>
            {ProductStatusVietnamese[status] || status}
        </span>
    );
};

export default ProductStatusBadge;