import React from 'react';

const Sidebar = () => {
    return (
        <div className={`hidden md:flex duration-100 fixed !z-50 min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0`}>
            <div className="mx-[56px] mt-[50px] flex items-center">
                <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
                    Cinema <span className="font-medium">Admin</span>
                </div>
            </div>
            <div className="mb-7 mt-[50px] h-px bg-gray-300 dark:bg-white/30"></div>
        </div>
    );
};

export default Sidebar;