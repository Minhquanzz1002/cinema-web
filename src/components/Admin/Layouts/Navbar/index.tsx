import React, { useEffect, useState } from 'react';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import Breadcrumb from '@/components/Admin/Breadcrumb';
import { useAuth } from '@/hook/useAuth';
import Dropdown from '@/components/Admin/Layouts/Navbar/Dropdown';
import Image from 'next/image';
import Link from '@/components/Link';
import { AVATAR_DEFAULT_IMAGE } from '@/variables/images';

function Navbar() {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        setDarkMode(document.body.classList.contains('dark'));
    }, []);

    return (
        <nav
            className="sticky top-0 z-40 h-10 border-b flex flex-row flex-wrap items-center justify-between bg-white/50 py-1 px-3 backdrop-blur-xl dark:bg-[#0b14374d]">
            <Breadcrumb />

            <div className="flex gap-3 items-center">
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
                            <div className="relative h-7 w-7 rounded-full border overflow-hidden">
                                <Image className="object-cover object-center" src={user?.avatar || AVATAR_DEFAULT_IMAGE} alt="Avt" fill />
                            </div>
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