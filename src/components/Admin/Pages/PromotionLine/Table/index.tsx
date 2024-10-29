import React from 'react';

const Table = {
    CellHeader: ({ children }: { children?: React.ReactNode }) => {
        return (
            <th className="text-tiny text-gray-800 dark:text-white uppercase text-start px-4 py-2 first-of-type:pl-0">{children}</th>
        );
    },
    Cell: ({ children }: { children?: React.ReactNode }) => {
        return (
            <td className="px-4 py-2 first-of-type:pl-0">
                {children}
            </td>
        );
    },
};

export default Table;