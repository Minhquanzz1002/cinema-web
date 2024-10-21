import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Seat {
  name: string;
  type: string;
}

interface OrderDetail {
  type: "TICKET" | "PRODUCT";
  quantity: number;
  price: number;
  seat: Seat | null;
  product: any | null;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  gender: boolean | null;
  birthday: string;
}

const History: React.FC = () => {
  const [accessToken, setAccessToken] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    gender: null,
    birthday: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);
  // Thông tin người dùng
  // Gọi API để lấy thông tin user
  useEffect(() => {
    if (accessToken) {
      axios
        .get("http://localhost:8080/api/v1/auth/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          if (response.data.code === 200) {
            setUserData(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, [accessToken]);


// Lịch sử giao dịch
  useEffect(() => {
    if (accessToken) {
      fetch("http://localhost:8080/api/v1/orders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);

          if (Array.isArray(data)) {
            setOrders(data);
          } else if (Array.isArray(data?.data)) {
            setOrders(data.data);
          } else {
            setOrders([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [accessToken]);

  return (
    <div className="container mx-auto px-[13%] py-6 grid grid-cols-2 md:grid-cols-3 md:gap-6">
      {/* Left Section: User Profile & Info */}
      <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-[72px] h-[72px] leading-[62px] text-center rounded-full bg-[#D0D0D0] border-4 border-solid border-[#E9E9E2]">
              <img
                alt="Camera"
                width="20"
                height="20"
                decoding="async" 
                className='inline-block w-[20px] h-[20px] object-cover duration-500 ease-in-out group-hover:opacity-100"
                          scale-100 blur-0 grayscale-0)'
                src="https://www.galaxycine.vn/_next/static/media/camera.af597ff8.png"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-sm text-gray-600">🎁 0 Stars</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-2">
          <p className="text-sm">
            Gọi đường dây nóng:{" "}
            <a href="tel:19002224" className="text-blue-600">
              19002224 (9:00 - 22:00)
            </a>
          </p>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:hotro@galaxystudio.vn" className="text-blue-600">
              hotro@galaxystudio.vn
            </a>
          </p>
          <p className="text-sm">
            Website:{" "}
            <a
              href="https://galaxystudio.vn"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              galaxystudio.vn
            </a>
          </p>
          {/* Thông tin công ty */}
          <p className="text-sm">
            Địa chỉ:{" "}
            <span className="text-gray-600">
              Đường Quang Trung, Phường 10, Quận Gò Vấp, TP.Hồ Chí Minh
            </span>
          </p>
        </div>
      </div>

      {/* Right Section: Transaction History */}
      <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-[20px] font-bold text-center text-blue-500">
            Lịch Sử Giao Dịch
          </h3>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No transactions found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg p-4 relative transform transition-transform duration-300 hover:scale-105 active:scale-95 shadow-md" // Sử dụng Tailwind CSS cho hiệu ứng
              >
                <div className="justify-center my-4">
                  {/* Date and Time */}
                  <p className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 text-center">
                    {new Date(order.orderDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    , {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center space-x-4 mt-6">
                    {/* Image and age label */}
                    <div className="relative w-25 h-40">
                      <img
                        src={order.showTime.movie.imagePortrait}
                        alt={"Movie Poster"}
                        className="w-full h-full object-cover rounded-md"
                      />
                      {/* Age label at the bottom right of the image */}
                      <span className="absolute bottom-2 right-2 py-1 px-3 text-white bg-orange-500 rounded-md text-[14px] sm:text-sm font-bold">
                        T{order.showTime.movie.age}
                      </span>
                    </div>

                    {/* Movie details */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold">
                        {order.showTime.movie.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.showTime.cinemaName} {"-"}{" "}
                        {order.showTime.room.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Suất: {order.showTime.startTime} {"-"}{" "}
                        {new Date(
                          order.showTime.startDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-sm text-gray-600">
                        Ghế:{" "}
                        {order.orderDetails
                          .filter(
                            (detail: OrderDetail) =>
                              detail.type === "TICKET" && detail.seat
                          )
                          .map((detail: OrderDetail) => detail.seat!.name)
                          .join(", ")}
                      </p>

                      {/* Product details */}
                      <p className="text-sm text-gray-600">
                        Sản phẩm:{" "}
                        {order.orderDetails
                          .filter((detail: any) => detail.type === "PRODUCT")
                          .map((detail: any) => detail.product?.name)
                          .join(", ")}
                      </p>

                      {/* Movie rating */}
                      <p className="text-sm text-gray-600">
                        Đánh giá: {order.showTime.movie.rating.toFixed(1)}
                      </p>

                      <p className="text-sm text-orange-500">
                        Tổng tiền: {order.finalAmount.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
