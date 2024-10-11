import { LuLayoutGrid } from 'react-icons/lu';
import React from 'react';
import { RiMovie2Line, RiTicketLine } from 'react-icons/ri';
import { IoMdGift } from 'react-icons/io';
import { FiCalendar } from 'react-icons/fi';
import { GoPackage } from 'react-icons/go';

export type IAdminRoute = {
    name: string;
    path: string;
    icon?: React.ReactNode;
    children?: IAdminRoute[];
}

const adminRoutes: IAdminRoute[] = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LuLayoutGrid />,
    },
    {
        name: 'Phim',
        path: '/admin/movies',
        icon: <RiMovie2Line />,
        children: [
            { name: 'Tất cả  phim', path: '/admin/movies' },
            { name: 'Tất cả diễn viên', path: '/admin/movies/actors' },
            { name: 'Tất cả đạo diễn', path: '/admin/movies/directors' },
        ],
    },
    {
        name: 'Khuyến mãi',
        path: '/admin/promotions',
        icon: <IoMdGift />,
    },
    {
        name: 'Lịch chiếu',
        path: '/admin/show-times',
        icon: <FiCalendar />,
    },
    {
        name: 'Đơn hàng',
        path: '/admin/orders',
        icon: <RiTicketLine />,
    },
    {
        name: 'Sản phẩm',
        path: '/admin/products',
        icon: <GoPackage />,
    },
];

export default adminRoutes;