'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from '@/context/AuthContext';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function RootAdminLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const client = new QueryClient();
    return (
        <html lang="en">
        <body>

        <QueryClientProvider client={client}>
            <AuthProvider>
                {children}
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme="light"
                    transition={Bounce}
                />
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            </AuthProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}