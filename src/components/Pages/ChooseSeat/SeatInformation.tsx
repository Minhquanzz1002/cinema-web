'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

// Định nghĩa kiểu dữ liệu cho thông tin suất chiếu
interface Showtime {
    movieTitle?: string;
    cinemaName?: string; // Thay theaterName thành cinemaName
    format?: string;
    date?: string;
    time?: string;
    ageRating?: string;
    image?: string;
    room?: Room;
    roomId?: number;
    roomName?: string;
    dayOfWeek?: string;
    showtimeId?: string;
}

interface Room {
    name: string;
    id: number;
    rows: Row[];
}

interface Row {
    name: string;
    index: number;
    seats: Seat[];
}

interface Seat {
    name: string;
    rowIndex: number;
    columnIndex: number;
    area: number; // 1 cho ghế đơn, 2 cho ghế đôi
    id: number;
    groupSeats: GroupSeat[];
    type: 'VIP' | 'NORMAL' | 'COUPLE';
    status: 'ACTIVE' | 'INACTIVE'; // Trạng thái ghế
    booked: boolean; // Đã được đặt chỗ chưa
    price: number | null; // Giá tiền cho ghế
}

interface GroupSeat {
    rowIndex: number;
    columnIndex: number;
    area: number;
}

export interface Layout {
    id: number;
    maxColumn: number;
    maxRow: number;
    rows: Row[];
}

type LayoutSeatProps = {
    layout?: Layout;
};

