import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho bookingDetails
interface BookingDetails {
  image: string;
  movieTitle: string;
  theaterName: string;
  format: string;
  time: string;
  date: string;
  selectedSeats: string[];
  totalPrice: number;
  age?: string;
  seatFullName?: string;
  roomName?: string;
  dayOfWeek?: string;
  cinemaName?: string;
}

// Định nghĩa kiểu dữ liệu cho FoodItem
interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}
interface PaymentDetails {
  totalPriceCombo: number;
  selectedCombos: { name: string; quantity: number }[];
}

function ChooseFoodInformation() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [foodData, setFoodData] = useState<FoodItem[]>([]);
  const [comboQuantities, setComboQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [initialTotalPrice, setInitialTotalPrice] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const router = useRouter();
  const [totalPriceCombo, setTotalPriceCombo] = useState(0);

  useEffect(() => {
    const storedDetails = localStorage.getItem("bookingDetails");
    const storedQuantities = localStorage.getItem("comboQuantities");
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails) as BookingDetails;
      setBookingDetails(parsedDetails);
      // setInitialTotalPrice(parsedDetails.totalPrice || 0);
    }

    // Fetch food data from API
    const fetchFoodData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/products");
        const result = await response.json();
        setFoodData(result.data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFoodData();
  }, []);

  const calculateTotalComboPrice = (quantities: { [key: number]: number }) => {
    return Object.keys(quantities).reduce((total, id) => {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) return total;

      const combo = foodData.find((item: FoodItem) => item.id === numericId);
      if (combo) {
        const quantity = quantities[numericId] || 0;
        return total + combo.price * quantity;
      }
      return total;
    }, 0);
  };

  const updateTotalPrice = (newComboQuantities: { [key: number]: number }) => {
    const totalComboPrice = calculateTotalComboPrice(newComboQuantities);
    return initialTotalPrice + totalComboPrice;
  };

  const handleIncrease = async (id: number) => {
    setComboQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + 1,
      };
      localStorage.setItem("comboQuantities", JSON.stringify(newQuantities));

      return newQuantities;
    });

    // Gọi API PUT để cập nhật số lượng sản phẩm sau khi setComboQuantities hoàn thành
    if (orderID && accessToken) {
      try {
        await updateProductQuantity(
          orderID,
          accessToken,
          id,
          (comboQuantities[id] || 0) + 1
        );
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
      }
    }
  };

  const handleDecrease = async (id: number) => {
    setComboQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id] || 0;
      if (currentQuantity === 0) return prevQuantities;

      const newQuantities = {
        ...prevQuantities,
        [id]: currentQuantity - 1,
      };
      localStorage.setItem("comboQuantities", JSON.stringify(newQuantities));

      return newQuantities;
    });

    // Gọi API PUT để cập nhật số lượng sản phẩm sau khi setComboQuantities hoàn thành
    if (orderID && accessToken) {
      try {
        await updateProductQuantity(
          orderID,
          accessToken,
          id,
          comboQuantities[id] - 1
        );
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
      }
    }
  };

  // Hàm cập nhật số lượng sản phẩm với async/await
  const updateProductQuantity = async (
    orderId: string,
    token: string,
    productId: number,
    quantity: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${orderId}/products`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products: [
              {
                id: productId,
                quantity: quantity,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        console.log("Cập nhật số lượng thành công");
        const data = await response.json();
        console.log("Data trả về từ API:", data);
        // Lấy và hiển thị giá tiền ghế totalPrice
        const price = data.data.finalAmount;
        setTotalPriceCombo(price);
        console.log("Total Price Combo:", price);
        // Lấy và hiển thị orderDetails.product.description
        const orderDetails = data.data.orderDetails;

        const productDescription = orderDetails.find(
          (item: any) => item.type === "PRODUCT"
        )?.product?.description;
        console.log("Product Description:", productDescription);
        //Lưu vào description
        setDescription(productDescription);
      } else {
        console.error("Lỗi khi cập nhật số lượng:", response.status);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  console.log("Tổng giá trị Combo:", totalPriceCombo);
  const [description, setDescription] = useState("");
  console.log("Description:", description);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const [accessToken, setAccessToken] = useState("");
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

  const handleBackClick = () => {
    // Lưu giá trị totalPriceCombo vào localStorage
    localStorage.setItem("totalPriceCombo", JSON.stringify(totalPriceCombo));
    router.push("/choose-seat");
  };

  const handleContinueClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClick = () => {
    if (bookingDetails) {
      // Collect selected combos with their names and quantities
      const selectedCombos = Object.keys(comboQuantities)
        .map((id) => {
          const numericId = parseInt(id, 10);
          const combo = foodData.find((item) => item.id === numericId);
          const quantity = comboQuantities[numericId] || 0;
          return combo && quantity > 0
            ? { name: combo.name, quantity: quantity }
            : null;
        })
        .filter(Boolean); // Remove null values

      // Prepare paymentDetails with selected combos
      const paymentDetails = {
        image: bookingDetails.image,
        movieTitle: bookingDetails.movieTitle,
        theaterName: bookingDetails.theaterName,
        format: bookingDetails.format,
        time: bookingDetails.time,
        date: bookingDetails.date,
        selectedSeats: bookingDetails.selectedSeats,
        totalPrice: bookingDetails.totalPrice,
        age: bookingDetails.age,
        seatFullName: bookingDetails.seatFullName,
        roomName: bookingDetails.roomName,
        dayOfWeek: bookingDetails.dayOfWeek,
        cinemaName: bookingDetails.cinemaName,
        totalPriceCombo,
        selectedCombos, // Add selected combos here
      };

      // Store paymentDetails in localStorage
      localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));
    }

    setShowConfirmation(false);
    router.push("/choose-seat/combos/payment");
  };

  // Khi payment  quay lại
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  useEffect(() => {
    const storedPaymentDetails = localStorage.getItem("paymentDetails");
    if (storedPaymentDetails) {
      setPaymentDetails(JSON.parse(storedPaymentDetails));
    }
  }, []);

  // Hiển thị totalPriceCombo, selectedCombos
  console.log("Payment Details:", paymentDetails);
  console.log("Total Price Combo:", paymentDetails?.totalPriceCombo);
  console.log("Selected Combos:", paymentDetails?.selectedCombos);

  // Hiển thị thời gian hủy đơn hàng
  const initialTime = 6 * 60; // 6 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem("timeLeft");
    return savedTime ? parseInt(savedTime, 10) : initialTime;
  });

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
      localStorage.removeItem("timeLeft"); // Clear the timeLeft from localStorage
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Start the timer and call the API when time reaches 0
  useEffect(() => {
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
  });

  // Format the timeLeft as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`; // Add leading zero if needed
  };


  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="choose-food-container grid grid-cols-1 lg:grid-cols-2 gap-8 px-[9%]">
      <div className="food-selection">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-serif mb-4 w-full">Chọn Combo</h3>
        </div>

        <div className="grid grid-cols-1 w-[115%]">
          {foodData.map((item: FoodItem) => (
            <div
              key={item.id}
              className="food-item bg-white p-4 rounded-lg shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="inline-block rounded-md w-[150px] h-[100px] mr-4 object-cover"
                />
                <div>
                  <h4 className="text-[14px] font-serif mb-2">{item.name}</h4>
                  <p className="text-sm mb-2">{item.description}</p>
                  <p className="text-orange-500 font-bold">
                    {item.price.toLocaleString()} đ
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="text-[14px] text-gray-600 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
                  onClick={() => handleDecrease(item.id)}
                  disabled={comboQuantities[item.id] === 0}
                >
                  -
                </button>
                <span className="px-4 py-2 text-[14px]">
                  {comboQuantities[item.id] || 0}
                </span>
                <button
                  className="text-[14px] text-gray-600 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
                  onClick={() => handleIncrease(item.id)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-0 ml-6">
        <div className="ml-60 movie-info ">
          <span className="text-[16px] text-black font-bold">
          Thời gian giữa ghế: <span className="text-orange-500">{formatTime(timeLeft)}</span>
          </span>
        </div>
        <div className="movie-info p-4 bg-white rounded-lg shadow-lg border-t-4 border-orange-500 w-[80%] ml-20 mt-5">
          <div className="flex items-start mb-4">
            <img
              src={bookingDetails.image}
              alt={bookingDetails.movieTitle}
              className="w-[125px] h-[190px] rounded object-cover"
            />
            <div className="ml-5">
              <h2 className="text-xl font-bold mb-6">
                {bookingDetails.movieTitle}
              </h2>
              <p className="text-sm">
                <span className="font-semibold">
                  {bookingDetails.format === "2D Phụ Đề"
                    ? "IMAX 2D Phụ Đề"
                    : "3D Phụ Đề"}
                </span>{" "}
                {bookingDetails.format} -{" "}
                <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">
                  T{bookingDetails.age}
                </span>
              </p>
            </div>
          </div>
          <p className="text-[18px] mb-2">
            <span className="font-semibold">{bookingDetails.cinemaName}</span>
            {" - " + bookingDetails.roomName}
          </p>
          <p className="text-[16px] mb-4">
            <span className="font-sans">Suất:</span>{" "}
            <span className="font-bold">
              {" "}
              {typeof bookingDetails.time === "string"
                ? bookingDetails.time.slice(0, 5)
                : ""}
            </span>{" "}
            - {bookingDetails.dayOfWeek} {" , "}
            {bookingDetails.date}
          </p>
          <p>
            -------------------------------------------------------------------
          </p>
          <div className="flex items-center justify-between mt-2 mb-2">
            <p className="text-[16px]">
              Ghế:{" "}
              <span className="font-bold">
                {Array.isArray(bookingDetails.seatFullName)
                  ? bookingDetails.seatFullName.join(", ")
                  : bookingDetails.seatFullName}
              </span>
            </p>
            <p className="font-bold">
              {" "}
              {bookingDetails.totalPrice.toLocaleString()} đ
            </p>
          </div>

          <p>
            -------------------------------------------------------------------
          </p>
          {/* Hiển thị thêm tên Combo đã chọn */}

          {Object.keys(comboQuantities).length > 0 ? ( // Kiểm tra xem có sản phẩm nào được chọn không
            <div>
              <ul className="list-disc pl-5">
                {foodData.map((item) => {
                  const quantity = comboQuantities[item.id] || 0; // Lấy số lượng của sản phẩm
                  return quantity > 0 ? ( // Chỉ hiển thị sản phẩm nếu có số lượng lớn hơn 0
                    <li key={item.id} className="text-sm">
                      {item.name}: {quantity} cái
                    </li>
                  ) : null;
                })}
              </ul>
              <p>
                ------------------------------------------------------------------
              </p>
            </div>
          ) : paymentDetails?.selectedCombos &&
            paymentDetails.selectedCombos.length > 0 ? ( // Kiểm tra và hiển thị selectedCombos
            <div>
              <h4 className="font-semibold">Danh sách Combo đã chọn:</h4>
              <ul className="list-disc pl-5">
                {paymentDetails.selectedCombos.map((combo, index) => (
                  <li key={index} className="text-sm">
                    {combo.name}: {combo.quantity} cái
                  </li>
                ))}
              </ul>
              <p>
                -------------------------------------------------------------------
              </p>
            </div>
          ) : null}

          <div className="total mt-4 flex items-center justify-between">
            <p className="text-lg font-bold">Tổng cộng:</p>
            <p className="text-orange-500 font-bold">
              {totalPriceCombo === 0
                ? paymentDetails?.totalPriceCombo?.toLocaleString() ||
                  bookingDetails.totalPrice.toLocaleString()
                : totalPriceCombo.toLocaleString()}{" "}
              đ
            </p>
          </div>

          <div className="actions mt-4 flex justify-between">
            <button
              className="btn-back text-orange-500 px-20"
              onClick={handleBackClick}
            >
              Quay lại
            </button>
            <button
              className="btn-continue bg-orange-500 text-white px-20 py-2 rounded"
              onClick={handleConfirmClick}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseFoodInformation;
