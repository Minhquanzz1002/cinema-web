"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho thông tin suất chiếu
interface Showtime {
  movieTitle?: string;
  cinemaName?: string; // Thay theaterName thành cinemaName
  format?: string;
  date?: string;
  time?: string;
  age?: string;
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
  type: "VIP" | "NORMAL" | "COUPLE";
  status: "ACTIVE" | "INACTIVE"; // Trạng thái ghế
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
  layout.rows.forEach((row) => (rows[row.index] = row));

  useEffect(() => {
    // Lấy thông tin lịch chiếu từ localStorage
    const storedShowtime = localStorage.getItem("showtime");
    if (storedShowtime) {
      setShowtime(JSON.parse(storedShowtime));
    }
  }, []);

  const showtimeId = showtime?.showtimeId;
  console.log("Showtime ID:", showtimeId);

  useEffect(() => {
    // Khi đã có showtime và roomId, gọi API để lấy bố cục phòng chiếu
    if (showtime?.showtimeId) {
      const fetchRoomLayout = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/show-times/${showtime.showtimeId}/seat-layout`
          );
          setRoomLayout(response.data.data);
        } catch (error) {
          console.error("Lỗi khi lấy bố cục phòng chiếu:", error);
        }
      };

      fetchRoomLayout();
    }
  }, [showtime?.showtimeId]);

  const renderSeat = (
    seat: Seat | null,
    index: number,
    array: (Seat | null)[]
  ) => {
    if (!seat) {
      return <div key={`empty-${index}`} className="h-full aspect-square" />;
    }

    const seatId = `${seat.rowIndex}-${seat.columnIndex}`;
    const isSelected = selectedSeats.includes(seatId);

    // Kiểm tra trạng thái của ghế
    const seatClass =
      seat.status === "INACTIVE"
        ? "bg-gray-300" // Màu cho ghế đã bán
        : isSelected
        ? "bg-orange-500 text-white" // Màu cho ghế đang chọn
        : "bg-white"; // Màu cho ghế còn trống

    // Xử lý ghế đôi
    if (seat.area === 2) {
      const nextSeat = array[index + 1];
      if (nextSeat) array.splice(index + 1, 1); // Xóa ghế tiếp theo khỏi mảng

      return (
        <button
          key={seat.id}
          className={`h-full w-11 border text-center text-xs rounded flex justify-around items-center hover:bg-orange-400 ${seatClass}`}
          onClick={() =>
            seat.status === "ACTIVE" &&
            handleSeatClick(seat.rowIndex, seat.columnIndex)
          }
          disabled={seat.status === "INACTIVE"} // Vô hiệu hóa nếu ghế đã bán
        >
          <div>{seat.name}</div>
          <div>{nextSeat?.name}</div>
        </button>
      );
    }

    return (
      <button
        key={seat.id}
        className={`h-full aspect-square border flex justify-center items-center hover:bg-orange-400 text-xs rounded ${seatClass}`}
        onClick={() =>
          seat.status === "ACTIVE" &&
          handleSeatClick(seat.rowIndex, seat.columnIndex)
        }
        disabled={seat.status === "INACTIVE"} // Vô hiệu hóa nếu ghế đã bán
      >
        {seat.name}
      </button>
    );
  };

  const renderRow = (row: Row) => {
    // Thay vì fill null theo maxColumn, dùng số lượng ghế thực tế để đảm bảo đúng vị trí
    const seats = Array(layout.maxColumn).fill(null);
    row.seats.forEach((seat) => {
      seats[seat.columnIndex] = seat; // Đặt ghế đúng vị trí theo columnIndex
    });

    return seats.map((seat, index) => (
      <div key={`seat-${index}`} className="flex justify-center items-center">
        {renderSeat(seat, index, seats)}
      </div>
    ));
  };

  const calculateTotalPrice = (
    updatedSelectedSeats: string[],
    bookingDetails: any
  ) => {
    let totalPrice = 0;

    updatedSelectedSeats.forEach((seatId) => {
      const [rowIndex, colIndex] = seatId.split("-").map(Number);
      const seat = roomLayout?.rows[rowIndex]?.seats[colIndex];

      if (seat) {
        totalPrice += seatPrice; // Giả sử giá cho tất cả các ghế là seatPrice
      }
    });

    const finalPrice = bookingDetails ? bookingDetails.totalPrice : totalPrice;
    setTotalPriceBooking(finalPrice); // Cập nhật giá trị tổng vào state

    console.log("Updated Total Price:", finalPrice);
  };

  useEffect(() => {
    const storedBookingDetails = localStorage.getItem("bookingDetails");
    const bookingDetails = storedBookingDetails
      ? JSON.parse(storedBookingDetails)
      : null;

    console.log("Booking Details:", bookingDetails);
    console.log("Booking Details ID", bookingDetails?.id);

    // Update state with booking details
    setBookingDetails(bookingDetails); // Store booking details in state

    calculateTotalPrice(selectedSeats, bookingDetails);
  }, [selectedSeats, roomLayout, seatPrice]);

  // Xử lý khi chọn ghế
  const handleSeatClick = async (rowIndex: number, colIndex: number) => {
    const seatId = `${rowIndex}-${colIndex}`; // Tạo seatId từ vị trí hàng và cột

    // Cập nhật danh sách các ghế đã chọn
    setSelectedSeats((prevSelectedSeats) => {
      const updatedSeats = prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((seat) => seat !== seatId)
        : [...prevSelectedSeats, seatId];

      // Lưu danh sách ghế đã chọn vào localStorage
      localStorage.setItem("selectedSeats", JSON.stringify(updatedSeats));

      return updatedSeats;
    });

    // Lấy tên hàng và tên ghế
    const rowName = roomLayout?.rows[rowIndex].name; // Lấy row.name
    const seatName = roomLayout?.rows[rowIndex].seats[colIndex].name; // Lấy seat.name
    const seatFullName = `${rowName}${seatName}`; // Kết hợp row.name và seat.name

    console.log("Selected Seat Full Name:", seatFullName); // In ra tên đầy đủ của ghế

    try {
      // Lấy accessToken và orderID từ state
      const token = accessToken;

      // Nếu thiếu accessToken hoặc orderID, không thực hiện gọi API
      if (!token || !showtimeId) {
        console.error("Thiếu accessToken hoặc showtimeId.");
        return;
      }

      // Dữ liệu ghế đã chọn cần gửi lên API, chỉ lấy ID của ghế từ danh sách ghế đã chọn
      const updatedSeats = selectedSeats.includes(seatId)
        ? selectedSeats.filter((seat) => seat !== seatId)
        : [...selectedSeats, seatId];

      const seatIds = updatedSeats.map((seat) => {
        const [rowIndex, colIndex] = seat.split("-").map(Number);
        return roomLayout?.rows[rowIndex].seats[colIndex].id; // Lấy ID ghế dựa vào vị trí
      });

      // Gọi API để cập nhật danh sách ghế
      const response = await fetch(`http://localhost:8080/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
        body: JSON.stringify({
          showTimeId: showtimeId,
          seatIds: seatIds, // Gửi danh sách ID của các ghế đã chọn
        }),
      });

      // Kiểm tra phản hồi từ API
      if (!response.ok) {
        const error = await response.json();
        console.error("Lỗi khi cập nhật ghế:", error);
      } else {
        console.log("Cập nhật ghế thành công!");
        // Hiển thị danh sách ghế đã chọn
        console.log("Updated Seats:", updatedSeats);
        // Lưu dữ liệu response vào state
        const data = await response.json();
        console.log("Danh sach Data:", data);
        // Lấy và hiển thị giá tiền ghế totalPrice
        const price = data.data.totalPrice;
        setTotalPrice(price); // Lưu totalPrice vào state
        console.log("Tổng tiền:", price);

        // Tìm kiếm orderId trong phản hồi và lưu vào localStorage
        const orderId = data.data.id; // Truy cập orderId từ trường id
        if (orderId) {
          // Lưu orderID vào localStorage nếu tìm thấy
          localStorage.setItem("orderID", orderId);
          console.log("orderID lưu vào localStorage:", orderId);
        } else {
          console.error("Không tìm thấy orderID trong phản hồi API.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  // Khôi phục danh sách ghế đã chọn từ localStorage khi trang được tải lại
  useEffect(() => {
    const savedSeats = localStorage.getItem("selectedSeats");
    if (savedSeats) {
      setSelectedSeats(JSON.parse(savedSeats));
    }
  }, []);

  // Hiển thị totalPrice
  console.log("Total Price:", totalPrice);

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    const storedBookingDetails = localStorage.getItem("bookingDetails");
    const bookingDetails = storedBookingDetails
      ? JSON.parse(storedBookingDetails)
      : null;
    console.log("Booking Details:", bookingDetails);
    console.log("Booking Details ID", bookingDetails?.id);

    calculateTotalPrice(selectedSeats, bookingDetails);
  }, [selectedSeats, bookingDetails, roomLayout, seatPrice]);

  const handleBackClick = () => {
    // Quay lại trang chọn BookTicket
    router.push("/booking");
  };

  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  console.log("Access Token:", accessToken);

  const [orderID, setOrderID] = useState("");

  useEffect(() => {
    const storedOrderID = localStorage.getItem("orderID");
    if (storedOrderID) {
      setOrderID(storedOrderID); // Đặt trực tiếp giá trị orderID
    }
  }, []);

  console.log("Order ID Tạo hóa đơn:", orderID);

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
        age: showtime?.age,
        selectedSeats,
        totalPrice,
        // truyền seatFullName vào bookingDetails nếu 2 giá trị phần cách bằng dấu phẩy
        seatFullName: selectedSeats.map((seatId) => {
          const [rowIndex, colIndex] = seatId.split("-").map(Number);
          const rowName = roomLayout?.rows[rowIndex].name;
          const seatName = roomLayout?.rows[rowIndex].seats[colIndex].name;
          return `${rowName}${seatName}`;
        }),
        roomName: showtime?.roomName,
        dayOfWeek: showtime?.dayOfWeek,
        cinemaName: showtime?.cinemaName,
      };

      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      router.push("/choose-seat/combos");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Gọi localStorage.setItem("totalPriceCombo", JSON.stringify(totalPriceCombo));
  useEffect(() => {
    localStorage.setItem("totalPriceCombo", JSON.stringify(totalPriceBooking));
  }, [totalPriceBooking]);

  console.log("Total Price Combo:", totalPriceBooking);
  

  if (!roomLayout) {
    return <div>Loading room layout...</div>;
  }

  return (
    <div className="seat-information-container flex p-4">
      <div className="seat-selection w-3/5 ">
        <div className="seat-grid px-[13%]">
          <div className="w-full rounded p-2 border shadow-md">
            {roomLayout.rows.map((row, rowIndex: number) => (
              <div
                className="flex justify-between my-1 h-[27px]"
                key={rowIndex}
              >
                {row ? (
                  <>
                    <div className="w-[15px] text-center text-sm text-gray-600 font-semibold">
                      {row.name}
                    </div>
                    <div className="flex flex-1 justify-end mr-40 gap-x-1">
                      {renderRow(row)}
                    </div>
                    <div className="w-[15px] text-center text-sm text-gray-600 font-semibold">
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
          <Image
            src="/image/holographic.png"
            alt="Ticket"
            width={100}
            height={65}
          />
        </div>

        <div className="seat-legend mt-4 flex justify-between px-[13%]">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 mr-2"></div>
            <span>Ghế đã bán</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
            <span>Ghế đang chọn</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-gray-300 mr-2"></div>
            <span>Ghế đơn</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-blue-500 mr-2"></div>
            <span>Ghế đôi</span>
          </div>
        </div>
      </div>

      <div className="movie-info w-1/3.5 ml-4 p-4 bg-white rounded-lg shadow-lg border-t-4 border-orange-500">
        {showtime ? (
          <div>
            <div className="flex items-start mb-4">
              <img
                src={showtime.image}
                alt={showtime.movieTitle}
                className="w-24 h-32 object-cover mr-4 rounded-md"
              />
              <div>
                <h2 className="text-xl font-bold mb-6">
                  {showtime.movieTitle}
                </h2>
                <p className="text-sm">
                  <span className="font-semibold">
                    {showtime.format === "2D Phụ Đề"
                      ? "IMAX 2D Phụ Đề"
                      : "3D Phụ Đề"}
                  </span>{" "}
                  {showtime.format} -{" "}
                  <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">
                    T{showtime.age}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-[18px] mb-2">
              <span className="font-semibold">{showtime.cinemaName}</span>{" "}
              {" - "} <span className="font-semibold">{showtime.roomName}</span>
            </p>
            <p className="text-[16px] mb-4">
              <span className="font-sans">Suất:</span>{" "}
              <span className="font-bold">
                {typeof showtime.time === "string"
                  ? showtime.time.slice(0, 5)
                  : ""}
              </span>{" "}
              {" - "} <span className="font-bold">{showtime.dayOfWeek}</span>,{" "}
              {showtime.date}
            </p>

            <p>
              ----------------------------------------------------------------------
            </p>
            <div className="flex items-center justify-between mt-2 mb-2">
              <p className="text-[16px]">
                Ghế:{" "}
                <span className="font-bold">
                  {selectedSeats
                    .map((seatId) => {
                      const [rowIndex, colIndex] = seatId
                        .split("-")
                        .map(Number);
                      const rowName = roomLayout?.rows[rowIndex].name;
                      const seatName =
                        roomLayout?.rows[rowIndex].seats[colIndex].name;
                      return `${rowName}${seatName}`;
                    })
                    .join(", ")}
                </span>
              </p>
              {/* Hiển thị tiền ghê */}
              <p className="font-bold">  
                    {totalPrice.toLocaleString()} đ
              </p>
            </div>
            <p>
              ----------------------------------------------------------------------
            </p>
            <div className="total mt-4 flex items-center justify-between">
              <p className="text-lg font-bold">Tổng cộng:</p>
              <p className="text-orange-500 font-bold">
              {/* {totalPrice > 0 ? `${totalPrice.toLocaleString()} đ` : `${totalPriceBooking.toLocaleString()} đ`} */}
              {totalPrice.toLocaleString()} đ
              </p>
            </div>
            <div className="actions mt-4 flex justify-between">
              <button
                className="btn-back text-orange-500 px-20"
                onClick={handleBackClick} // Gọi hàm handleBackClick khi nhấn nút
              >
                Quay lại
              </button>
              <button
                className="btn-continue bg-orange-500 text-white px-20 py-2 rounded"
                onClick={handleContinueClick} // Gọi hàm khi nhấn nút
              >
                Tiếp tục
              </button>
            </div>
            {/* Modal thông báo */}
            {showModal && (
              <div className="modal fixed inset-0 flex items-center justify-center z-70">
                <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center z-10 w-[350px]">
                  <div className="modal-close flex justify-center mb-5">
                    <img
                      src="https://www.galaxycine.vn/_next/static/media/notice.e305ff4b.png"
                      alt="warning"
                      className="w-10 h-10 object-center"
                    />
                  </div>
                  <h1 className="text-[18px] font-bold mb-4">Thông báo</h1>
                  <h2 className="text-[14px] font-sans mb-4">
                    Vui lòng chọn ghế
                  </h2>
                  <button
                    className="btn-close bg-orange-500 text-white px-20 py-2 rounded"
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
