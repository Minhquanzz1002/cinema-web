import { ErrorMessage, useField } from 'formik';
import React, { useId } from 'react';
import Tooltip from '@/components/Admin/Tooltip';

type InputProps = {
    name: string;
    label: string;
    placeholder?: string;
    tooltip?: string;
    autoFocus?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
    readOnly?: boolean;
    unit?: string;
};

const InputCurrency = ({ name, label, placeholder = '', tooltip, autoFocus = false, min, max, required = false, readOnly = false, unit }: InputProps) => {
    const id = useId();
    const [field, , helpers] = useField(name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const formatValue = (value: any): string => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            return '';
        }
        const numericValue = String(value).replace(/\D/g, '');
        return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue) || 0);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/\D/g, '');
        helpers.setValue(Number(rawValue));
    };

    const handleBlur = () => {
        field.onBlur(name);
    };

    return (
        <div className="mb-3">
            <div className="mb-1 inline-flex gap-x-1 h-6">
                <label className="font-normal text-sm cursor-pointer after:content-[':']"
                       htmlFor={id} title={label}>{label}</label>
                {required && <span className="text-red-500">*</span>}

                {tooltip && <Tooltip text={tooltip} />}
            </div>
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
                />

                {unit && <span className="text-gray-400 uppercase text-xs">{unit}</span>}
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default InputCurrency;