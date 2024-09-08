import React, {useState} from "react";
import movies from "@/variables/client/movie"; // Import danh sách phim từ file movie.js
import {RiArrowRightSLine} from "react-icons/ri";
import Link from "next/link"; // Import icon từ react-icons

function Movie() {
    const [activeTab, setActiveTab] = useState<string>("nowShowing");  // Trạng thái của tab hiện tại

    // Hàm thay đổi tab
    const handleTabChange = (tab : string) => {
        setActiveTab(tab);  // Cập nhật trạng thái khi tab thay đổi
    };

    // Lọc phim theo trạng thái (Đang chiếu hoặc Sắp chiếu)
    const filteredMovies = movies.filter((movie) =>
        activeTab === "nowShowing"
            ? movie.status.includes("Đang chiếu")
            : movie.status.includes("Sắp chiếu")
    );

    // Giới hạn số lượng phim hiển thị là 8
    const displayedMovies = filteredMovies.slice(0, 8);

    // Hàm xử lý khi nhấn vào một phim
    const handleMovieClick = (movie : any) => {
        // Lưu dữ liệu phim vào localStorage
        const movieData = {
            image: movie.image,
            title: movie.title,
            soT: movie.soT,
            time: movie.time,
            date: movie.date,
            numberStar: movie.numberStar,
            nation: movie.nation,
            manufacturer: movie.manufacturer,
            genre: movie.genre,
            director: movie.director,
            performer: movie.performer,
            status: movie.status,
            content: movie.content,
            showtimes: movie.showtimes,
            theater: movie.theater,
        };

        console.log("Movie data to save:", movieData); // In ra dữ liệu trước khi lưu

        // Sử dụng JSON.stringify để chuyển đổi đối tượng thành chuỗi JSON
        localStorage.setItem('selectedMovie', JSON.stringify(movieData));
    };

    return (
        <div className="px-[10%] mb-10 border-b-[4px]">
            <div className="relative flex items-center mb-10">
                <span className="block w-1 h-8 bg-blue-700 mr-2"></span>
                <p className="text-xl font-sans font-bold mr-10">GÓC ĐIỆN ẢNH</p>
                <div className="flex space-x-0 relative">
                    <button
                        className={`py-2 px-4 text-center font-bold relative ${
                            activeTab === "nowShowing" ? "text-blue-700" : "text-gray-600"
                        }`}
                        onClick={() => handleTabChange("nowShowing")}
                    >
                        Đang chiếu
                        {activeTab === "nowShowing" && (
                            <div className="absolute bottom-0 left-9 w-[50px] h-0.5 bg-blue-700"></div>
                        )}
                    </button>
                    <button
                        className={`py-2 px-4 text-center font-bold relative ${
                            activeTab === "comingSoon" ? "text-blue-700" : "text-gray-600"
                        }`}
                        onClick={() => handleTabChange("comingSoon")}
                    >
                        Sắp chiếu
                        {activeTab === "comingSoon" && (
                            <div className="absolute bottom-0 left-6 w-[50px] h-0.5 bg-blue-700"></div>
                        )}
                    </button>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-4 gap-4 mb-10">
                    {displayedMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative p-2 cursor-pointer"
                            onClick={() => handleMovieClick(movie)}  // Gọi handleMovieClick khi nhấn vào phim
                        >
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-auto mb-2 rounded-md"
                            />
                            <h2 className="text-lg font-bold">{movie.title}</h2>

                            {/* Container thông tin ở góc dưới bên phải */}
                            <div className="absolute bottom-20 right-0 text-white p-2">
                                <div className="flex items-center justify-center bg-black bg-opacity-60 gap-1">
                                    <img
                                        src="/image/star.png"
                                        alt="star"
                                        className="w-4 h-4 mr-2 ml-3"
                                    />
                                    <p className="text-[17px] font-bold mr-2">
                                        {movie.numberStar.split(" ")[0]} {/* Hiển thị chỉ số đánh giá */}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute bottom-11 right-2 text-white font-bold text-[14px] p-2">
                                <button
                                    className="py-1 px-2 text-white bg-orange-500 rounded-md h-8 justify-center items-center">
                                    {movie.soT} {/* Hiển thị mã số của phim */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center mb-10">
                <Link
                    className="flex items-center px-6 py-2 border border-orange-600 text-orange-600 font-semibold rounded-[5px] hover:text-white hover:bg-orange-500 transition duration-300"
                    href={""}>
                    Xem thêm
                    <RiArrowRightSLine className="ml-2"/>
                </Link>
                {/*<button*/}
                {/*    */}
                {/*    onClick={handleViewMore}  // Sự kiện onClick để điều hướng*/}
                {/*>*/}
                {/*    Xem thêm*/}
                {/*    <RiArrowRightSLine className="ml-2"/>*/}
                {/*</button>*/}
            </div>
        </div>
    );
}

export default Movie;
