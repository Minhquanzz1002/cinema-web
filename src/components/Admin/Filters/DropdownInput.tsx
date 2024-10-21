import React, { useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import useClickOutside from '@/hook/useClickOutside';

export type DropdownInputProps = {
    options: DropDownInputOption[];
    placeholder?: string;
    onChangeInputSearch: (value: string) => void;
    onChangeDropdown: (option: DropDownInputOption) => void;
};

export type DropDownInputOption = {
    value: string;
    label: string;
};


const DropdownInput = ({ options, placeholder = 'Nhập', onChangeInputSearch, onChangeDropdown }: DropdownInputProps) => {
    const [selectedOption, setSelectedOption] = useState<DropDownInputOption>(options[0]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const wrapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useClickOutside(wrapRef, () => setShowDropdown(false));

    const handleOptionClick = (option: DropDownInputOption) => {
        setSelectedOption(option);
        onChangeDropdown(option);
        setShowDropdown(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div ref={wrapRef}
             className="flex flex-row w-full items-center border rounded-md min-h-10 focus-within:border-brand-500">
            <div className="w-fit relative flex items-center gap-x-2 border-r-2 h-5 px-2 text-xs cursor-default"
                 onClick={() => setShowDropdown(!showDropdown)}>
                <div className="text-nowrap text-gray-800 font-medium">{selectedOption.label}</div>
                <IoIosArrowDown />
                {
                    showDropdown && (
                        <div
                            className={`absolute top-full bg-white shadow-xl z-10 border left-0 right-0 mt-2 rounded py-1`}>
                            {
                                options.map(option => (
                                    <div key={option.value} onClick={() => handleOptionClick(option)}
                                         className={`hover:bg-gray-200 cursor-pointer px-2 py-1.5`}>
                                        {option.label}
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
            <input placeholder={placeholder}
                   ref={inputRef}
                   value={searchValue}
                   onChange={(e) => {
                          setSearchValue(e.target.value);
                          onChangeInputSearch(e.target.value);
                   }}
                   className={`px-2 text-sm w-full`}
            />
        </div>
    );
};

export default DropdownInput;