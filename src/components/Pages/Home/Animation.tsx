import React, {useEffect, useState} from 'react';
import images from '@/variables/client/animation';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import Image from "next/image";

function Animation() {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % images.length
            );
        }, 10000); // Chuyển đổi hình ảnh sau mỗi 10 giây

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + images.length) % images.length
        );
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        );
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const getPreviousImageIndex = () => {
        return (currentImageIndex - 1 + images.length) % images.length;
    };

    const getNextImageIndex = () => {
        return (currentImageIndex + 1) % images.length;
    };

    return (
        <div className="relative flex items-center justify-center overflow-hidden h-[360px] mb-20">
            {/* Nút trái */}
            <button
                className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-3 rounded-full z-10"
                onClick={goToPreviousImage}
            >
                <FaChevronLeft/>
            </button>

            {/* Hình ảnh trước, giữa và sau */}
            <div className="relative flex items-center justify-center w-full h-full">
                {/* Hình ảnh bên trái */}
                <div className="absolute left-[-45px] w-1/6 h-full flex justify-center items-center">
                    <img
                        src={images[getPreviousImageIndex()]}
                        alt="Previous Slide"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Hình ảnh giữa */}
                <div className="w-4/6 h-full flex justify-center items-center">
                    <img
                        src={images[currentImageIndex]}
                        alt="Slideshow"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Hình ảnh bên phải */}
                <div className="absolute right-[-45px] w-1/6 h-full flex justify-center items-center">
                    <img
                        src={images[getNextImageIndex()]}
                        alt="Next Slide"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Nút phải */}
            <button
                className="absolute right-[-18px] top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-3 rounded-full z-10"
                onClick={goToNextImage}
            >
                <FaChevronRight/>
            </button>

            {/* Vòng tròn hiển thị vị trí */}
            <div className="absolute bottom-4 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-gray-500'
                        }`}
                        onClick={() => goToImage(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Animation;
