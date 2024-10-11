import React from 'react';
import { BaseStatus } from '@/modules/base/interface';
import { baseStatusLabels } from '@/utils/enumMappings';

const statusColors: Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [BaseStatus.INACTIVE]: 'text-red-700 bg-red-100',
};

type BaseStatusBadgeProps = {
    status: BaseStatus;
};


const BaseStatusBadge = ({ status }: BaseStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 ${colorClass}`}>
            {baseStatusLabels[status] || status}
        </span>
    );
};

export default BaseStatusBadge;