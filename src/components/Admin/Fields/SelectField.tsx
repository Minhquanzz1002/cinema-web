import React, {useState} from 'react';
import {TiArrowSortedDown} from "react-icons/ti";
import {LuSearch} from "react-icons/lu";

type SelectFieldProps<T> = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    extra?: string;
    extraLabel?: string;
    suffix?: React.ReactNode;
    dataSource: T[];
    renderItem: (item: T) => React.ReactNode;
}

const SelectField = <T,>(props: SelectFieldProps<T>) => {
    const {label, extra, extraLabel, id, suffix, dataSource, renderItem, value,...rest} = props;

    const [showSelect, setShowSelect] = useState<boolean>(false);

    return (
        <div className={`flex items-center gap-x-2 mb-4 ${extra}`}>
            <label className={`text-sm w-32 font-semibold flex-shrink-0 ${extraLabel}`} htmlFor={id}>{label}</label>
            <div className="flex items-center gap-x-2 border-b-2 focus-within:border-red-500 text-sm flex-1 h-7">
                <div className="flex items-center justify-between relative flex-1 pe-2 cursor-pointer" onClick={() => setShowSelect(!showSelect)}>
                    <span>{value}</span>
                    <TiArrowSortedDown />

                    {
                        showSelect && (
                            <div className="absolute rounded shadow-xl top-[130%] left-0 w-full py-4 bg-white cursor-default" onClick={(e) => e.stopPropagation()}>
                                <div className="py-1 border-b-2 flex flex-nowrap items-center focus-within:border-brand-500 mx-4">
                                    <input type="search" className="w-full flex-1"/>
                                    <LuSearch className="text-gray-600"/>
                                </div>

                                <div className="h-56 max-h-56 overflow-x-hidden overflow-y-auto flex flex-col mt-3 scrollbar-thin">
                                    <div className="cursor-pointer py-2 px-4">--- Lựa chọn ---</div>
                                    {
                                        dataSource.map((item, index) => (
                                            <div key={"filter-" + index}>
                                                {
                                                    renderItem(item)
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                {suffix}
            </div>
        </div>
    );
};

export default SelectField;