import React from 'react';

const ItemInfo = ({ label, value }: { label: string; value: string | React.ReactNode }) => {
    return (
        <div className="grid grid-cols-3">
            <div className="font-medium">{label}:</div>
            <div className="col-span-2 font-normal text-gray-800">{value}</div>
        </div>
    );
};

export default ItemInfo;