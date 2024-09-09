import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";

// Định nghĩa kiểu dữ liệu cho thông tin suất chiếu
interface Showtime {
  movieTitle?: string;
  theaterName?: string;
  format?: string;
  date?: string;
  dayOfWeek?: string;
  time?: string;
  soT?: string;
  image?: string;
}

const SeatInformation: React.FC = () => {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false); // Trạng thái quản lý modal
  const seatPrice = 45000; // Giá mỗi ghế là 45,000 đồng

  useEffect(() => {
    // Lấy thông tin lịch chiếu từ localStorage
    const storedShowtime = localStorage.getItem("selectedShowtime");
    if (storedShowtime) {
      setShowtime(JSON.parse(storedShowtime));
    }
  }, []);

  const handleSeatClick = (row: string, col: number) => {
    const seatId = `${row}${col + 1}`; // Ví dụ: A1, B2...
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((seat) => seat !== seatId) // Bỏ chọn ghế nếu đã chọn
        : [...prevSelectedSeats, seatId] // Thêm ghế vào danh sách đã chọn
    );
  };


  const totalPrice = selectedSeats.length * seatPrice; // Tính tổng số tiền
  const handleBackClick = () => {
    // Quay lại trang trước đó
    window.history.back();
  };

  const handleContinueClick = () => {
    if (selectedSeats.length === 0) {
      // Nếu không có ghế nào được chọn, hiển thị modal
      setShowModal(true);
    } else {
      const bookingDetails = {
        image: showtime?.image,
        movieTitle: showtime?.movieTitle,
        format: showtime?.format,
        theaterName: showtime?.theaterName,
        time: showtime?.time,
        date: showtime?.date,
        soT: showtime?.soT,
        selectedSeats,
        totalPrice,
      };

      // Lưu thông tin vào localStorage
      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

      // Điều hướng sang trang combos
      window.location.href = "/choose-seat/combos";
      
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal khi nhấn "Đóng"
  };

  return (
    <div className="seat-information-container flex p-4">
      {/* Phần chọn ghế */}
      <div className="seat-selection w-3/5 ">
        <div className="mb-4">
          {/* Thời gian chọn */}
          <div className="flex items-center px-[13%] justify-between">
            <span className="text-lg font-semibold">Đổi suất chiếu</span>
            <div className="flex space-x-2">
              {/* Thời gian */}
              {["16:30", "17:15", "20:00", "21:00", "22:00"].map((time, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 ${
                    time === "21:00"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  } rounded border`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lưới ghế */}
        <div className="seat-grid px-[13%]">
          <div className="grid grid-cols-10 gap-2">
            {/* Render rows and seats */}
            {["I", "H", "G", "F", "E", "D", "C", "B", "A"].map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Row label */}
                <div className="flex items-center justify-center font-bold">
                  {row}
                </div>
                {Array.from({ length: 9 }).map((_, colIndex) => {
                  const seatId = `${row}${colIndex + 1}`;
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSeatClick(row, colIndex)}
                      className={`seat w-10 h-10 border border-gray-300 flex items-center justify-center ${
                        selectedSeats.includes(seatId)
                          ? "bg-orange-500 text-white" // Đánh dấu ghế đang chọn
                          : rowIndex === 5 && colIndex >= 3 && colIndex <= 4
                          ? "bg-gray-300" // Ghế đã bán
                          : ""
                      }`}
                    >
                      {colIndex + 1}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <span className="bg-gray-500 w-30 text-white text-center p-2">
              Màn hình
            </span>
          </div>
          <hr className="mt-5 h-1 bg-orange-500 " />
        </div>

        {/* Chú thích ghế */}
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
            <div className="w-4 h-4 border border-yellow-500 mr-2"></div>
            <span>Ghế VIP</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-blue-500 mr-2"></div>
            <span>Ghế đơn</span>
          </div>
        </div>
      </div>

      {/* Phần thông tin phim */}
      <div className="movie-info w-1/3.5 ml-4 p-4 bg-white rounded-lg shadow-lg border-t-4 border-orange-500">
        {showtime ? (
          <div>
            <div className="flex items-start mb-4">
              <img
                src={showtime.image}
                alt={showtime.movieTitle}
                className="w-24 h-32 object-cover mr-4 rounded-md-"
              />
              <div>
                <h2 className="text-xl font-bold mb-6">
                  {showtime.movieTitle}
                </h2>
                <p className="text-sm">
                  {showtime.format} -{" "}
                  <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">
                    {showtime.soT}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-[18px] mb-2">
              <span className="font-semibold">{showtime.theaterName}</span>
            </p>
            <p className="text-[16px] mb-4">
              <span className="font-sans">Suất:</span>{" "}
              <span className="font-sans">{showtime.dayOfWeek}</span>
              <span className="ml-2"></span>
              <span className="font-bold">{showtime.time}</span> -{" "}
              {showtime.date}
            </p>
            <p>
              -------------------------------------------------------------------
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
          </div>
        ) : (
          <div>Loading showtime details...</div>
        )}
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
            <h2 className="text-[14px] font-sans mb-4">Vui lòng chọn ghế</h2>
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
  );
};

export default SeatInformation;
