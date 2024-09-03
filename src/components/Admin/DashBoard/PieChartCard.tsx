import React from 'react';
import Card from "@/components/Admin/Card";
import PieChart from "@/components/Admin/Charts/PieChart";
import {pieChartData, pieChartOptions} from "@/variables/charts";

const PieChartCard = () => {
    return (
        <Card extra="p-3">
            <div className="flex flex-row justify-between px-3 pt-2">
                <div>
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">Pie Chart</h4>
                </div>
            </div>

            <div className="mb-auto flex h-[220px] w-full items-center justify-center">
                <PieChart data={pieChartData} options={pieChartOptions}/>
            </div>
        </Card>
    );
};

export default PieChartCard;