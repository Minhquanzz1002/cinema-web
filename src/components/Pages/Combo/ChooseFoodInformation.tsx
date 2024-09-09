import React, { useEffect, useState } from "react";
import foodData from "@/variables/client/food";


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
  soT: string;
}

// Định nghĩa kiểu dữ liệu cho FoodItem
interface FoodItem {
  id: number;
  title: string;
  content: string;
  price: number | string;
  image: string;
}


function ChooseFoodInformation() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [comboQuantities, setComboQuantities] = useState<{ [key: number]: number }>({});
  const [initialTotalPrice, setInitialTotalPrice] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);


  useEffect(() => {
    const storedDetails = localStorage.getItem("bookingDetails");
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails) as BookingDetails;
      setBookingDetails(parsedDetails);
      setInitialTotalPrice(
        parseFloat(parsedDetails.totalPrice.toString().replace(/\D/g, "")) || 0
      );
    }
  }, []);

  const calculateTotalComboPrice = (quantities: { [key: number]: number }) => {
    return Object.keys(quantities).reduce((total, id) => {
      const numericId = parseInt(id, 10);
      console.log(`id: ${id}, numericId: ${numericId}`); // Debugging
  
      if (isNaN(numericId)) return total;
  
      const combo = foodData.find((item: FoodItem) => {
        console.log(`Comparing item.id: ${item.id} with numericId: ${numericId}`); // Debugging
        return item.id === numericId;
      });
  
      if (combo) {
        const quantity = quantities[numericId] || 0;
        const price = parseFloat(combo.price.toString().replace(/\D/g, "")) || 0;
        return total + price * quantity;
      }
      return total;
    }, 0);
  };
  
  
  

  const updateTotalPrice = (newComboQuantities: { [key: number]: number }) => {
    const totalComboPrice = calculateTotalComboPrice(newComboQuantities);
    return initialTotalPrice + totalComboPrice;
  };

  const handleIncrease = (id: number) => {
    setComboQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + 1,
      };

      if (bookingDetails) {
        const newTotalPrice = updateTotalPrice(newQuantities);
        setBookingDetails((prevDetails) => ({
          ...prevDetails!,
          totalPrice: newTotalPrice,
        }));
      }

      return newQuantities;
    });
  };

  const handleBackClick = () => {
    // Quay lại trang chọn  chose-seat
    window.history.back();
  };

  const handleDecrease = (id: number) => {
    setComboQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id] || 0;

      if (currentQuantity === 0) {
        return prevQuantities;
      }

      const newQuantities = {
        ...prevQuantities,
        [id]: currentQuantity - 1,
      };

      if (bookingDetails) {
        const newTotalPrice = updateTotalPrice(newQuantities);
        setBookingDetails((prevDetails) => ({
          ...prevDetails!,
          totalPrice: newTotalPrice,
        }));
      }

      return newQuantities;
    });
  };

  const handleContinueClick = () => {
    setShowConfirmation(true);
  };
  
  const handleConfirmClick = () => {
    if (bookingDetails) {
      const paymentDetails = {
        image: bookingDetails.image,
        movieTitle: bookingDetails.movieTitle,
        theaterName: bookingDetails.theaterName,
        format: bookingDetails.format,
        time: bookingDetails.time,
        date: bookingDetails.date,
        selectedSeats: bookingDetails.selectedSeats,
        initialTotalPrice,
        totalPrice: bookingDetails.totalPrice
      };
  
      localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));
    }
  
    setShowConfirmation(false);
    // Chuyển hướng đến trang payment
    window.location.href = "/choose-seat/combos/payment";
  };
  

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="choose-food-container grid grid-cols-1 lg:grid-cols-2 gap-8 px-[9%] ">
      <div className="food-selection mt-8 ">
        <h3 className="text-lg font-serif mb-4">Chọn Combo</h3>
        <div className="grid grid-cols-1 w-[115%]">
          {foodData.map((item: FoodItem) => (
            <div
              key={item.id}
              className="food-item bg-white p-4 rounded-lg shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className='inline-block rounded-md  w-[150px] h-[100px] mr-4 object-cover duration-500 ease-in-out group-hover:opacity-100"
                  scale-100 blur-0 grayscale-0)'
                  width={120}
                  height={120}
                />
                <div>
                  <h4 className="text-[14px] font-serif mb-2">{item.title}</h4>
                  <p className="text-sm mb-2">{item.content}</p>
                  <p className="text-orange-500 font-bold">
                    {item.price.toLocaleString()} 
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

      <div className="movie-info p-4 bg-white rounded-lg shadow-lg border-t-4 border-orange-500 w-[80%] ml-20 mt-20">
        <div className="flex items-start mb-4">
          <img
            src={bookingDetails.image}
            alt={bookingDetails.movieTitle}
            className='w-[125px] h-[190px] rounded  object-cover duration-500 ease-in-out group-hover:opacity-100"
      scale-100 blur-0 grayscale-0)'
          />
          <div className="ml-5">
            <h2 className="text-xl font-bold mb-6">
              {bookingDetails.movieTitle}
            </h2>
            <p className="text-sm">
              {bookingDetails.format} -{" "}
              <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">
                {bookingDetails.soT}
              </span>
            </p>
          </div>
        </div>
        <p className="text-[18px] mb-2">
          <span className="font-semibold">{bookingDetails.theaterName}</span>
        </p>
        <p className="text-[16px] mb-4">
          <span className="font-sans">Suất:</span>{" "}
          <span className="font-bold">{bookingDetails.time}</span> -{" "}
          {bookingDetails.date}
        </p>
        <p>----------------------------------------------------------------------</p>
        <div className="flex items-center justify-between mt-2 mb-2">
          <p className="text-[16px]">
            Ghế:{" "}
            <span className="font-bold">
              {bookingDetails.selectedSeats.join(", ")}
            </span>
          </p>
          <p className=" font-bold">
            {initialTotalPrice.toLocaleString()} đ
          </p>
        </div>

        <p>----------------------------------------------------------------------</p>
        <div className="total mt-4 flex items-center justify-between">
          <p className="text-lg font-bold">Tổng cộng:</p>
          <p className="text-orange-500 font-bold">
            {bookingDetails.totalPrice.toLocaleString()} đ
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
            onClick={handleContinueClick}
          >
            Tiếp tục
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm">
            <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold mb-4 inline-block">
              {bookingDetails.soT}
            </span>
            <p className="text-[19px] font-bold mb-4">
              Xác nhận mua vé cho người có độ tuổi phù hợp
            </p>
            <p className="text-[15px] mt-2 mb-4">
              Tôi xác nhận mua vé phim này cho người có độ tuổi từ 16 tuổi trở
              lên
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-200 text-gray-700 px-10 py-2 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmation(false)}
              >
                Từ chối
              </button>
              <button
                className="bg-orange-500 text-white px-10 py-2 rounded hover:bg-orange-600"
                onClick={handleConfirmClick}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseFoodInformation;
