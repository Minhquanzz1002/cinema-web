'use client';
import React from 'react';
import '@/styles/global.admin.css';
import Sidebar from '@/components/Admin/Layouts/Sidebar';
import Navbar from '@/components/Admin/Layouts/Navbar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.locale('vi');
dayjs.extend(customParseFormat);

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="w-full h-full flex bg-background-100 dark:bg-background-900">
            <Sidebar />
            <div className="h-full w-full dark:bg-navy-900">
                <main className="mx-2.5 flex-none transition-all dark:bg-navy-900 md:pr-2 xl:ml-[323px]">
                    <div>
                        <Navbar />
                        <div className="mx-auto min-h-screen p-2 !pt-[10px] md:p-2">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>

    );
}
