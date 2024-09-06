"use client";
import React, {useEffect, useState} from 'react';
import {RiMoonFill, RiSunFill} from "react-icons/ri";

const FixedPlugin = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        setDarkMode(document.body.classList.contains('dark'));
    }, []);

    return (
        <button
            aria-label="Toggle dark mode"
            className="border fixed bottom-[30px] right-[35px] !z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full  border-[#6a53ff] bg-gradient-to-br from-brand-400 to-brand-600 p-0"
            onClick={() => {
                if (darkMode) {
                    document.body.classList.remove('dark');
                    setDarkMode(false);
                } else {
                    document.body.classList.add('dark');
                    setDarkMode(true);
                }
            }}
        >
            <div className="text-gray-600">
                {
                    darkMode ? <RiSunFill className="h-4 w-4 text-white"/> :
                        <RiMoonFill className="h-4 w-4 text-white"/>
                }
            </div>
        </button>
    );
};

export default FixedPlugin;