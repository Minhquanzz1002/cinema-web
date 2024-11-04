import React, { useCallback } from 'react';
import { IAdminRoute } from '@/routes/adminRoutes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';

type SidebarLinkDropdownProps = {
    route: IAdminRoute;
    open: boolean;
    onToggle: () => void;
}

const SidebarLinkDropdown = (props: SidebarLinkDropdownProps) => {
    const pathname = usePathname();
    const { name, icon, path, children } = props.route;

    const isParentActive = useCallback(() => {
        if (pathname === path) return true;
        return children?.some(child => pathname === child.path);
    }, [pathname, path, children]);

    const isChildActive = useCallback((childPath: string) => {
        return pathname === childPath;
    }, [pathname]);

    return (
        <li className="relative transition">
            <div
                onClick={props.onToggle}
                className={`relative flex cursor-pointer items-center gap-2.5 hover:bg-gray-100 rounded-sm text-gray-700 px-4 py-2 dark:text-white ${isParentActive() ? 'font-bold text-navy-700' : 'font-medium text-gray-700'}`}
            >
                <span className="font-bold">
                    {icon}
                </span>
                {name}
                <IoIosArrowDown
                    className={`absolute top-1/2 right-4 -translate-y-1/2 transition-transform duration-300 peer-checked:rotate-180`} />
            </div>

            <ul
                className={`relative pl-5 flex flex-col gap-y-1 overflow-hidden duration-300 transition-[max-height] before:w-[3px] before:bg-gray-200 before:h-full before:absolute before:transition-opacity before:duration-[400] before:top-0 before:left-[20px] font-medium text-gray-600 dark:text-white ${props.open ? 'max-h-screen before:opacity-100' : 'max-h-0 before:opacity-0'} `}>
                {
                    children?.map((r) => (
                        <li key={r.path} className="first-of-type:mt-1">
                            <Link href={r.path}
                                  className={`py-2 pl-4 hover:bg-gray-100 rounded-sm block ${isChildActive(r.path) ? 'font-bold text-navy-700' : 'font-medium text-gray-700'}`}>
                                {r.name}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </li>
    );
};

export default SidebarLinkDropdown;