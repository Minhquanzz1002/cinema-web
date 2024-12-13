import React, { useEffect, useState } from 'react';
import routes from '@/routes/adminRoutes';
import SidebarLink from '@/components/Admin/Layouts/Sidebar/SidebarLink';
import SidebarLinkDropdown from '@/components/Admin/Layouts/Sidebar/SidebarLinkDropdown';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleToggle = (path: string) => {
        setOpenDropdown(openDropdown === path ? null : path);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`
                    md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onClose}
            />

            {/* Sliding Panel */}
            <aside
                className={`
                    md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-navy-800 
                    transform transition-transform duration-300 ease-in-out z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="no-scrollbar h-svh max-h-svh overflow-y-auto duration-300 ease-linear">
                    <nav className="p-3 ">
                        <div className="text-sm font-semibold ml-4 mb-3 text-brand-500 dark:text-white">MENU</div>
                        <ul className="flex flex-col gap-y-2">
                            {
                                routes.map((route) => {
                                    if (route.children) {
                                        return (
                                            <SidebarLinkDropdown
                                                route={route} key={route.path}
                                                open={openDropdown === route.path}
                                                onToggle={() => handleToggle(route.path)}
                                            />
                                        );
                                    } else {
                                        return (
                                            <SidebarLink
                                                key={route.path} name={route.name} path={route.path}
                                                icon={route.icon}
                                            />
                                        );
                                    }
                                })
                            }
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default MobileMenu;