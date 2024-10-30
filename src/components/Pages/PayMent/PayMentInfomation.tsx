import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho paymentDetails
interface PaymentDetails {
  image: string;
  movieTitle: string;
  format: string;
  theaterName: string;
  time: string;
  date: string;
  selectedSeats: string[];
  totalPrice: number;
  ageRating?: string;
  seatFullName?: string;
  roomName?: string;
  dayOfWeek?: string;
  cinemaName?: string;
  totalPriceCombo?: number;
  selectedCombos?: any[];
}
interface ModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Function to call when closing the modal
  onConfirm: () => void; // Function to call when confirming the action
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-10 rounded-md shadow-lg w-1/4">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center justify-center bg-white rounded-full h-10 w-10 mr-3">
            <FaExclamationTriangle className="h-10 w-10 text-yellow-300" />
          </div>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <h3 className="text-lg font-semibold">Cảnh báo!</h3>
        </div>
        <p className="mb-4 text-center">
          Các khuyến mãi đã áp dụng sẽ được gỡ bỏ, bạn có muốn tiếp tục?
        </p>

        <div className="flex justify-around">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition duration-200"
          >
            Từ chối
          </button>
          <button
            onClick={onConfirm}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

function PayMentInformation() {
  const [showModal, setShowModal] = useState(false);

  const [accessToken, setAccessToken] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);

   // Lấy thời gian còn lại từ localStorage khi component được render
   useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }
  }, []);

  // Lấy token từ localStorage
  useEffect(() => {
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

  // Function to call the delete API
  const deleteOrder = async () => {
    if (!orderID || !accessToken) {
      console.error("Missing orderID or accessToken");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the order.");
      }

      console.log("Order deleted successfully.");
      router.push("/"); // Redirect to homepage after deletion
      // Clear the localStorage const savedTime = localStorage.getItem("timeLeft");
      localStorage.removeItem("timeLeft");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Start the timer and call the API when time reaches 0
  useEffect(() => {
    if (timeLeft <= 0) {
      return; // Don't start a timer if there's no time left
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          deleteOrder(); // Call API to delete order
          return 0; // Ensure time doesn't go below 0
        }
        const newTime = prevTime - 1; // Decrease time by 1 second
        localStorage.setItem("timeLeft", newTime.toString()); // Update local storage
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [timeLeft]); // Only re-run the effect if timeLeft changes

  // Format the timeLeft as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`; // Add leading zero if needed
  };

  // Xử lý giảm giá
  const [discountCode, setDiscountCode] = useState<string>(""); // Theo dõi mã giảm giá người dùng nhập
  const [, setSuggestions] = useState<string[]>([]); // Gợi ý mã giảm giá

  // Xử lý sự kiện khi người dùng nhập mã giảm giá
  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setDiscountCode(code);

    // Gợi ý mã giảm giá dựa trên các mã có sẵn
    const discountSuggestions = ["SALE10", "CHAOBANMOI", "1VETANG1COMBO"];
    setSuggestions(
      discountSuggestions.filter((suggestion) => suggestion.includes(code))
    );
  };
  // Gọi API khi nhấn nút "Áp Dụng" mã giảm giá
  const applyDiscountCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${orderID}/discounts`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Gửi token trong Authorization header
          },
          body: JSON.stringify({
            code: discountCode, // Mã giảm giá từ input
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Discount applied successfully", data);

        // Ensure you're accessing finalAmount from the correct path
        const finalAmount = data.data.finalAmount; // Accessing finalAmount correctly
        console.log("Final amount after discount:", finalAmount);
        setFinalAmount(finalAmount);
        // Thông tin description
        const orderDetails = data.data.orderDetails;
        setOrderDetails(orderDetails);

        orderDetails.forEach((item: any) => {
          if (item.type === "PRODUCT" && item.product) {
            console.log("Product Description:", item.product.description);
          }
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to apply discount:", errorData);
        alert("Mã giảm giá không hợp lệ. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error occurred while applying discount:", error);
      alert(
        "Có lỗi xảy ra trong quá trình áp dụng mã giảm giá. Vui lòng thử lại sau."
      );
    }
  };

  const [finalAmount, setFinalAmount] = useState<number>(0);

  console.log("Final amount after discount:", finalAmount);

  // Lưu giá trị finalAmount vào state totalPriceCombo
  useEffect(() => {
    if (paymentDetails && finalAmount > 0) {
      // Create a new object to update paymentDetails without mutating the original state
      const updatedPaymentDetails = {
        ...paymentDetails,
        totalPriceCombo: finalAmount,
      };
      setPaymentDetails(updatedPaymentDetails);
    }
  }, [finalAmount]);

  // Thông tin description
  const [orderDetails, setOrderDetails] = useState<any[]>([]);

  // Clear discount code
  // Function to clear the discount
  const clearDiscount = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${orderID}/discounts/clear`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token
          },
        }
      );

      if (response.ok) {
        console.log("Discount cleared successfully");
        alert("Khuyến mãi đã được hủy.");
        // Optional: Update state or any other logic after clearing the discount
      } else {
        const errorData = await response.json();
        console.error("Failed to clear discount:", errorData);
        alert("Không thể hủy khuyến mãi. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error occurred while clearing discount:", error);
      alert(
        "Có lỗi xảy ra trong quá trình hủy khuyến mãi. Vui lòng thử lại sau."
      );
    }
  };

  // Thanh toán
  const handlePaymentClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${orderID}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Gửi token trong Authorization header
          },
          body: JSON.stringify({
            paymentMethod: selectedPaymentMethod,
          }),
        }
      );

      if (response.ok) {
        // Xử lý khi thanh toán thành công
        console.log("Payment successful");
        // Xóa thông tin thanh toán khỏi localStorage
        localStorage.removeItem("paymentDetails");
        // Xóa // Gọi localStorage.setItem("totalPriceCombo", JSON.stringify(totalPriceCombo)); khỏi localStorage
        localStorage.removeItem("totalPriceCombo");
        // Xóa   localStorage.setItem("selectedSeats", JSON.stringify(updatedSeats)); khỏi localStorage
        localStorage.removeItem("selectedSeats");
        // Xóa const savedTime = localStorage.getItem("timeLeft");
        localStorage.removeItem("timeLeft");
        // Xóa đếm ngược thời gian
        setTimeLeft(0);
        // Xóa giá trị tất cả các totalPriceBooking và totalPrice
        localStorage.removeItem("totalPriceBooking");
        localStorage.removeItem("totalPrice");
        // Xóa giá trị tất cả các totalPriceCombo
        localStorage.removeItem("totalPriceCombo");
       
        

        router.push("/"); // Điều hướng đến trang thanh toán thành công (tùy chọn)
      } else {
        // Xử lý khi có lỗi xảy ra
        const errorData = await response.json();
        console.error("Payment failed:", errorData);
        alert("Thanh toán không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error occurred during payment:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.");
    }
  };

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("HSBC/Payoo");
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

  // const handleBackClick = () => {
  //   // window.history.back();
  //   router.back();
  // };
  const handleBackClick = () => {
    setShowModal(true); // Show the modal when clicking back
  };
  // Handle modal confirmation
  const handleConfirm = async () => {
    setShowModal(false); // Hide the modal
    await clearDiscount(); // Call the clearDiscount function

    // Cập nhật thông tin vào localStorage
    const updatedPaymentDetails = {
      ...paymentDetails,
      totalPriceCombo: paymentDetails.totalPriceCombo, // Lưu giá trị tổng cộng
      selectedCombos: paymentDetails.selectedCombos, // Lưu danh sách combo đã chọn
    };

    localStorage.setItem(
      "paymentDetails",
      JSON.stringify(updatedPaymentDetails)
    );
    router.back(); // Navigate back
  };

  // Handle modal cancellation
  const handleClose = () => {
    setShowModal(false); // Just hide the modal
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
              onChange={handleDiscountCodeChange} // Theo dõi mã giảm giá người dùng nhập
            />
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded"
              onClick={applyDiscountCode}
            >
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
      <div className="p-4 bg-white w-[78%] ml-20">
      <div className="justify-center ml-40 mb-4">
          <span className="text-[16px] text-black font-bold">
          Thời gian giữa ghế: <span className="text-orange-500">{formatTime(timeLeft)}</span>
          </span>
        </div>
      <div className="p-4 rounded-lg shadow-lg border-t-4 border-orange-500 ">
        {/* Header thông tin phim */}
        <div className="flex items-start mb-4">
          <img
            src={paymentDetails.image}
            alt={paymentDetails.movieTitle}
            className="w-[125px] h-[190px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0"
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
                  {paymentDetails.ageRating}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Chi tiết thông tin phim */}
        <div>
          <p className="text-[18px] mb-2 font-semibold">
            {paymentDetails.cinemaName} - {paymentDetails.roomName}
          </p>
          <p className="text-[16px] mb-4">
            <span className="font-sans">Suất:</span>{" "}
            <span className="font-bold">
              {" "}
              {typeof paymentDetails.time === "string"
                ? paymentDetails.time.slice(0, 5)
                : ""}
            </span>{" "}
            - {paymentDetails.dayOfWeek} {" , "}
            {paymentDetails.date}
          </p>
          <p>
            ------------------------------------------------------------------------
          </p>
          <div className="flex items-center justify-between mt-2 mb-2">
            <p className="text-[16px]">
              Ghế:{" "}
              <span className="font-bold">
                {/* Hiển thị seatFullName */}
                {Array.isArray(paymentDetails.seatFullName)
                  ? paymentDetails.seatFullName.join(", ")
                  : paymentDetails.seatFullName}
              </span>
            </p>
            <p className="font-bold">
              {paymentDetails.totalPrice.toLocaleString()} đ
            </p>
          </div>
          <p>
            ------------------------------------------------------------------------
          </p>
          {/* HIển thị tên combo đã chọn */}
          {paymentDetails.selectedCombos?.map((combo, index) => (
            <div key={index} className="flex flex-col mt-2 mb-2">
              <p className="text-[16px]">
                {combo.name} x {combo.quantity}
              </p>
              {/* Hiển thị mô tả nếu có giá trị */}
              {orderDetails.map(
                (item) =>
                  item.type === "PRODUCT" &&
                  item.product?.name === combo.name && (
                    <p
                      key={item.product.id}
                      className="text-orange-500 text-[14px]"
                    >
                      {item.product.description}
                    </p>
                  )
              )}
            </div>
          ))}
          <p>
            ------------------------------------------------------------------------
          </p>
          <div className="total mt-4 flex items-center justify-between">
            <p className="text-lg font-bold">Tổng cộng:</p>
            <p className="text-orange-500 font-bold">
              {paymentDetails.totalPriceCombo
                ? paymentDetails.totalPriceCombo.toLocaleString() + " đ"
                : "Chưa có giá trị"}
            </p>
          </div>
        </div>
        {/* Nút thanh toán */}
        <div className="actions mt-4 flex justify-between">
          <button
            className="btn-back text-orange-500 px-20"
            onClick={handleBackClick}
          >
            Quay lại
          </button>
          <button
            className="btn-continue bg-orange-500 text-white px-20 py-2 rounded"
            onClick={handlePaymentClick}
          >
            Thanh Toán
          </button>
        </div>
      </div>
      </div>
      

      {/* Modal for confirmation */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default PayMentInformation;
