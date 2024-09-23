import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho paymentDetails
interface PaymentDetails {
  image: string;
  movieTitle: string;
  format: string;
  theaterName: string;
  time: string;
  date: string;
  selectedSeats: string[];
  initialTotalPrice: number;
  totalPrice: number;
}

function PayMentInformation() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("HSBC/Payoo");
  const router = useRouter();



  useEffect(() => {
    const storedPaymentDetails = localStorage.getItem("paymentDetails");
    if (storedPaymentDetails) {
      setPaymentDetails(JSON.parse(storedPaymentDetails));
    }
  }, []);

  if (!paymentDetails) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const handleBackClick = () => {
    // window.history.back();
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg flex gap-8">
      {/* Phần thông tin khuyến mãi và phương thức thanh toán */}
      <div className="w-2/3">
        {/* Phần khuyến mãi */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Khuyến mãi</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Mã khuyến mãi"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button className="px-4 py-2 bg-orange-500 text-white rounded">
              Áp Dụng
            </button>
          </div>
          <p className="text-[12px] text-gray-500 italic ml-2">
            Lưu ý: Có thể áp dụng nhiều vouchers vào 1 lần thanh toán
          </p>
          <div className="text-[14px] font-bold font-sans">
            <p className="mt-4 mb-10">Khuyến mãi của bạn</p>
            <p className="mb-10">Áp dụng điểm Stars</p>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
          <div className="flex flex-col gap-2">
            {[
              {
                name: "HSBC/Payoo",
                img: "https://cdn.galaxycine.vn/media/2020/10/20/hsbc-icon_1603203578522.png",
              },
              {
                name: "ShopeePay",
                img: "https://cdn.galaxycine.vn/media/2022/4/29/shopee-pay_1651229746140.png",
              },
              {
                name: "MoMo",
                img: "https://cdn.galaxycine.vn/media/2020/10/20/momo-icon_1603203874499.png",
              },
              {
                name: "Zalopay",
                img: "https://cdn.galaxycine.vn/media/2024/7/10/zalopay_1720600308412.png",
              },
              {
                name: "VNPAY",
                img: "https://cdn.galaxycine.vn/media/2021/12/2/download_1638460623615.png",
              },
            ].map((method) => (
              <label key={method.name} className="flex items-center gap-4">
                <input
                  type="radio"
                  value={method.name}
                  checked={selectedPaymentMethod === method.name}
                  onChange={() => setSelectedPaymentMethod(method.name)}
                  className="form-radio"
                />
                <img src={method.img} alt={method.name} className="w-8 h-8" />
                <span className="text-sm">{method.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Phần thông tin phim */}
      <div className="p-4 bg-white rounded-lg shadow-lg border-t-4 border-orange-500 w-[68%] ml-20">
        {/* Header thông tin phim */}
        <div className="flex items-start mb-4">
          <img
            src={paymentDetails.image}
            alt={paymentDetails.movieTitle}
            className='w-[125px] h-[190px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0'
          />
          <div>
            <div className="ml-5">
              <h2 className="text-xl font-bold mb-6">
                {paymentDetails.movieTitle}
              </h2>
              <p className="text-sm">
              <span className="font-semibold">
                    {paymentDetails.format === "2D Phụ Đề"
                      ? "IMAX 2D Phụ Đề"
                      : "3D Phụ Đề"}
                  </span>{" "}
                {paymentDetails.format} -{" "}
                <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">
                  T16
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Chi tiết thông tin phim */}
        <div>
          <p className="text-[18px] mb-2 font-semibold">
            {paymentDetails.theaterName}
          </p>
          <p className="text-[16px] mb-4">
            <span className="font-sans">Suất:</span>{" "}
            <span className="font-bold"> {typeof paymentDetails.time === "string"
                  ? paymentDetails.time.slice(0, 5)
                  : ""}
              </span>{" "} -{" "}
            {paymentDetails.date}
          </p>
          <p>
            ------------------------------------------------------------------------
          </p>
          <div className="flex items-center justify-between mt-2 mb-2">
            <p className="text-[16px]">
              Ghế:{" "}
              <span className="font-bold">
                {paymentDetails.selectedSeats.join(", ")}
              </span>
            </p>
            <p className="font-bold">
              {paymentDetails.initialTotalPrice.toLocaleString()} đ
            </p>
          </div>
          <p>
            ------------------------------------------------------------------------
          </p>
          <div className="total mt-4 flex items-center justify-between">
            <p className="text-lg font-bold">
              Tổng cộng: 
            </p>
            <p className="text-orange-500 font-bold">
              {paymentDetails.totalPrice.toLocaleString()} đ
            </p>
          </div>
        </div>
        {/* Nút thanh toán */}
        <div className="actions mt-4 flex justify-between">
          <button className="btn-back text-orange-500 px-20" onClick={handleBackClick}>
            Quay lại
          </button>
          <button className="btn-continue bg-orange-500 text-white px-20 py-2 rounded">
            Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayMentInformation;
