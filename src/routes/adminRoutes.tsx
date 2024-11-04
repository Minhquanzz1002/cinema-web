import { LuLayoutGrid } from 'react-icons/lu';
import React from 'react';
import { RiMoneyDollarCircleLine, RiMovie2Line } from 'react-icons/ri';
import { IoMdGift } from 'react-icons/io';
import { FiCalendar } from 'react-icons/fi';
import { GoPackage } from 'react-icons/go';
import { IoTicketOutline } from 'react-icons/io5';

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
        name: 'Giá vé',
        path: '/admin/ticket-prices',
        icon: <IoTicketOutline />,
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
        name: 'Hóa đơn',
        path: '/admin/bills',
        icon: <RiMoneyDollarCircleLine />,

    },
    {
        name: 'Sản phẩm',
        path: '/admin/products',
        icon: <GoPackage />,
        children: [
            { name: 'Tất cả sản phẩm', path: '/admin/products' },
            { name: 'Bảng giá', path: '/admin/products/prices' },
        ]
    },
    {
        name: 'Bán hàng',
        path: '/admin/sales',
        icon: <RiMoneyDollarCircleLine />,
    },
];

export default adminRoutes;