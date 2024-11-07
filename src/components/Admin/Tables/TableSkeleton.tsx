import React from 'react';

const TableSkeleton = ({ columnCount }: { columnCount: number }) => {
    return (
        <>
            {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-t last:border-b">
                    {[...Array(columnCount)].map((_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 first:pr-0">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;