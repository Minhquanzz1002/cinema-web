import React, { useEffect, useState } from 'react';
import Link from '@/components/Link';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { FiAlignJustify, FiSearch } from 'react-icons/fi';
import Dropdown from '@/components/Admin/Layouts/Navbar/Dropdown';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsArrowBarUp } from 'react-icons/bs';
import Breadcrumb from '@/components/Admin/Breadcrumb';
import { useAuth } from '@/hook/useAuth';

function Navbar() {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        setDarkMode(document.body.classList.contains('dark'));
    }, []);

    return (
        <nav
            className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
            <Breadcrumb />

            <div
                className="relative mt-[3px] flex h-[61px] w-[355px] md:w-[365px] xl:w-[365px] flex-grow md:flex-grow-0 items-center justify-around gap-2 md:gap-1 xl:gap-2 rounded-full bg-white dark:!bg-navy-800 p-2 shadow-xl shadow-[rgba(112, 144, 176, 0.08)] dark:shadow-none">
                <div
                    className="flex h-full items-center rounded-full text-navy-700 bg-light-primary dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3  pr-2 text-xl">
                        <FiSearch className="w-4 h-4 text-gray-400 dark:text-white" />
                    </p>
                    <input type="text" placeholder="Tìm kiếm..."
                           className="block h-full w-full rounded-full bg-light-primary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit" />
                </div>

                <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white md:hidden">
                    <FiAlignJustify className="h-5 w-5" />
                </span>

                <Dropdown
                    className="py-2 top-4 -left-[230px] md:-left-[440px] w-max"
                    button={
                        <p className="cursor-pointer">
                            <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
                        </p>
                    }>
                    <div
                        className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-bold text-navy-700 dark:text-white">
                                Thông báo
                            </p>
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                                Đọc tất cả
                            </p>
                        </div>

                        <button className="flex w-full items-center">
                            <div
                                className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brand-linear to-brand-500 py-4 text-2xl text-white">
                                <BsArrowBarUp />
                            </div>
                            <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                                    New: Cập nhật chính sách
                                </p>
                                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                                    Hãy đọc tính năng mới đi
                                </p>
                            </div>
                        </button>
                    </div>
                </Dropdown>

                <div className="cursor-pointer text-gray-600"
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
                    {darkMode ? (
                        <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
                    ) : <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />}
                </div>

                <Dropdown
                    className="py-2 top-full -left-[180px] w-max"
                    button={
                        <Image width={2} height={20} className="h-10 w-10 rounded-full" src={avatar} alt="Avt" />
                    }
                >
                    <div
                        className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl dark:!bg-navy-700 dark:text-white dark:shadow-none">
                        <div className="ml-4 mt-3">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-navy-700 dark:text-white">Hey, {user?.name || "Không rõ"}</p>
                            </div>
                        </div>

                        <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20" />

                        <div className="ml-4 mt-3 flex flex-col gap-y-3 mb-3">
                            <Link href="#" className="text-sm text-gray-800 dark:text-white">Thông tin cá nhân</Link>
                            <Link href="#" className="text-sm text-gray-800 dark:text-white">Cài đặt</Link>
                            <button className="text-sm font-medium text-red-500 text-start dark:text-white" onClick={logout}>Đăng xuất</button>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
}

export default Navbar;