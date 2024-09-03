"use client";
import React from 'react';
import dynamic from "next/dynamic";
import {ApexOptions} from "apexcharts";

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

type BarChartProps = {
    data: ApexAxisChartSeries | ApexNonAxisChartSeries;
    options: ApexOptions;
}

const BarChart = ({data, options}: BarChartProps) => {
    return (
        <Chart
            type="bar"
            height="100%"
            width="100%"
            series={data}
            options={options}
        />
    );
};

export default BarChart;