import Tooltip from '@/components/Admin/Tooltip';
import { ErrorMessage, useField } from 'formik';
import React, { useId, useState } from 'react';
import { IoIosArrowDown, IoMdCloseCircle } from 'react-icons/io';
import useClickOutside from '@/hook/useClickOutside';
import { MdOutlineCheck } from 'react-icons/md';


type Option = {
    value: string | number;
    label: string;
}

export type SelectProps = {
    name: string;
    label?: string;
    tooltip?: string;
    placeholder?: string;
    multiple?: boolean;
    options: Option[];
    readOnly?: boolean;
}

const Select = ({ name, label, tooltip, multiple, options, placeholder, readOnly = false }: SelectProps) => {
    const id = useId();
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const selectedOptionsRef = React.useRef<HTMLDivElement>(null);
    useClickOutside<HTMLDivElement>(dropdownRef, () => setIsOpen(false));
    const [field, , helpers] = useField(name);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const selectedValues = multiple ? (Array.isArray(field.value) ? field.value : []) : (field.value ? [field.value] : []);
    const selectedOptions = options.filter(option => selectedValues.includes(option.value));

    const handleSelect = (value: string | number) => {
        if (readOnly) return;
        if (multiple) {
            const newValues = selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value];
            helpers.setValue(newValues);
            setIsOpen(false);
            setIsHovering(false);
        } else {
            helpers.setValue(value);
            setIsOpen(false);
        }
    };

    const handleRemove = (value: string | number) => {
        if (readOnly) return;
        if (multiple) {
            helpers.setValue(selectedValues.filter(v => v !== value));
        }
    };

    const handleClearAll = (e: React.MouseEvent) => {
        if (readOnly) return;
        e.stopPropagation();
        helpers.setValue([]);
    };

    return (
        <div className="mb-3">
            {
                label && (
                    <div className="mb-1 inline-flex gap-x-1 h-6">
                        <label className="font-normal text-sm cursor-pointer after:content-[':']"
                               onClick={() => setIsOpen(!isOpen)}
                               htmlFor={id} title={label}>{label}</label>
                        <span className="text-red-500">*</span>

                        {tooltip && <Tooltip text={tooltip} />}
                    </div>
                )
            }
            <div
                ref={dropdownRef}
                onClick={() => !readOnly && setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`border rounded-md min-h-10 py-1 px-3 dark:text-white dark:bg-navy-900 w-full text-[16px] focus-within:border-brand-500 flex items-center group relative ${readOnly ? 'cursor-not-allowed' : ''}`}>
                <div ref={selectedOptionsRef} className={`flex-1 flex items-center ${readOnly ? 'cursor-not-allowed' : 'cursor-text'} gap-2 overflow-hidden flex-wrap`}>
                    {
                        selectedOptions.length > 0 ? (
                                selectedOptions.map(option => (
                                    multiple ? (
                                        <div key={option.value}
                                             className="flex items-center gap-x-1 border rounded px-1 py-1 bg-brand-50">
                                            <span className="text-nowrap text-xs cursor-default">{option.label}</span>
                                            {
                                                !readOnly && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemove(option.value);
                                                        }}
                                                        className="text-[10px] text-gray-400 hover:text-gray-900"
                                                    >
                                                        x
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div key={option.value} className="text-nowrap">
                                            {option.label}
                                        </div>
                                    )
                                ))
                        ) : (
                            <span className="text-gray-400">{placeholder || 'Lựa chọn'}</span>
                        )
                    }
                </div>
                {
                    !readOnly && multiple && selectedValues.length > 0 && isHovering ? (
                        <button onClick={handleClearAll} type="button" className="text-gray-400 hover:text-gray-900"
                        >
                            <IoMdCloseCircle />
                        </button>
                    ) : (
                        <IoIosArrowDown className={` transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                    )
                }

                {
                    !readOnly && isOpen && (
                        <div
                            className="absolute mt-1 left-0 top-full z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {
                                options.map(option => (
                                    <div key={option.value}
                                         className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm select-none flex items-center justify-between gap-x-2 text-nowrap`}
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

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default Select;