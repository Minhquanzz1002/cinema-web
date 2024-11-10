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
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.locale('vi');
dayjs.extend(customParseFormat);
dayjs.extend(durationPlugin);


export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="w-full h-full flex bg-background-100 dark:bg-background-900">
            <Sidebar />
            <div className="h-full w-full dark:bg-navy-900">
                <main className="flex-none transition-all dark:bg-navy-900 xl:ml-[213px]">
                    <div className="min-h-screen">
                        <Navbar />
                        <div className="mx-3 p-2 !pt-[10px] md:p-2">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>

    );
}
