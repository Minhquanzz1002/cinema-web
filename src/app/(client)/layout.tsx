import type {Metadata} from "next";
import React from "react";
import "@/styles/global.css";
import Header from "@/components/Layouts/Header";
import Footer from "@/components/Layouts/Footer";

export const metadata: Metadata = {
    title: "Galaxy Cinema",
    description: "Galaxy Cinema",
};

export default function DefaultLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <Header/>
        {children}
        <Footer/>
        </body>
        </html>
    );
}
