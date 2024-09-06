import React from 'react';

type InputFieldValidationProps = {
    id: string;
    label: string;
    extra?: string;
    placeholder: string;
    disabled?: boolean;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFieldValidation = (props: InputFieldValidationProps) => {
    const {id, label, extra, placeholder, type, disabled, onChange, value} = props;
    return (
        <div className={`${extra}`}>
            <label
                htmlFor={id}
                className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}
            >
                {label}
            </label>
            <input
                id={id}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                onChange={onChange}
                value={value}
                className={`mt-2 block w-full p-3 text-sm outline-none bg-white/0 border rounded-xl dark:text-white`}
            />
        </div>
    );
};

export default InputFieldValidation;