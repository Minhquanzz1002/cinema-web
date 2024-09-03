import React from 'react';
import Card from "@/components/Admin/Card";
import {MdBarChart} from "react-icons/md";
import BarChart from "@/components/Admin/Charts/BarChart";
import {barChartDataWeeklyRevenue, barChartOptionsWeeklyRevenue} from "@/variables/charts";

const WeeklyRevenue = () => {
    return (
        <Card extra="w-full py-6 px-2 text-center">
            <div className="mb-auto flex items-center justify-between px-6">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                    Doanh thu  hằng tuần
                </h2>
                <button className="z-[1] flex  items-center justify-center rounded-lg bg-light-primary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200  dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
                    <MdBarChart className="h-6 w-6"/>
                </button>
            </div>

            <div className="md:mt-16 lg:mt-0">
                <div className="h-[250px] w-full xl:h-[350px]">
                    <BarChart data={barChartDataWeeklyRevenue} options={barChartOptionsWeeklyRevenue}/>
                </div>
            </div>
        </Card>
    );
};

export default WeeklyRevenue;