import React from 'react';

const Table = {
    CellHeader: ({ children }: { children?: React.ReactNode }) => {
        return (
            <th className="text-tiny text-gray-800 dark:text-white uppercase text-start px-2 py-1 first-of-type:pl-0">{children}</th>
        );
    },
    Cell: ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => {
        return (
            <td className={`px-2 py-1 first-of-type:pl-0 ${className}`}>
                {children}

            </td>
        );
    },
};

export default Table;