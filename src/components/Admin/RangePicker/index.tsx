import React, { useId, useRef, useState } from 'react';
import { ErrorMessage, useField } from 'formik';
import Tooltip from '@/components/Admin/Tooltip';
import useClickOutside from '@/hook/useClickOutside';
import { FaCaretRight } from 'react-icons/fa6';
import dayjs, { Dayjs } from 'dayjs';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type RangePickerProps = {
    startName: string;
    endName: string;
    label?: string;
    maxDate?: Date;
    minDate?: Date;
    readOnly?: boolean;
    required?: boolean;
    tooltip?: string;
}

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const RangePicker = ({ startName, endName, label, required = false, tooltip, minDate, maxDate }: RangePickerProps) => {
    const id = useId();
    const [startField, , startHelpers] = useField(startName);
    const [endField, , endHelpers] = useField(endName);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);

    const calendarRef = useRef<HTMLDivElement>(null);
    useClickOutside(calendarRef, () => setIsOpen(false));

    const handleDateClick = (date: Dayjs) => {
        if (!startField.value || (startField.value && endField.value) || (startField.value && date.isBefore(startField.value))) {
            startHelpers.setValue(date.toDate());
            endHelpers.setValue(null);
        } else {
            endHelpers.setValue(date.toDate());
            setIsOpen(false);
        }
    };

    // Handle hover effect
    const handleDateHover = (date: Dayjs) => {
        if (startField.value && !endField.value) {
            setHoverDate(date);
        }
    };

    const isInRange = (date: Dayjs) => {
        if (!startField.value) return false;
        const endDate = endField.value || hoverDate;
        if (!endDate) return false;

        return date.isAfter(dayjs(startField.value), 'day') && date.isBefore(endDate, 'day');
    };

    const isDateDisabled = (date: Dayjs) => {
        if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
        return false;
    };

    const renderCalendar = () => {
        const daysInMonth = currentDate.daysInMonth();
        const firstDay = currentDate.startOf('month').day();
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
        }

        // Calendar days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = currentDate.date(i);
            const isStart = startField.value && date.isSame(dayjs(startField.value), 'day');
            const isEnd = endField.value && date.isSame(dayjs(endField.value), 'day');
            const isInRangeDay = isInRange(date);
            const isDisabled = isDateDisabled(date);

            days.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => !isDisabled && handleDateClick(date)}
                    onMouseEnter={() => handleDateHover(date)}
                    disabled={isDisabled}
                    className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-sm
                        ${isStart ? 'bg-blue-500 text-white' : ''}
                        ${isEnd ? 'bg-blue-500 text-white' : ''}
                        ${isInRangeDay ? 'bg-blue-100' : ''}
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'}
                    `}
                >
                    {i}
                </button>
            );
        }

        return days;
    };

    return (
        <div className="mb-3">
            {
                label && (
                    <div className="mb-1 inline-flex gap-x-1 h-6">
                        <label className="font-normal text-sm cursor-pointer after:content-[':']"
                               htmlFor={id} title={label}>{label}</label>
                        {required && <span className="text-red-500">*</span>}

                        {tooltip && <Tooltip text={tooltip} />}
                    </div>
                )
            }

            <div className="relative">
                <div
                    onClick={() => setIsOpen(true)}
                    className="border rounded-md h-10 px-3 dark:text-white dark:bg-navy-900 text-[16px] focus-within:border-brand-500 flex items-center gap-x-2">
                    <div className="text-sm flex-1">
                        {startField.value ? dayjs(startField.value).format('DD/MM/YYYY') : 'Từ ngày'}
                    </div>
                    <FaCaretRight className="text-gray-600" />
                    <div className="text-sm flex-1">
                        {endField.value ? dayjs(endField.value).format('DD/MM/YYYY') : 'Đến ngày'}
                    </div>
                </div>

                {isOpen && (
                    <div ref={calendarRef}
                         className="absolute z-50 mt-1 p-4 bg-white rounded-lg shadow-lg border">
                        <div className="flex items-center justify-between mb-4">
                            <span>{currentDate.format('MMMM YYYY')}</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setCurrentDate(curr => curr.subtract(1, 'month'))}>
                                    <IoIosArrowBack />
                                </button>
                                <button type="button" onClick={() => setCurrentDate(curr => curr.add(1, 'month'))}>
                                    <IoIosArrowForward />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {DAYS.map(day => (
                                <div key={day} className="w-8 h-8 flex items-center justify-center text-sm font-medium">
                                    {day}
                                </div>
                            ))}
                            {renderCalendar()}
                        </div>
                    </div>
                )}
            </div>


            <ErrorMessage name={startName} component="div" className="text-red-500 text-xs mt-1" />
            <ErrorMessage name={endName} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default RangePicker;