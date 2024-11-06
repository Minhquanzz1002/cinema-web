import React from 'react';
import { RefundStatus, RefundStatusVietnamese } from '@/modules/orders/interface';

const statusColors: Record<RefundStatus, string> = {
    [RefundStatus.COMPLETED]: 'text-green-700 bg-green-100',
    [RefundStatus.PENDING]: 'text-red-700 bg-red-100',
};

type RefundStatusBadgeProps = {
    status: RefundStatus;
};


const RefundStatusBadge = ({ status }: RefundStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {RefundStatusVietnamese[status] || status}
        </span>
    );
};

export default RefundStatusBadge;