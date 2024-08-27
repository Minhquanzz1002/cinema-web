import React, {useEffect, useState} from 'react';
import Link from "@/components/Link";
import {RiMoonFill, RiSunFill} from "react-icons/ri";
import {FiSearch} from "react-icons/fi";
import Dropdown from "@/components/Admin/Layouts/Navbar/Dropdown";
import Image from "next/image";
import avatar from "/public/img/avatar/avt.png";

interface INavBarProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar() {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        setDarkMode(document.body.classList.contains('dark'));
    }, []);

    return (
        <nav
            className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
            {/* Start: Breadcrumb */}
            <div className="ml-[6px]">
                <div className="h-6 w-[224px] pt-1">
                    <a className="text-sm font-normal text-navy-700 dark:text-white hover:underline" href={"#"}>
                        Pages
                        <span className="mx-1">{' '}/{' '}</span>
                    </a>
                    <Link href={"#"}
                          className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white">
                        Trang chủ
                    </Link>
                </div>
                <p className="shrink text-[33px] capitalize font-bold text-navy-700 dark:text-white">
                    <Link href={"#"}>
                        Trang chủ
                    </Link>
                </p>
            </div>
            {/* End: Breadcrumb */}

            <div
                className="relative mt-[3px] flex h-[61px] w-[355px] md:w-[365px] xl:w-[365px] flex-grow md:flex-grow-0 items-center justify-around gap-2 md:gap-1 xl:gap-2 rounded-full bg-white dark:!bg-navy-800 p-2 shadow-xl shadow-[rgba(112, 144, 176, 0.08)] dark:shadow-none">
                <div
                    className="flex h-full items-center rounded-full text-navy-700 bg-light-primary dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3  pr-2 text-xl">
                        <FiSearch className="w-4 h-4 text-gray-400 dark:text-white"/>
                    </p>
                    <input type="text" placeholder="Tìm kiếm..."
                           className="block h-full w-full rounded-full bg-light-primary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"/>
                </div>

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
                        <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white"/>
                    ) : <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white"/>}
                </div>

                <Dropdown
                    className="py-2 top-full -left-[180px] w-max"
                    button={
                        <Image width={2} height={20}  className="h-10 w-10 rounded-full" src={avatar}  alt="Avt"/>
                    }
                >
                    <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl dark:!bg-navy-700 dark:text-white dark:shadow-none">
                        <div className="ml-4 mt-3">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-navy-700 dark:text-white">Hey, Minh Quân</p>
                            </div>
                        </div>

                        <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20"/>

                        <div className="ml-4 mt-3 flex flex-col gap-y-3 mb-3">
                            <Link href="#" className="text-sm text-gray-800 dark:text-white">Thông tin cá nhân</Link>
                            <Link href="#" className="text-sm text-gray-800 dark:text-white">Cài đặt</Link>
                            <Link href="#" className="text-sm font-medium text-red-500 dark:text-white">Đăng xuất</Link>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
}

export default Navbar;