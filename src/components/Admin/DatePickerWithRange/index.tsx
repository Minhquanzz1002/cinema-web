'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormikContext } from 'formik';
import Tooltip from '@/components/Admin/Tooltip';
import { useId } from 'react';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    fromName?: string;
    toName?: string;
    label?: string;
    required?: boolean;
    tooltip?: string;
}

export function DatePickerWithRange({
                                        fromName = 'startDate',
                                        toName = 'endDate',
                                        className,
                                        label,
                                        required = false,
                                        tooltip,
                                    }: DatePickerWithRangeProps) {
    const { setFieldValue, values } = useFormikContext<any>();

    const dateRange: DateRange | undefined = React.useMemo(() => {
        if (!values[fromName] && !values[toName]) return undefined;

        return {
            from: values[fromName] ? new Date(values[fromName]) : undefined,
            to: values[toName] ? new Date(values[toName]) : undefined,
        };
    }, [values[fromName], values[toName]]);

    const handleDateSelect = (selectedRange: DateRange | undefined) => {
        setFieldValue(fromName, selectedRange?.from || null);
        setFieldValue(toName, selectedRange?.to || null);
    };

    const id = useId();

    return (
        <div className="mb-3 sm-max:mb-0">
            {
                label && (
                    <div className="mb-1 inline-flex gap-x-1 h-6">
                        <label
                            className="font-normal text-sm cursor-pointer after:content-[':']"
                            htmlFor={id} title={label}
                        >{label}</label>
                        {required && <span className="text-red-500">*</span>}

                        {tooltip && <Tooltip text={tooltip} />}
                    </div>
                )
            }
            <div className={cn('grid gap-2', className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'justify-start text-left font-normal',
                                !dateRange && 'text-muted-foreground',
                            )}
                        >
                            <CalendarIcon />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                                        {format(dateRange.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(dateRange.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Lọc theo ngày</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={handleDateSelect}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
