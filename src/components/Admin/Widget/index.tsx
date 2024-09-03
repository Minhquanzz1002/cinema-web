import React from 'react';
import Card from "@/components/Admin/Card";

type WidgetProps = {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const Widget = (props: WidgetProps) => {
    return (
        <Card extra="!flex-row items-center">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                <div className="rounded-full bg-light-primary p-3 dark:bg-navy-700">
                    <span className="flex items-center text-brand-500 dark:text-white">
                        {props.icon}
                    </span>
                </div>
            </div>

            <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-gray-600">{props.title}</p>
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {props.subtitle}
                </h4>
            </div>
        </Card>
)
    ;
};

export default Widget;