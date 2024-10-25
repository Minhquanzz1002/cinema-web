import { useField } from 'formik';
import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import useClickOutside from '@/hook/useClickOutside';
import { MdOutlineCheck } from 'react-icons/md';


type Option = {
    value: string | number;
    label: string;
}

export type SelectProps = {
    name: string;
    placeholder?: string;
    options?: Option[];
}

const Select = ({ name, options = [{label: '', value: ''}], placeholder }: SelectProps) => {
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const selectedOptionsRef = React.useRef<HTMLDivElement>(null);
    useClickOutside<HTMLDivElement>(dropdownRef, () => setIsOpen(false));
    const [field, , helpers] = useField(name);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const selectedValues = field.value ? [field.value] : [];
    const selectedOptions = options.filter(option => selectedValues.includes(option.value));

    const handleSelect = (value: string | number) => {
        helpers.setValue(value);
        setIsOpen(false);
    };


    return (
        <div className="mb-3" title={placeholder}>
            <div
                ref={dropdownRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`border rounded-md min-h-10 py-1 px-3 dark:text-white dark:bg-navy-900 w-full text-[15px] focus-within:border-brand-500 flex items-center group relative`}>
                <div ref={selectedOptionsRef}
                     className={`flex-1 flex items-center cursor-text gap-2 overflow-hidden flex-wrap`}>
                    {
                        selectedOptions.length > 0 ? (
                            selectedOptions.map(option => (
                                <div key={option.value}>
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-400">{placeholder || 'Lựa chọn'}</span>
                        )
                    }
                </div>
                <IoIosArrowDown className={` transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />

                {
                    isOpen && (
                        <div
                            className="absolute mt-1 left-0 top-full z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {
                                options.map(option => (
                                    <div key={option.value}
                                         className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm select-none flex items-center justify-between gap-x-2`}
                                         onClick={() => handleSelect(option.value)}
                                    >
                                        {option.label}
                                        {
                                            selectedValues.includes(option.value) && (
                                                <MdOutlineCheck className="text-brand-500" />
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Select;