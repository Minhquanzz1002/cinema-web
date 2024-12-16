import { LuLayoutGrid } from 'react-icons/lu';
import React from 'react';
import { RiMoneyDollarCircleLine, RiMovie2Line } from 'react-icons/ri';
import { IoMdGift } from 'react-icons/io';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import { IoTicketOutline } from 'react-icons/io5';
import { MdOutlineLocationOn } from 'react-icons/md';
import { PiPopcorn } from 'react-icons/pi';
import { HiOutlineDocumentReport } from 'react-icons/hi';

export type IAdminRoute = {
    name: string;
    path: string;
    icon?: React.ReactNode;
    children?: IAdminRoute[];
}

const adminRoutes: IAdminRoute[] = [
    {
        name: 'Tổng quan',
        path: '/admin/dashboard',
        icon: <LuLayoutGrid />,
    },
    {
        name: 'Báo cáo',
        path: '/admin/reports',
        icon: <HiOutlineDocumentReport />,
        children: [
            { name: 'DSBH theo NVBH', path: '/admin/reports/employee-sales' },
            { name: 'DSBH theo phim', path: '/admin/reports/movie-sales' },
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
            { name: 'Bán hàng', path: '/admin/bills/completed' },
            { name: 'Hoàn trả', path: '/admin/bills/refund' },
        ]
    },
    {
        name: 'Sản phẩm',
        path: '/admin/products',
        icon: <PiPopcorn />,
        children: [
            { name: 'Tất cả sản phẩm', path: '/admin/products' },
            { name: 'Bảng giá', path: '/admin/products/prices' },
        ]
    },
    {
        name: 'Bán vé',
        path: '/admin/sales',
        icon: <RiMoneyDollarCircleLine />,
    },
    {
        name: 'Tài khoản',
        path: '/admin/accounts',
        icon: <FiUsers />,
        children: [
            { name: 'Nhân viên', path: '/admin/accounts/employees' },
            { name: 'Khách hàng', path: '/admin/accounts/customers' },
        ]
    },
];

export default adminRoutes;