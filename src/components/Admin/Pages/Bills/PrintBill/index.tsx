import React from 'react';
import { AdminOrderOverview } from '@/modules/orders/interface';

type PrintBillProps = {
    bill: AdminOrderOverview;
};

const PrintBill = ({ bill } : PrintBillProps) => {
    const handlePrint = () => {
        console.log(bill);
        // Code here
    };

    return (
        <>
            <button className="h-9 bg-brand-500 text-white px-4 rounded" onClick={handlePrint}>
                In vé
            </button>
        </>
    );
};

export default PrintBill;