const SeatInformation: React.FC<LayoutSeatProps> = ({
    layout = { maxRow: 0, maxColumn: 0, rows: [] },
}) => {
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const seatPrice = 75000; // Giá tiền cho mỗi ghế
    const router = useRouter();
    const [roomLayout, setRoomLayout] = useState<Room | null>(null);
    const [totalPriceBooking, setTotalPriceBooking] = useState<number>(0);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const rows = Array(layout.maxRow).fill(null);
    layout.rows.forEach(row => (rows[row.index] = row));

    useEffect(() => {
        // Lấy thông tin lịch chiếu từ localStorage
        const storedShowtime = localStorage.getItem('showtime');
        if (storedShowtime) {
            setShowtime(JSON.parse(storedShowtime));
        }
    }, []);

    const showtimeId = showtime?.showtimeId;
    console.log('Showtime ID:', showtimeId);

    useEffect(() => {
        // Khi đã có showtime và roomId, gọi API để lấy bố cục phòng chiếu
        if (showtime?.showtimeId) {
            const fetchRoomLayout = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/v1/show-times/${showtime.showtimeId}/seat-layout`,
                    );
                    setRoomLayout(response.data.data);
                } catch (error) {
                    console.error('Lỗi khi lấy bố cục phòng chiếu:', error);
                }
            };

            fetchRoomLayout();
        }
    }, [showtime?.showtimeId]);

    const renderSeat = (seat: Seat | null, index: number, array: (Seat | null)[]) => {
        // Check if seat is null or has no price
        if (!seat || seat.price === null) {
          return <div key={`empty-${index}`} className="w-[22px] h-[22px]" />; // Empty spot for unavailable seats
        }
      
        const seatId = `${seat.rowIndex}-${seat.columnIndex}`;
        const isSelected = selectedSeats.includes(seatId);
      
        let seatClass = '';
        if (seat.booked) {
          seatClass = 'bg-gray-400 cursor-not-allowed'; // Booked seat
        } else if (isSelected) {
          seatClass = 'bg-orange-500 text-white'; // Selected seat
        } else {
          seatClass = 'bg-white border border-gray-400'; // Available seat
        }
      
        // Handle double seat (couple seat)
        if (seat.area === 2) {
          const nextSeat = array[index + 1];
          if (nextSeat) array.splice(index + 1, 1); // Remove the next seat from array
      
          return (
            <div className="flex items-center"> {/* Center double seats */}
              <button
                key={seat.id}
                className={`flex w-[46px] h-[22px] items-center justify-between rounded p-2 mx-1 ${seatClass}`}
                onClick={() =>
                  seat.booked ? null : handleSeatClick(seat.rowIndex, seat.columnIndex)
                }
                disabled={seat.booked}
              >
                <div className="text-[8px] font-bold">{seat.name}</div>
                <div className="text-[8px] font-bold">{nextSeat?.name}</div>
              </button>
            </div>
          );
        }
      
        // Render normal seat
        return (
          <div className="flex items-center mx-1"> {/* Added margin for spacing */}
            <button
              key={seat.id}
              className={`flex w-[22px] h-[22px] items-center justify-center rounded text-[8px] font-bold hover:bg-orange-500 ${seatClass}`}
              onClick={() =>
                seat.booked ? null : handleSeatClick(seat.rowIndex, seat.columnIndex)
              }
              disabled={seat.booked}
            >
              {seat.name}
            </button>
          </div>
        );
      };
      
      const renderRow = (row: Row) => {
        const seats = Array(layout.maxColumn).fill(null);
        row.seats.forEach(seat => {
          seats[seat.columnIndex] = seat;
        });
      
        return (
          <div className="flex items-center">
            {seats.map((seat, index) => (
              <div key={`seat-${index}`} className="flex items-center justify-center">
                {renderSeat(seat, index, seats)}
              </div>
            ))}
          </div>
        );
      };
      

    const calculateTotalPrice = (updatedSelectedSeats: string[], bookingDetails: any) => {
        let totalPrice = 0;

        updatedSelectedSeats.forEach(seatId => {
            const [rowIndex, colIndex] = seatId.split('-').map(Number);
            const seat = roomLayout?.rows[rowIndex]?.seats[colIndex];

            if (seat) {
                totalPrice += seatPrice; // Giả sử giá cho tất cả các ghế là seatPrice
            }
        });

        const finalPrice = bookingDetails ? bookingDetails.totalPrice : totalPrice;
        setTotalPriceBooking(finalPrice); // Cập nhật giá trị tổng vào state

        console.log('Updated Total Price:', finalPrice);
    };

    useEffect(() => {
        const storedBookingDetails = localStorage.getItem('bookingDetails');
        const bookingDetails = storedBookingDetails ? JSON.parse(storedBookingDetails) : null;

        console.log('Booking Details:', bookingDetails);
        console.log('Booking Details ID', bookingDetails?.id);

        // Update state with booking details
        setBookingDetails(bookingDetails); // Store booking details in state

        calculateTotalPrice(selectedSeats, bookingDetails);
    }, [selectedSeats, roomLayout, seatPrice]);

    // Xử lý khi chọn ghế
    const handleSeatClick = async (rowIndex: number, colIndex: number) => {
        const seatId = `${rowIndex}-${colIndex}`; // Tạo seatId từ vị trí hàng và cột

        // Cập nhật danh sách các ghế đã chọn
        setSelectedSeats(prevSelectedSeats => {
            const updatedSeats = prevSelectedSeats.includes(seatId)
                ? prevSelectedSeats.filter(seat => seat !== seatId)
                : [...prevSelectedSeats, seatId];

            // Lưu danh sách ghế đã chọn vào localStorage
            localStorage.setItem('selectedSeats', JSON.stringify(updatedSeats));

            return updatedSeats;
        });

        // Lấy tên hàng và tên ghế
        const rowName = roomLayout?.rows?.[rowIndex]?.name || ''; // Tên hàng
        const seatName = roomLayout?.rows?.[rowIndex]?.seats?.[colIndex]?.name || ''; // Tên ghế
        const seatFullName = `${rowName} ${seatName}`; // Kết hợp row.name và seat.name

        console.log('Selected Seat Full Name:', seatFullName); // In ra tên đầy đủ của ghế

        try {
            const token = accessToken;

            // Nếu thiếu accessToken hoặc orderID, không thực hiện gọi API
            if (!token || !showtimeId) {
                console.error('Thiếu accessToken hoặc showtimeId.');
                return;
            }

            // Dữ liệu ghế đã chọn cần gửi lên API, chỉ lấy ID của ghế từ danh sách ghế đã chọn
            const updatedSeats = selectedSeats.includes(seatId)
                ? selectedSeats.filter(seat => seat !== seatId)
                : [...selectedSeats, seatId];

            const seatIds = updatedSeats
                .map(seat => {
                    const [rowIndex, colIndex] = seat.split('-').map(Number);
                    const seatData = roomLayout?.rows?.[rowIndex]?.seats?.[colIndex];
                    return seatData ? seatData.id : null; // Trả về null nếu không tìm thấy seatData
                })
                .filter(id => id !== null); // Lọc ra các id không hợp lệ

            // Tạo thông tin ghế để gửi lên API
            const seatsToSend = updatedSeats.map(seat => {
                const [rowIndex, colIndex] = seat.split('-').map(Number);
                const rowName = roomLayout?.rows?.[rowIndex]?.name || '';
                const seatName = roomLayout?.rows?.[rowIndex]?.seats?.[colIndex]?.name || '';
                return { rowName, seatName }; // Tạo đối tượng với tên hàng và tên ghế
            });

            // Gọi API để cập nhật danh sách ghế
            const response = await fetch(`http://localhost:8080/api/v1/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
                body: JSON.stringify({
                    showTimeId: showtimeId,
                    seatIds: seatIds, // Gửi danh sách ID của các ghế đã chọn
                    seats: seatsToSend, // Gửi thông tin ghế (tên hàng và tên ghế)
                }),
            });

            // Kiểm tra phản hồi từ API
            if (!response.ok) {
                const error = await response.json();
                console.error('Lỗi khi cập nhật ghế:', error);
            } else {
                console.log('Cập nhật ghế thành công!');
                const data = await response.json();
                console.log('Danh sach Data:', data);
                const price = data.data.totalPrice;
                setTotalPrice(price);
                const orderId = data.data.id;
                if (orderId) {
                    localStorage.setItem('orderID', orderId);
                    console.log('orderID lưu vào localStorage:', orderId);
                } else {
                    console.error('Không tìm thấy orderID trong phản hồi API.');
                }
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    // Khôi phục danh sách ghế đã chọn từ localStorage khi trang được tải lại
    useEffect(() => {
        const savedSeats = localStorage.getItem('selectedSeats');
        if (savedSeats) {
            setSelectedSeats(JSON.parse(savedSeats));
        }
    }, []);

    // Hiển thị totalPrice
    console.log('Total Price:', totalPrice);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.localStorage) return;
        const storedBookingDetails = localStorage.getItem('bookingDetails');
        const bookingDetails = storedBookingDetails ? JSON.parse(storedBookingDetails) : null;
        console.log('Booking Details:', bookingDetails);
        console.log('Booking Details ID', bookingDetails?.id);

        calculateTotalPrice(selectedSeats, bookingDetails);
    }, [selectedSeats, bookingDetails, roomLayout, seatPrice]);

    const handleBackClick = () => {
        // Quay lại trang chọn BookTicket
        router.push('/booking');
    };

    const [accessToken, setAccessToken] = useState('');
    useEffect(() => {
        if (typeof window === 'undefined' || !window.localStorage) return;
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    console.log('Access Token:', accessToken);

    const [orderID, setOrderID] = useState('');

    useEffect(() => {
        const storedOrderID = localStorage.getItem('orderID');
        if (storedOrderID) {
            setOrderID(storedOrderID); // Đặt trực tiếp giá trị orderID
        }
    }, []);

    console.log('Order ID Tạo hóa đơn:', orderID);

    // Xử lý khi nhấn nút Tiếp tục
    const handleContinueClick = () => {
        if (selectedSeats.length === 0) {
            setShowModal(true);
        } else {
            const bookingDetails = {
                image: showtime?.image,
                movieTitle: showtime?.movieTitle,
                format: showtime?.format,
                time: showtime?.time,
                date: showtime?.date,
                ageRating: showtime?.ageRating,
                selectedSeats,
                totalPrice,
                // truyền seatFullName vào bookingDetails nếu 2 giá trị phần cách bằng dấu phẩy
                seatFullName: selectedSeats
                    .map(seatId => {
                        const [rowIndex, colIndex] = seatId.split('-').map(Number);
                        const rowName = roomLayout?.rows[rowIndex]?.name || '';
                        const seatName = roomLayout?.rows[rowIndex]?.seats[colIndex]?.name || '';
                        return `${rowName}${seatName}`; // Trả về tên ghế đầy đủ
                    })
                    .join(', '), // Nối các tên ghế bằng dấu phẩy
                roomName: showtime?.roomName,
                dayOfWeek: showtime?.dayOfWeek,
                cinemaName: showtime?.cinemaName,
            };

            localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
            router.push('/choose-seat/combos');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Gọi localStorage.setItem("totalPriceCombo", JSON.stringify(totalPriceCombo));
    useEffect(() => {
        localStorage.setItem('totalPriceCombo', JSON.stringify(totalPriceBooking));
    }, [totalPriceBooking]);

    console.log('Total Price Combo:', totalPriceBooking);

    if (!roomLayout) {
        return <div>Loading room layout...</div>;
    }

    return (
        <div className="seat-information-container flex p-4">
            <div className="seat-selection w-3/5">
                <div className="seat-grid px-[13%]">
                    <div className="w-full rounded border p-2 shadow-md">
                        {roomLayout.rows.map((row, rowIndex: number) => (
                            <div className="my-1 flex h-[27px] justify-between" key={rowIndex}>
                                {row ? (
                                    <>
                                        <div className="w-[15px] text-center text-sm font-semibold text-gray-600">
                                            {row.name}
                                        </div>
                                        <div className="flex flex-1 justify-end mr-40 gap-x-1">

                                            {renderRow(row)}
                                        </div>
                                        <div className="w-[15px] text-center text-sm font-semibold text-gray-600">
                                            {row.name}
                                        </div>
                                    </>
                                ) : (
                                    <div />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="seat-legend mt-4 flex justify-center px-[13%]">
                    <Image src="/image/holographic.png" alt="Ticket" width={100} height={65} />
                </div>

                <div className="seat-legend mt-4 flex justify-between px-[13%]">
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 bg-gray-300"></div>
                        <span>Ghế đã bán</span>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 bg-orange-500"></div>
                        <span>Ghế đang chọn</span>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 border border-gray-300"></div>
                        <span>Ghế đơn</span>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 border border-blue-500"></div>
                        <span>Ghế đôi</span>
                    </div>
                </div>
            </div>

            <div className="movie-info w-1/3.5 ml-4 rounded-lg border-t-4 border-orange-500 bg-white p-4 shadow-lg">
                {showtime ? (
                    <div>
                        <div className="mb-4 flex items-start">
                            <img
                                src={showtime.image}
                                alt={showtime.movieTitle}
                                className="mr-4 h-32 w-24 rounded-md object-cover"
                            />
                            <div>
                                <h2 className="mb-6 text-xl font-bold">{showtime.movieTitle}</h2>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        {showtime.format === '2D Phụ Đề'
                                            ? 'IMAX 2D Phụ Đề'
                                            : '3D Phụ Đề'}
                                    </span>{' '}
                                    {showtime.format} -{' '}
                                    <span className="rounded bg-orange-500 px-2 py-1 font-bold text-white">
                                        {showtime.ageRating}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <p className="mb-2 text-[18px]">
                            <span className="font-semibold">{showtime.cinemaName}</span> {' - '}{' '}
                            <span className="font-semibold">{showtime.roomName}</span>
                        </p>
                        <p className="mb-4 text-[16px]">
                            <span className="font-sans">Suất:</span>{' '}
                            <span className="font-bold">
                                {typeof showtime.time === 'string' ? showtime.time.slice(0, 5) : ''}
                            </span>{' '}
                            {' - '} <span className="font-bold">{showtime.dayOfWeek}</span>,{' '}
                            {showtime.date}
                        </p>

                        <p>
                            ----------------------------------------------------------------------
                        </p>
                        <div className="mb-2 mt-2 flex items-center justify-between">
                            <p className="text-[16px]">
                                Ghế:{' '}
                                <span className="font-bold">
                                    {
                                        selectedSeats.length > 0 // Kiểm tra xem có ghế nào được chọn không
                                            ? selectedSeats
                                                  .map(seatId => {
                                                      // Lấy rowIndex và colIndex từ seatId
                                                      const [rowIndex, colIndex] = seatId
                                                          .split('-')
                                                          .map(Number);
                                                      const rowName =
                                                          roomLayout?.rows?.[rowIndex]?.name || ''; // Tên hàng
                                                      const seatName =
                                                          roomLayout?.rows?.[rowIndex]?.seats?.[
                                                              colIndex
                                                          ]?.name || ''; // Tên ghế
                                                      return `${rowName}${seatName}`; // Kết hợp tên hàng và tên ghế
                                                  })
                                                  .join(', ') // Nối các tên ghế lại với nhau
                                            : 'Chưa chọn ghế' // Hiển thị thông báo khi chưa chọn ghế
                                    }
                                </span>
                            </p>
                            {/* Hiển thị tiền ghế */}
                            <p className="font-bold">
            
                                {totalPrice > 0 ? totalPrice.toLocaleString() : '0'} đ
                               
                            </p>
                            {/* Kiểm tra giá trị totalPrice */}
                        </div>

                        <p>
                            ----------------------------------------------------------------------
                        </p>
                        <div className="total mt-4 flex items-center justify-between">
                            <p className="text-lg font-bold">Tổng cộng:</p>
                            <p className="font-bold text-orange-500">
                                {/* {totalPrice > 0 ? `${totalPrice.toLocaleString()} đ` : `${totalPriceBooking.toLocaleString()} đ`} */}
                                {totalPrice > 0 ? totalPrice.toLocaleString() : '0'} đ
                            </p>
                        </div>
                        <div className="actions mt-4 flex justify-between">
                            <button
                                className="btn-back px-20 text-orange-500"
                                onClick={handleBackClick} // Gọi hàm handleBackClick khi nhấn nút
                            >
                                Quay lại
                            </button>
                            <button
                                className="btn-continue rounded bg-orange-500 px-20 py-2 text-white"
                                onClick={handleContinueClick} // Gọi hàm khi nhấn nút
                            >
                                Tiếp tục
                            </button>
                        </div>
                        {/* Modal thông báo */}
                        {showModal && (
                            <div className="modal z-70 fixed inset-0 flex items-center justify-center">
                                <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                                <div className="modal-content z-10 w-[350px] rounded-lg bg-white p-6 text-center shadow-lg">
                                    <div className="modal-close mb-5 flex justify-center">
                                        <img
                                            src="https://www.galaxycine.vn/_next/static/media/notice.e305ff4b.png"
                                            alt="warning"
                                            className="h-10 w-10 object-center"
                                        />
                                    </div>
                                    <h1 className="mb-4 text-[18px] font-bold">Thông báo</h1>
                                    <h2 className="mb-4 font-sans text-[14px]">
                                        Vui lòng chọn ghế
                                    </h2>
                                    <button
                                        className="btn-close rounded bg-orange-500 px-20 py-2 text-white"
                                        onClick={handleCloseModal} // Đóng modal khi nhấn nút
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading showtime details...</p>
                )}
            </div>
        </div>
    );
};

export default SeatInformation;
