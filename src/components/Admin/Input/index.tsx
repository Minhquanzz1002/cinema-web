import { ErrorMessage, useField } from 'formik';
import React, { useId } from 'react';
import Tooltip from '@/components/Admin/Tooltip';

type InputProps = {
    name: string;
    label?: string;
    placeholder?: string;
    tooltip?: string;
    unit?: string;
    autoFocus?: boolean;
    type?: 'text' | 'number' | 'email' | 'password' | 'date';
    min?: number;
    max?: number;
    required?: boolean;
    readOnly?: boolean;
};

const Input = ({ name, label, placeholder = '', tooltip, type = 'text', unit, autoFocus = false, min, max, required = false, readOnly = false }: InputProps) => {
    const id = useId();
    const [field] = useField(name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        inputRef.current?.focus();
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
            <div
                onClick={handleContainerClick}
                className={`border rounded-md h-10 px-3 dark:text-white dark:bg-navy-900 w-full text-[16px] focus-within:border-brand-500 flex items-center group`}>
                <input ref={inputRef}
                       id={id}
                       placeholder={placeholder}
                       className={`flex-1`}
                       type={type}
                       autoFocus={autoFocus}
                       min={min}
                       max={max}
                       readOnly={readOnly}
                       {...field}
                />

                {unit && <span className="text-gray-400 uppercase text-xs">{unit}</span>}
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default Input;