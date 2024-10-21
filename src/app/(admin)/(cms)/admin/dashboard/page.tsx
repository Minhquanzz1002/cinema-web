"use client";
import React, { useEffect } from 'react';
import Widget from '@/components/Admin/Widget';
import { MdBarChart } from 'react-icons/md';
import MiniCalendar from '@/components/Admin/Calendar/MiniCalendar';
import WeeklyRevenue from '@/components/Admin/DashBoard/WeeklyRevenue';
import PieChartCard from '@/components/Admin/DashBoard/PieChartCard';

const Dashboard = () => {
    useEffect(() => {
        document.title = 'B&Q Cinema - Dashboard';
    }, []);

    return (
        <div>
            <div className="mt-3 grid grid-cols-1  gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Thu nhập" subtitle="$340.5"/>
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Số phim" subtitle="$340.5"/>
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Suất chiếu" subtitle="$340.5"/>
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Số rạp" subtitle="$340.5"/>
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Thu nhập" subtitle="$340.5"/>
                <Widget icon={<MdBarChart className="h-7 w-7" />} title="Thu nhập" subtitle="$340.5"/>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <WeeklyRevenue/>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <PieChartCard/>
                    <MiniCalendar/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;