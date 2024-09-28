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
  area: number;
  id: number;
  groupSeats: GroupSeat[];
  type: "VIP" | "NORMAL" | "COUPLE";
  status: "ACTIVE" | "INACTIVE";
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
  layout: Layout;
};

const SeatInformation: React.FC<LayoutSeatProps> = ({
  layout = { maxRow: 0, maxColumn: 0, rows: [] },
}) => {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const seatPrice = 45000; // Giá mỗi ghế là 45,000 đồng
  const router = useRouter();
  const [roomLayout, setRoomLayout] = useState<Room | null>(null);

  const rows = Array(layout.maxRow).fill(null);
  layout.rows.forEach((row) => (rows[row.index] = row));

  useEffect(() => {
    // Lấy thông tin lịch chiếu từ localStorage
    const storedShowtime = localStorage.getItem("showtime");
    if (storedShowtime) {
      setShowtime(JSON.parse(storedShowtime));
    }
  }, []);

  const roomId = showtime?.roomId;
  console.log("roomId", roomId);

  useEffect(() => {
    // Khi đã có showtime và roomId, gọi API để lấy bố cục phòng chiếu
    if (showtime?.roomId) {
      const fetchRoomLayout = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/rooms/${showtime.roomId}/layout`
          );
          setRoomLayout(response.data.data);
        } catch (error) {
          console.error("Lỗi khi lấy bố cục phòng chiếu:", error);
        }
      };

      fetchRoomLayout();
    }
  }, [showtime?.roomId]);

  console.log("roomLayout", roomLayout);

  const renderSeat = (
    seat: Seat | null,
    index: number,
    array: (Seat | null)[]
  ) => {
    if (!seat) {
      return <div key={`empty-${index}`} className="h-full aspect-square" />;
    }

    const seatId = `${seat.rowIndex}-${seat.columnIndex}`; // Cập nhật seatId
    const isSelected = selectedSeats.includes(seatId);


    const seatClass = isSelected
      ? "bg-orange-500 text-white" // Màu cam khi được chọn
      : "bg-white"; // Màu trắng khi chưa được chọn

    if (seat.area === 2) {
      const nextSeat = array[index + 1];
      array.splice(index + 1, 1);
        

      return (
        <button
          key={seat.id}
          className={`h-full w-11 border text-center text-xs rounded flex justify-around items-center hover:bg-orange-400 ${seatClass}`}
          onClick={() => handleSeatClick(seat.rowIndex, seat.columnIndex)}
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
        onClick={() => handleSeatClick(seat.rowIndex, seat.columnIndex)}
      >
        {seat.name}
      </button>
    );
  };

  const renderRow = (row: Row) => {
    // Render theo thứ tự ghế hàng dọc bằng số tương ứng
    const seats = Array(layout.maxColumn).fill(null);
    row.seats.forEach((seat) => (seats[seat.columnIndex] = seat));
    return seats.map(renderSeat);
  };

  

  const handleSeatClick = (rowIndex: number, colIndex: number) => {
    const seatId = `${rowIndex}-${colIndex}`; // Cập nhật seatId
    
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((seat) => seat !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  
    // Group name và seat.name
    const rowName = roomLayout?.rows[rowIndex].name; // Lấy row.name
    const seatName = roomLayout?.rows[rowIndex].seats[colIndex].name; // Lấy seat.name
    const seatFullName = `${rowName}${seatName}`; // Kết hợp row.name và seat.name
  
    console.log("Selected Seat Full Name:", seatFullName); // Hiển thị tên ghế
  };
  

  const totalPrice = selectedSeats.length * seatPrice;
  const handleBackClick = () => {
    router.back();
  };

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

  if (!roomLayout) {
    return <div>Loading room layout...</div>;
  }

  return (
    <div className="seat-information-container flex p-4">
      <div className="seat-selection w-3/5 ">
        <div className="seat-grid px-[13%]">
          <div className="w-full rounded p-2 border  shadow-md">
            {roomLayout.rows.map((row, rowIndex: number) => (
              <div
                className="flex justify-between my-2 h-[30px]"
                key={rowIndex}
              >
                {row ? (
                  <>
                    <div className="w-[15px] text-center text-sm text-gray-600 font-semibold">
                      {row.name}
                    </div>
                    <div className="flex justify-center gap-x-1">
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
            <div className="w-4 h-4 border border-blue-500 mr-2"></div>
            <span>Ghế đơn</span>
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
              <span className="font-semibold">{showtime.cinemaName}</span> {" - "} <span className="font-semibold">{showtime.roomName}</span>
            </p>
            <p className="text-[16px] mb-4">
              <span className="font-sans">Suất:</span>{" "}
              <span className="font-bold">
                {typeof showtime.time === "string"
                  ? showtime.time.slice(0, 5)
                  : ""}
              </span>{" "}
              {" - "} <span className="font-bold">{showtime.dayOfWeek}</span>
              , {showtime.date}
            </p>

            <p>
          ----------------------------------------------------------------------
        </p>
        <div className="flex items-center justify-between mt-2 mb-2">
          <p className="text-[16px]">
            Ghế:{" "}
            <span className="font-bold">
              {selectedSeats.map((seatId) => {
                const [rowIndex, colIndex] = seatId.split("-").map(Number);
                const rowName = roomLayout?.rows[rowIndex].name;
                const seatName = roomLayout?.rows[rowIndex].seats[colIndex].name;
                return `${rowName}${seatName}`;
              }).join(", ")}
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
