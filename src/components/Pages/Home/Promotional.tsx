import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import promotionalData from "@/variables/client/promotional";

function Promotional() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAutoSlide = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 4) % promotionalData.length);
    }, 10000); // Chuyển hình sau mỗi 10 giây
  };

  const handleSwipeLeft = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prevIndex) => (prevIndex + 4) % promotionalData.length);
    startAutoSlide();
  };

  const handleSwipeRight = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? promotionalData.length - 4 : prevIndex - 4
    );
    startAutoSlide();
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true // Thêm tùy chọn này để hỗ trợ kéo bằng chuột
  });

  // Tính toán chỉ số kết thúc để đảm bảo hiển thị 4 hình liên tục
  const endIndex = currentIndex + 4;
  const imagesToShow = promotionalData.slice(currentIndex, endIndex);

  // Nếu số lượng hình ảnh không đủ 4 thì bổ sung thêm từ đầu danh sách
  if (imagesToShow.length < 4) {
    imagesToShow.push(...promotionalData.slice(0, 4 - imagesToShow.length));
  }

  return (
    <div {...handlers} className="px-[10%] mb-10 cursor-pointer">
      <div className="flex items-center mb-10">
        <span className="block w-1 h-8 bg-blue-700 mr-2"></span>
        <p className="text-xl font-sans font-bold">TIN KHUYẾN MÃI</p>
      </div>
      <div className="flex overflow-hidden">
        {imagesToShow.map((promo, index) => (
          <div key={index} className="w-1/4 p-2 mx-[7.5px]">
            <img
              src={promo.img}
              alt={`Khuyến mãi ${index + 1}`}
              className="w-full h-auto mb-3"
            />
            <p className="text-center font-sans font-bold hover:text-blue-800">{promo.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Promotional;
