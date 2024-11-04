import React from 'react';
import Link from '@/components/Link';
import { usePathname } from 'next/navigation';
import { breadcrumbs } from '@/routes/breadcrumbs';
import { MdNavigateNext } from 'react-icons/md';

const Breadcrumb = () => {
    const pathname = usePathname();

    const isMath = (pattern: string): boolean => {
        const regex = new RegExp(pattern);
        return regex.test(pathname);
    };

    const replacePathParams = (link: string): string => {
        if (!link.includes('[code]')) {
            return link;
        }

        const pathParts = pathname.split('/');
        const linkParts = link.split('/');

        return linkParts.map((part, index) => {
            if (part.includes('[code]')) {
                return pathParts[index];
            }
            return part;
        }).join('/');
    };

    const matchedBreadcrumb = breadcrumbs.find(breadcrumb => isMath(breadcrumb.link));

    return (
        <div className="h-6 pt-1 flex items-center gap-x-2">
            {
                matchedBreadcrumb?.breadcrumbTrail.map((trail, index) => (
                    <React.Fragment key={trail.label + index}>
                        {index > 0 && <MdNavigateNext className="text-navy-700" />}
                        {index === matchedBreadcrumb?.breadcrumbTrail.length - 1 ? (
                            <div className="text-brand-500 text-sm font-nunito dark:text-white">{trail.label}</div>
                        ) : trail.link ? (
                            <Link href={replacePathParams(trail.link)}
                                  className="text-sm font-nunito text-navy-700 hover:underline dark:text-white">
                                {trail.label}
                            </Link>
                        ) : (
                            <div className="text-sm font-nunito text-navy-700 dark:text-white">
                                {trail.label}
                            </div>
                        )}
                    </React.Fragment>
                ))
            }
        </div>
    );
};

export default Breadcrumb;