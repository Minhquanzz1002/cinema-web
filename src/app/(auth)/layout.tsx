import type {Metadata} from "next";
import React from "react";
import "@/styles/global.admin.css";
import FixedPlugin from "@/components/Admin/FixedPlugin";

export const metadata: Metadata = {
    title: "Galaxy Cinema | Đăng nhập",
    description: "Galaxy Cinema",
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <div className="relative float-right h-screen min-h-screen w-full dark:!bg-navy-900">
            <div className="mx-auto h-full min-h-screen">
                <FixedPlugin/>
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}
