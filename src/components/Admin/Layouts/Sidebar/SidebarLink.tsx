import React, {useCallback} from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";

type SidebarLinkProps = {
    name: string;
    path: string;
    icon: React.ReactNode;
}

const SidebarLink = ({name, path, icon}: SidebarLinkProps) => {
    const pathname = usePathname();

    const activeRoute = useCallback((routePath: string) => {
        return pathname === routePath;
    }, [pathname]);

    return (
        <li>
            <Link href={path}
                  className={`flex items-center gap-2.5 hover:bg-gray-100 rounded-sm ${activeRoute(path) ? 'font-bold text-navy-700' : 'font-medium text-gray-700'} px-4 py-2 dark:text-white`}>
                <span className="font-bold">
                    {icon}
                </span>
                {name}
            </Link>
        </li>
    );
};

export default SidebarLink;