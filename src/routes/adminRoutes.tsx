import {LuLayoutGrid} from "react-icons/lu";
import React from "react";
import {RiMovie2Line, RiTicketLine} from "react-icons/ri";
import {IoMdGift} from "react-icons/io";
import {FiCalendar} from "react-icons/fi";
import {GiCorn} from "react-icons/gi";
import {GoPackage} from "react-icons/go";

export type IAdminRoute = {
    name: string;
    path: string;
    icon?: React.ReactNode;
    children?: IAdminRoute[];
}

const adminRoutes: IAdminRoute[] = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <LuLayoutGrid/>
    },
    {
        name: "Phim",
        path: "/admin/movies",
        icon: <RiMovie2Line />,
        children: [
            {name: 'Tất cả  phim', path: "/admin/movies"},
            {name: 'Tất cả thể loại', path: "/admin/movies/genres"},
        ]
    },
    {
        name: "Khuyến mãi",
        path: "/admin/promotions",
        icon: <IoMdGift />
    },
    {
        name: "Lịch chiếu",
        path: "/admin/showtime",
        icon: <FiCalendar />
    },
    {
        name: "Đơn hàng",
        path: "/admin/orders",
        icon: <RiTicketLine />
    },
    {
        name: "Sản phẩm",
        path: "/admin/products",
        icon: <GoPackage />,
        children: [
            {name: 'Tất cả sản phẩm', path: "/admin/products"},
            {name: 'Tất cả combo', path: "/admin/combos"},
        ]
    },
]

export default adminRoutes;