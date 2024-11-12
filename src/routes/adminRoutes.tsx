import { LuLayoutGrid } from 'react-icons/lu';
import React from 'react';
import { RiMoneyDollarCircleLine, RiMovie2Line } from 'react-icons/ri';
import { IoMdGift } from 'react-icons/io';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import { GoPackage } from 'react-icons/go';
import { IoTicketOutline } from 'react-icons/io5';
import { MdOutlineLocationOn } from 'react-icons/md';

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
        name: 'Báo cáo',
        path: '/admin/reports',
        icon: <RiMovie2Line />,
        children: [
            { name: 'DSBH theo ngày', path: '/admin/reports/daily-sales' },
            { name: 'Tổng kết khuyến mãi', path: '/admin/reports/promotion-summary' },
        ],
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
        name: 'Rạp',
        path: '/admin/cinemas',
        icon: <MdOutlineLocationOn />,
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
        children: [
            { name: 'Hoàn thành', path: '/admin/bills/completed' },
            { name: 'Hoàn trả', path: '/admin/bills/refund' },
        ]
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
    {
        name: 'Nhân viên',
        path: '/admin/employees',
        icon: <FiUsers />,
    },
];

export default adminRoutes;