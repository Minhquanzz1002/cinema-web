import React from 'react';
import { OrderStatus, OrderStatusVietnamese } from '@/modules/orders/interface';

const statusColors = {
    [OrderStatus.PENDING]: 'text-yellow-500 bg-yellow-100',
    [OrderStatus.PAID]: 'text-green-500 bg-green-100',
    [OrderStatus.COMPLETED]: 'text-blue-500 bg-blue-200',
    [OrderStatus.CANCELLED]: 'text-red-500 bg-red-200',
};


const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50`}>
            {OrderStatusVietnamese[status] || status}
        </span>
    );
};

export default OrderStatusBadge;