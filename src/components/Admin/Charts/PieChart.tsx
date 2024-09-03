"use client"
import React from 'react';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

type PieChartProps = {
    data: ApexAxisChartSeries | ApexNonAxisChartSeries;
    options: any;
}

const PieChart = ({data, options} : PieChartProps) => {
    return (
        <Chart
            type="pie"
            height="100%"
            width="100%"
            series={data}
            options={options}
        />
    );
};

export default PieChart;