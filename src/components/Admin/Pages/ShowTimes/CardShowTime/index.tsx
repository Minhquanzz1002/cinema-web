import React from 'react';
import { AdminShowTime } from '@/modules/showTimes/interface';
import { formatDateToLocalDate, formatTime } from '@/utils/formatDate';
import { BaseStatus } from '@/modules/base/interface';
import ButtonAction from '@/components/Admin/ButtonAction';

type CardShowTimeProps = {
    showTime: AdminShowTime;
}

const CardShowTime = ({ showTime } : CardShowTimeProps) => {
    return (
        <div className="relative group border rounded-md flex flex-col p-3 gap-2 overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="text-sm bg-brand-500 text-white rounded-full px-3 py-1">
                    {showTime.room.name}
                </div>
                <div className="text-xs">
                    {formatDateToLocalDate(showTime.startDate)}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div>
                    {showTime.status === BaseStatus.ACTIVE && <div className="p-1 bg-green-500 rounded-full"/>}
                    {showTime.status === BaseStatus.INACTIVE && <div className="p-1 bg-red-500 rounded-full"/>}
                </div>
                <div className="text-sm">{`${formatTime(showTime.startTime)} - ${formatTime(showTime.endTime)}`}</div>
            </div>

            <div className="absolute inset-0 opacity-0 bg-gray-100/50 group-hover:opacity-100 flex justify-center items-center">
                <div className="flex gap-2">
                    <ButtonAction.Update/>
                    <ButtonAction.Delete/>
                </div>
            </div>
        </div>
    );
};

export default CardShowTime;