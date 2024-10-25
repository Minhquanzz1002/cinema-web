import { useField } from 'formik';
import React from 'react';

type InputProps = {
    name: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'date';
    min?: number;
    max?: number;
};

const Input = ({ name, placeholder = '', type = 'text', min, max }: InputProps) => {
    const [field] = useField(name);

    return (
        <div className="mb-3" title={placeholder}>
            <input placeholder={placeholder}
                   className={`border rounded-md h-10 px-3 dark:text-white dark:bg-navy-900 w-full text-[15px] focus:border-brand-500 flex items-center`}
                   type={type}
                   min={min}
                   max={max}
                   {...field}
            />
        </div>
    );
};

export default Input;