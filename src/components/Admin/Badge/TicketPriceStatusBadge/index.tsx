import React from 'react';
import { TicketPriceStatus, ProductPriceStatusVietnamese } from '@/modules/ticketPrices/interface';

const statusColors: Record<TicketPriceStatus, string> = {
    [TicketPriceStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [TicketPriceStatus.INACTIVE]: 'text-red-700 bg-red-100',
};

type TicketPriceStatusBadgeProps = {
    status: TicketPriceStatus;
};


const TicketPriceStatusBadge = ({ status }: TicketPriceStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {ProductPriceStatusVietnamese[status] || status}
        </span>
    );
};

export default TicketPriceStatusBadge;