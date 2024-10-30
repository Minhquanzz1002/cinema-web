import React from 'react';
import { VisibilityStatus, VisibilityStatusVietnamese } from '@/modules/base/interface';

const statusColors: Record<VisibilityStatus, string> = {
    [VisibilityStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [VisibilityStatus.INACTIVE]: 'text-red-700 bg-red-100',
};

type VisibilityStatusBadgeProps = {
    status: VisibilityStatus;
};


const BaseStatusBadge = ({ status }: VisibilityStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {VisibilityStatusVietnamese[status] || status}
        </span>
    );
};

export default BaseStatusBadge;