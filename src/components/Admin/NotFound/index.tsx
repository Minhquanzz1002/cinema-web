import React from 'react';
import Card from '@/components/Admin/Card';
import Image from 'next/image';

const NotFound = () => {
    return (
        <Card className="py-10 mt-5">
            <div className="h-96 flex justify-center items-center flex-col">
                <div className="relative h-40 w-full">
                    <Image src="/404.svg" alt="404" fill className="object-contain"/>
                </div>
                <p className="text-xl font-medium text-gray-800">Không tìm thấy trang</p>
            </div>
        </Card>
    );
};

export default NotFound;