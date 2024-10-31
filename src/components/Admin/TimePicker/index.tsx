import React, { useEffect, useId, useRef, useState } from 'react';
import Tooltip from '@/components/Admin/Tooltip';
import { ErrorMessage, useField } from 'formik';
import dayjs from 'dayjs';
import { TfiTime } from 'react-icons/tfi';
import useClickOutside from '@/hook/useClickOutside';

type TimePickerProps = {
    label: string;
    required?: boolean;
    tooltip?: string;
    name: string;
};

const TimePicker = ({ label, required, tooltip, name }: TimePickerProps) => {
    const id = useId();
    const [field, , helpers] = useField(name);
    const [inputValue, setInputValue] = useState<string>('');
    const [tempHour, setTempHour] = useState<string>('00');
    const [tempMinute, setTempMinute] = useState<string>('00');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => {
        setIsOpen(false);
        const time = dayjs(field.value).format('HH:mm');
        const [hour, minute] = time.split(':');
        setTempHour(hour);
        setTempMinute(minute);
    });

    const inputRef = useRef<HTMLDivElement>(null);
    const calendarPositionRef = useRef<'top' | 'bottom'>('bottom');

    const calculatePosition = () => {
        if (inputRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const calendarHeight = 360; // Ước tính chiều cao của calendar

            // Check xem phía dưới có đủ chỗ không
            const spaceBelow = viewportHeight - inputRect.bottom;

            if (spaceBelow < calendarHeight) {
                calendarPositionRef.current = 'top';
            } else {
                calendarPositionRef.current = 'bottom';
            }
        }
    };

    useEffect(() => {
        if (field.value) {
            const time = dayjs(field.value).format('HH:mm');
            setInputValue(time);
            const [hour, minute] = time.split(':');
            setTempHour(hour);
            setTempMinute(minute);
        }
    }, [field.value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value);
        setInputValue(value);
    };

    const handleHourSelect = (hour: string) => {
        setTempHour(hour);
    };

    const handleMinuteSelect = (minute: string) => {
        setTempMinute(minute);
    };

    const handleConfirm = async () => {
        const time = `${tempHour}:${tempMinute}`;
        setInputValue(time);
        await helpers.setValue(dayjs(`2000-01-01 ${time}`).toDate());
        setIsOpen(false);
    };

    const renderTimeOptions = () => {
        return (
            <div className="grid grid-cols-2 gap-2 max-h-56">
                <div className="border-r overflow-y-auto max-h-56 w-20">
                    {
                        Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            const isSelected = hour === tempHour;
                            return (
                                <div key={hour}
                                     className={`flex items-center justify-center h-6 cursor-pointer text-sm ${isSelected ? 'font-bold bg-gray-200' : 'hover:bg-gray-100'}`}
                                     onClick={() => handleHourSelect(hour)}
                                >
                                    {hour}
                                </div>
                            );
                        })
                    }
                </div>
                <div className="overflow-y-auto max-h-56 w-20">
                    {
                        Array.from({ length: 60 }, (_, i) => {
                            const minute = i.toString().padStart(2, '0');
                            const isSelected = minute === tempMinute;
                            return (
                                <div key={minute}
                                     className={`flex items-center justify-center h-6 cursor-pointer text-sm ${isSelected ? 'font-bold bg-gray-200' : 'hover:bg-gray-100'}`}
                                     onClick={() => handleMinuteSelect(minute)}
                                >
                                    {minute}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    };

    return (
        <div className="mb-3">
            <div className="mb-1 inline-flex gap-x-1 h-6">
                <label className="font-normal text-sm cursor-pointer after:content-[':']"
                       htmlFor={id} title={label}>{label}</label>
                {required && <span className="text-red-500">*</span>}

                {tooltip && <Tooltip text={tooltip} />}
            </div>

            <div className="relative" ref={inputRef}>
                <input name={name} id={id} type="text"
                       placeholder="HH:mm"
                       readOnly
                       value={inputValue}
                       className="border w-full rounded-md h-10 pl-3 pr-8"
                       onChange={handleInputChange}
                       onClick={() => {
                           calculatePosition();
                           setIsOpen(true);
                       }}
                />
                <button type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-3"
                        onClick={() => {
                            calculatePosition();
                            setIsOpen(true);
                        }}>
                    <TfiTime />
                </button>

                {
                    isOpen && (
                        <div ref={dropdownRef} className={`absolute z-10 bg-white left-0 border rounded shadow-lg p-2 ${calendarPositionRef.current === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                            {renderTimeOptions()}
                            <div className="flex justify-end items-center mt-3">
                                <button onClick={handleConfirm} type="button"
                                        className="px-2 py-1 bg-brand-500 text-white rounded text-xs">
                                    OK
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default TimePicker;