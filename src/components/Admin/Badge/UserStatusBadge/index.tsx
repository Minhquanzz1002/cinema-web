import React from 'react';
import { UserStatus, UserStatusVietnamese } from '@/modules/authentication/interface';

const statusColors: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: 'text-green-700 bg-green-100',
    [UserStatus.INACTIVE]: 'text-red-700 bg-red-100',
};

type UserStatusBadgeProps = {
    status: UserStatus;
};


const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {UserStatusVietnamese[status] || status}
        </span>
    );
};

export default UserStatusBadge;