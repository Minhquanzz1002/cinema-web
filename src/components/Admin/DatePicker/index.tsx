import React, { useEffect, useId, useRef, useState } from 'react';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import Tooltip from '@/components/Admin/Tooltip';
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowDropdown } from 'react-icons/io';
import dayjs, { Dayjs } from 'dayjs';
import useClickOutside from '@/hook/useClickOutside';
import { LuCalendarDays } from 'react-icons/lu';
import { InputMask } from '@react-input/mask';

type DatePickerProps = {
    name: string;
    label?: string;
    required?: boolean;
    tooltip?: string;
    format?: 'YYYY-MM-DD';
    minDate?: Date;
    maxDate?: Date;
    readOnly?: boolean;
};

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const START_YEAR = 1900;
const END_YEAR = 2100;

const DatePicker = ({
                        name,
                        label,
                        required = false,
                        tooltip,
                        format = 'YYYY-MM-DD',
                        minDate,
                        maxDate,
                        readOnly = false,
                    }: DatePickerProps) => {
    const id = useId();
    const [field, , helpers] = useField(name);
    const { setFieldError, setFieldTouched, setErrors } = useFormikContext();
    const calendarRef = useRef<HTMLDivElement>(null);
    useClickOutside(calendarRef, () => setIsOpen(false));
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [inputValue, setInputValue] = useState<string>(field.value ? dayjs(field.value, format).format('DD/MM/YYYY') : '');
    const [showYearList, setShowYearList] = useState<boolean>(false);
    const yearListRef = useRef<HTMLDivElement>(null);
    useClickOutside(yearListRef, () => setShowYearList(false));

    useEffect(() => {
        if (field.value instanceof Date && !isNaN(field.value.getTime())) {
            const date = dayjs(field.value);
            setInputValue(date.format('DD/MM/YYYY'));
            setCurrentDate(date);
        } else {
            setInputValue('');
            helpers.setValue(null);
        }
    }, [field.value, helpers]);

    useEffect(() => {
        console.log('inputValue:', inputValue);
    }, [inputValue]);

    const handleDateClick = (day: number) => {
        const selectedDate = currentDate.date(day).toDate();
        helpers.setValue(selectedDate);
        setInputValue(dayjs(selectedDate).format('DD/MM/YYYY'));
        setIsOpen(false);
    };

    const isDateInRange = (date: Dayjs) => {
        if (minDate && date.isBefore(dayjs(minDate), 'day')) return false;
        if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return false;
        return true;
    };

    const renderCalendar = () => {
        const daysInMonth = currentDate.daysInMonth();
        const firstDay = currentDate.startOf('month').day();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = currentDate.date(i);
            const isToday = dayDate.isSame(dayjs(), 'day');
            const isSelected = field.value instanceof Date && dayDate.isSame(dayjs(field.value), 'day');
            const isDisabled = !isDateInRange(dayDate);

            days.push(
                <button
                    key={i}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDateClick(i)}
                    className={`w-8 h-8 hover:bg-gray-200 flex justify-center items-center rounded-full text-sm font-nunito ${isToday ? 'bg-blue-100' : ''} ${isSelected ? 'bg-blue-500 text-white' : ''} ${isDisabled ? 'text-gray-300 cursor-not-allowed line-through' : ''}`}
                >
                    {i}
                </button>,
            );
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    const isValidDate = (dateString: string): boolean => {
        if (!dayjs(dateString, 'DD/MM/YYYY', true).isValid()) {
            return false;
        }

        const parsed = dayjs(dateString, 'DD/MM/YYYY');
        return parsed.format('DD/MM/YYYY') === dateString;
    };


    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        setFieldTouched(name, true, false);

        helpers.setValue(value);
        if (value.length === 10) {
            if (isValidDate(value)) {
                const parsedDate = dayjs(value, 'DD/MM/YYYY').toDate();
                helpers.setValue(parsedDate);
                setCurrentDate(dayjs(parsedDate));
                setFieldError(name, undefined);
            } else {
                setErrors({ [name]: 'Ngày không hợp lệ' });
                helpers.setValue(null);
            }
        } else {
            helpers.setValue(null);
            setFieldError(name, undefined);
        }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        field.onBlur(e);
        if (inputValue.length > 0 && inputValue.length < 10) {
            setFieldError(name, 'Ngày không hợp lệ');
        }
    };

    const toggleYearList = () => {
        setShowYearList(prev => !prev);
    };

    const handleYearSelect = (year: number) => {
        setCurrentDate(prev => prev.clone().year(year));
        setShowYearList(false);
    };

    const renderYearList = () => {
        const years = Array.from(
            { length: END_YEAR - START_YEAR + 1 },
            (_, i) => START_YEAR + i,
        );

        return (
            <div
                ref={yearListRef}
                className="absolute z-20 top-10 left-0 right-0 bg-white rounded p-2 max-h-60 overflow-y-auto grid grid-cols-4 gap-2"
            >
                {years.map(year => (
                    <div
                        key={year}
                        data-year={year}
                        className={`py-1 px-2 cursor-pointer hover:bg-gray-100 rounded ${year === currentDate.year() ? 'bg-blue-100' : ''}`}
                        onClick={() => handleYearSelect(year)}
                    >
                        {year}
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        if (showYearList && yearListRef.current) {
            const selectedYearElement = yearListRef.current.querySelector(`[data-year="${currentDate.year()}"]`);
            if (selectedYearElement) {
                selectedYearElement.scrollIntoView({ block: 'center', behavior: 'auto' });
            }
        }
    }, [showYearList, currentDate]);

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
            <div
                className={`relative border rounded-md h-10 px-3 dark:text-white dark:bg-navy-900 text-[16px] focus-within:border-brand-500 flex items-center`}>
                <InputMask mask="DD/MM/YYYY"
                           replacement={{ D: /[0-9]/, M: /[0-9]/, Y: /[0-9]/ }}
                           placeholder="DD/MM/YYYY"
                           separate
                           className="flex-1"
                           onChange={handleInputChange}
                           value={inputValue}
                           onBlur={handleInputBlur}
                           name={field.name}
                           readOnly={readOnly}
                />
                <button type="button" className="flex items-center justify-between" onClick={() => !readOnly && setIsOpen(!isOpen)}>
                    <LuCalendarDays />
                </button>
                {
                    isOpen && (
                        <div ref={calendarRef}
                             className="absolute z-20 top-full left-0 mt-1 bg-white border rounded shadow-lg p-4">
                            <div className="flex justify-between items-center gap-x-20 relative">
                                <div className="flex items-center gap-x-2">
                                    <span className="text-nowrap min-w-[85px]">{currentDate.format('MMM YYYY')}</span>
                                    <button type="button" onClick={toggleYearList}><IoMdArrowDropdown /></button>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <button type="button" onClick={handlePrevMonth}><IoIosArrowBack /></button>
                                    <button type="button" onClick={handleNextMonth}><IoIosArrowForward /></button>
                                </div>
                                {showYearList && renderYearList()}
                            </div>
                            <div className="grid grid-cols-7 gap-2 mt-4">
                                {DAYS.map((day) => (
                                    <div key={day} className="w-8 h-8 flex justify-center items-center text-sm font-nunito">
                                        {day}
                                    </div>
                                ))}
                                {renderCalendar()}
                            </div>
                        </div>
                    )
                }
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default DatePicker;