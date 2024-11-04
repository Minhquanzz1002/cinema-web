'use client';
import React from 'react';
import SaleProvider from '@/context/SaleContext';

export default function SaleLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SaleProvider>
            {children}
        </SaleProvider>
    );
}
