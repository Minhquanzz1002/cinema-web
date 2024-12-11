'use client';
import React, { useEffect } from 'react';
import Widget from '@/components/Admin/Widget';
import { useDashboardStats } from '@/modules/dashboard/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { RiCustomerService2Line } from 'react-icons/ri';
import { BiCameraMovie } from 'react-icons/bi';
import MovieRevenueChart from '@/components/Admin/DashBoard/MovieRevenueChart';
import { LuUsers } from 'react-icons/lu';
import { Clapperboard, DollarSign } from 'lucide-react';
import { AiOutlineHome } from 'react-icons/ai';
import CinemaRecenueChart from '@/components/Admin/DashBoard/CinemaRecenueChart';

const Dashboard = () => {

    const { data: stats } = useDashboardStats();
    useEffect(() => {
        document.title = 'B&Q Cinema - Dashboard';
    }, []);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1  gap-5 md:grid-cols-3">
                <Widget
                    icon={<DollarSign className="h-7 w-7" />} title="Doanh thu tổng"
                    subtitle={formatNumberToCurrency(stats?.totalRevenue || 0).toString()}
                />
                <Widget
                    icon={<Clapperboard className="h-7 w-7" />} title="Số phim đang chiếu"
                    subtitle={stats ? stats.moviesCount.toString() : '0'}
                />
                <Widget
                    icon={<BiCameraMovie className="h-7 w-7" />} title="Suất chiếu hôm nay"
                    subtitle={stats ? stats.showTimesToday.toString() : '0'}
                />
                <Widget
                    icon={<AiOutlineHome className="h-7 w-7" />} title="Tổng số rạp"
                    subtitle={stats ? stats.totalCinemas.toString() : '0'}
                />
                <Widget
                    icon={<LuUsers className="h-7 w-7" />} title="Số lượng khách hàng"
                    subtitle={stats ? stats.totalCustomers.toString() : '0'}
                />
                <Widget
                    icon={<RiCustomerService2Line className="h-7 w-7" />} title="Số lượng nhân viên bán hàng"
                    subtitle={stats ? stats.totalEmployees.toString() : '0'}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div>
                    <MovieRevenueChart />
                </div>
                <div>
                    <CinemaRecenueChart />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;