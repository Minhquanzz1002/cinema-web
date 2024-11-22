import React from 'react';
import { Layout, Row, Seat } from '@/modules/showTimes/interface';
import { useSaleContext } from '@/context/SaleContext';

type LayoutSeatProps = {
    layout: Layout;
}

const LayoutSeat = ({layout}: LayoutSeatProps) => {
    const rows = Array(layout.maxRow).fill(null);
    layout.rows.forEach(row => rows[row.index] = row);

    const { selectedSeats, addSeat, removeSeat, selectedTempSeats } = useSaleContext();
    const handleSeatClick = (seat: Seat) => {
        if (selectedSeats.some(s => s.id === seat.id)) {
            removeSeat(seat.id);
        } else {
            addSeat(seat);
        }
    };

    const isSeatSelected = (seat: Seat) => selectedSeats.some(s => s.id === seat.id);
    const isSeatTempSelected = (seat: Seat) => selectedTempSeats.some(s => s.id === seat.id);

    const renderSeat = (seat: Seat | null, index: number, array: (Seat | null)[]) => {
        if (!seat) {
            return <div key={`empty-${index}`} className="h-full aspect-square"/>;
        }

        if (seat.area === 2) {
            const nextSeat = array[index + 1];
            array.splice(index + 1, 1);

            return (
                <button key={seat.id} disabled={!isSeatSelected(seat) && !isSeatTempSelected(seat) && seat.booked}
                        onClick={() => handleSeatClick(seat)}
                        className={`disabled:bg-gray-700 disabled:border-gray-700 disabled:text-white h-full aspect-[2/1] border text-center text-xs rounded flex justify-around items-center hover:bg-brand-500 hover:border-brand-500 ${isSeatSelected(seat) ? 'bg-brand-500 text-white border-brand-500' : ''}`}>
                    <div>{seat.name}</div>
                    <div>{nextSeat?.name}</div>
                </button>
            );
        }

        return (
            <button key={seat.id} disabled={!isSeatSelected(seat) && !isSeatTempSelected(seat) && seat.booked}
                    onClick={() => handleSeatClick(seat)}
                    className={`disabled:bg-gray-700 disabled:border-gray-700 disabled:text-white h-full aspect-square border flex justify-center items-center hover:bg-brand-500 text-xs rounded hover:border-brand-500 ${isSeatSelected(seat) ? 'bg-brand-500 text-white border-brand-500' : ''}`}>
                {seat.name}
            </button>
        );
    };

    const renderRow = (row: Row) => {
        const seats = Array(layout.maxColumn).fill(null);
        row.seats.forEach(seat => seats[seat.columnIndex] = seat);
        return seats.map(renderSeat);
    };

    return (
        <div className="flex justify-center pt-3">
            <div className="w-full rounded p-2">
                {
                    rows.map((row, rowIndex: number) => (
                        <div className="flex justify-between my-1 h-[35px]" key={rowIndex}>
                            {
                                row ? (
                                    <>
                                        <div
                                            className="w-[15px] text-center text-xl text-gray-600">{row.name}</div>
                                        <div className="flex justify-center gap-x-1">
                                            {renderRow(row)}
                                        </div>
                                        <div
                                            className="w-[15px] text-center text-xl text-gray-600">{row.name}</div>
                                    </>
                                ) : <div/>
                            }
                        </div>
                    ))
                }
                <div className="mt-10 flex flex-col gap-3">
                    <div className="flex justify-center items-center text-gray-700">Màn hình</div>
                    <div className="h-1 w-full bg-brand-500"/>
                </div>
                <div className="mt-5 flex justify-between items-center">
                    <div className="flex gap-3 font-thin">
                        <div className="flex gap-2 items-center">
                            <div
                                className="w-5 aspect-square bg-gray-600 rounded border flex justify-center items-center"></div>
                            <div>Ghế đã bán</div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div
                                className="w-5 aspect-square bg-brand-500 rounded border flex justify-center items-center"></div>
                            <div>Ghế đang chọn</div>
                        </div>
                    </div>

                    <div className="flex gap-3 font-thin">
                        <div className="flex gap-2 items-center">
                            <div
                                className="w-5 aspect-square border-yellow-500 rounded border flex justify-center items-center"></div>
                            <div>Ghế VIP</div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div
                                className="w-5 aspect-square rounded border flex justify-center items-center"></div>
                            <div>Ghế đơn</div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div
                                className="w-10 h-5 rounded border flex justify-center items-center"></div>
                            <div>Ghế đôi</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayoutSeat;