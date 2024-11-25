'use client';

import React, { useEffect } from 'react';
import { useSaleContext } from '@/context/SaleContext';
import Typography from '@/components/Admin/Typography';
import NotFound from '@/components/Admin/NotFound';
import { useLayoutSeatByShowTimeId } from '@/modules/showTimes/repository';
import Loader from '@/components/Admin/Loader';
import LayoutSeat from '@/components/Admin/LayoutSeat';
import BookingDetails from '@/components/Admin/BookingDetails';

const AdminChooseSeatPage = () => {
    const { selectedMovie, selectedShowTime, selectedSeats, proceedToComboSelection, backToChooseMovie, selectedProducts, isLoadingRedirect } = useSaleContext();
    const { data: layout, isLoading: isLoadingSeat } = useLayoutSeatByShowTimeId(selectedShowTime?.id || '');

    useEffect(() => {
        document.title = 'B&Q Cinema - Chọn ghế';
    }, []);

    if (isLoadingSeat) {
        return <Loader />;
    }

    if (!selectedMovie || !selectedShowTime || !layout) {
        return <NotFound />;
    }

    return (
        <div className="mt-2">
            <div className="flex gap-2">
                <div className="w-4/6 bg-white rounded-lg p-3">
                    <Typography.Title level={4}>Chọn ghế</Typography.Title>
                    <LayoutSeat layout={layout} />
                </div>
                <BookingDetails movie={selectedMovie} showTime={selectedShowTime}
                                selectedSeats={selectedSeats}
                                selectedProducts={selectedProducts}
                                footer={
                                    <div className="flex justify-end gap-5 items-center mt-5">
                                        <button type="button" onClick={backToChooseMovie} className="text-brand-500 py-2 px-5 rounded flex items-center justify-center gap-x-2">
                                            Quay lại
                                        </button>
                                        <button disabled={selectedSeats.length === 0 || isLoadingRedirect}
                                                onClick={proceedToComboSelection}
                                                className="disabled:bg-brand-200 bg-brand-500 py-2 px-5 rounded flex items-center justify-center text-white gap-x-2">
                                            {isLoadingRedirect ? 'Đang xử lý...' : 'Tiếp tục'}
                                        </button>
                                    </div>
                                }
                />
            </div>
        </div>
    );
};

export default AdminChooseSeatPage;