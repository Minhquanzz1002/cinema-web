import React from 'react';
import { GoQuestion } from 'react-icons/go';

type TooltipProps = {
    text: string;
};

const Tooltip = ({text} : TooltipProps) => {
    return (
        <div className="flex flex-col justify-center">
            <div className="relative">
                <div
                    className="group cursor-pointer relative inline-block text-center">
                    <GoQuestion className="text-brand-500 dark:text-white" />
                    <div
                        className="opacity-0 bg-black min-w-28 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-[125%] left-1/2 transform -translate-x-1/2 px-3 pointer-events-none">
                        {text}
                        <svg className="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                             viewBox="0 0 255 255" xmlSpace="preserve">
                            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip;