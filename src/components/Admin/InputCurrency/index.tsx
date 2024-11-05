import { ErrorMessage, useField } from 'formik';
import React, { useId } from 'react';
import Tooltip from '@/components/Admin/Tooltip';

type InputProps = {
    name: string;
    label?: string;
    placeholder?: string;
    tooltip?: string;
    autoFocus?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
    readOnly?: boolean;
    unit?: string;
    wrapperClassName?: string;
};

const InputCurrency = ({
                           name,
                           label,
                           wrapperClassName,
                           placeholder = '',
                           tooltip,
                           autoFocus = false,
                           min,
                           max,
                           required = false,
                           readOnly = false,
                           unit,
                       }: InputProps) => {
    const id = useId();
    const [field, , helpers] = useField(name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const formatValue = (value: any): string => {
        if (value === '' || value === null || value === undefined) {
            return '';
        }
        if (typeof value !== 'string' && typeof value !== 'number') {
            return '';
        }
        const numericValue = String(value).replace(/\D/g, '');
        return numericValue ? new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : '';
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/\D/g, '');
        await helpers.setValue(rawValue === '' ? '' : Number(rawValue));
    };

    const handleBlur = () => {
        field.onBlur(name);
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        const currentValue = Number(field.value) || 0;

        switch(event.key) {
            case 'ArrowUp':
                event.preventDefault();
                const increasedValue = currentValue + 1000;
                if (max && increasedValue > max) {
                    await helpers.setValue(max);
                } else {
                    await helpers.setValue(increasedValue);
                }
                break;

            case 'ArrowDown':
                event.preventDefault();
                const decreasedValue = currentValue - 1000;
                if (decreasedValue < (min || 0)) {
                    await helpers.setValue(min || 0);
                } else {
                    await helpers.setValue(decreasedValue);
                }
                break;
        }
    };

    return (
        <div className={wrapperClassName ? 'mb-3' : wrapperClassName}>
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
                onClick={handleContainerClick}
                className={`border rounded-md h-10 px-3 dark:text-white dark:bg-navy-900 w-full text-[16px] focus-within:border-brand-500 flex items-center group`}>
                <input ref={inputRef}
                       id={id}
                       placeholder={placeholder}
                       className={`flex-1`}
                       type="text"
                       autoFocus={autoFocus}
                       min={min}
                       max={max}
                       readOnly={readOnly}
                       value={formatValue(field.value)}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       onKeyDown={handleKeyDown}
                />

                {unit && <span className="text-gray-400 uppercase text-xs">{unit}</span>}
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default InputCurrency;