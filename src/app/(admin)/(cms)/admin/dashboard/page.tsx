"use client";
import React, { useEffect } from 'react';
import Widget from '@/components/Admin/Widget';
import { MdBarChart } from 'react-icons/md';
import MiniCalendar from '@/components/Admin/Calendar/MiniCalendar';
import { useDashboardStats } from '@/modules/dashboard/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { RiMovie2Line } from 'react-icons/ri';
import { BiCameraMovie } from 'react-icons/bi';
import MovieRevenueChart from '@/components/Admin/DashBoard/MovieRevenueChart';

const Dashboard = () => {

    const { data: stats } = useDashboardStats();
    useEffect(() => {
        document.title = 'B&Q Cinema - Dashboard';
    }, []);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1  gap-5 md:grid-cols-3">
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Doanh thu tổng" subtitle={formatNumberToCurrency(stats?.totalRevenue || 0).toString()}/>
                <Widget icon={<RiMovie2Line className="h-7 w-7" />} title="Số phim đang chiếu" subtitle={stats ? stats.moviesCount.toString() : '0'}/>
                <Widget icon={<BiCameraMovie className="h-7 w-7" />} title="Suất chiếu hôm nay" subtitle={stats ? stats.showTimesToday.toString() : '0'}/>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                <div className="col-span-4">
                    <MovieRevenueChart/>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
                    {/*<PieChartCard/>*/}
                    <div className="h-fit">
                        <MiniCalendar/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;