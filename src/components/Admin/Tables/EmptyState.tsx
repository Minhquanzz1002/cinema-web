import React from 'react';
import { LuSearch } from 'react-icons/lu';

type EmptyStateProps = {
    colSpan: number;
}

const EmptyState = ({ colSpan }: EmptyStateProps) => {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center py-4 border-t ">
                <div className="flex flex-col justify-center items-center gap-4">
                    <LuSearch size={50} className="text-gray-600" />
                    <span
                        className="text-sm font-normal">Không có dữ liệu nào được tìm thấy</span>
                </div>
            </td>
        </tr>
    );
};

export default EmptyState;