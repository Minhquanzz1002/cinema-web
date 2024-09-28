import React, { useEffect, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";

function Movie() {
  const [activeTab, setActiveTab] = useState<string>("nowShowing"); // Trạng thái của tab hiện tại
  const [movies, setMovies] = useState<any[]>([]); // Khởi tạo movies là một mảng rỗng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/movies");
        const result = await response.json();

        console.log("Full API response:", result); // In toàn bộ dữ liệu phản hồi

        if (result && result.data && result.data.content) {
          setMovies(result.data.content); // Lưu trữ danh sách phim từ API
        } else {
          console.error("Data structure not as expected:", result);
          setMovies([]); // Nếu không có dữ liệu, để rỗng
        }

        setLoading(false); // Tắt trạng thái loading
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Hàm thay đổi tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab); // Cập nhật trạng thái khi tab thay đổi
  };

  // Lọc phim theo trạng thái (Đang chiếu hoặc Sắp chiếu)
  const filteredMovies =
    movies?.filter(
      (movie) =>
        activeTab === "nowShowing"
          ? movie.status?.toUpperCase() === "ACTIVE" // Sử dụng toUpperCase() để so sánh không phân biệt chữ hoa/thường
          : movie.status?.toUpperCase() === "COMING_SOON" // Sửa lỗi trong điều kiện lọc
    ) || []; // Đảm bảo filteredMovies luôn là một mảng

  // Giới hạn số lượng phim hiển thị là 8
  const displayedMovies = filteredMovies.slice(0, 8);

  // Hàm xử lý khi nhấn vào một phim
  const handleMovieClick = (movie: any) => {
    const movieData = {
      image: movie.imagePortrait,
      title: movie.title,
      status: movie.status,
      slug: movie.slug,
      rating: movie.rating, 
      age: movie.age, 
    };

    console.log("Movie data to save:", movieData);
    localStorage.setItem("selectedMovie", JSON.stringify(movieData));

    localStorage.setItem("slug", movie.slug);
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
  }

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

      <div className="grid grid-cols-4 gap-4 mb-10">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <Link key={movie.id} href="/booking">
              <div
                className="relative p-2 cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                <img
                  src={movie.imagePortrait}
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
                      {movie.rating} {/* Hiển thị chỉ số đánh giá */}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-11 right-2 text-white font-bold text-[14px] p-2">
                  <button className="py-1 px-2 text-white bg-orange-500 rounded-md h-8 justify-center items-center">
                    T{movie.age} {/* Hiển thị mã số của phim */}
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Không có phim nào để hiển thị.</p>
        )}
      </div>

      <div className="flex items-center justify-center mb-10">
        <Link
          className="flex items-center px-6 py-2 border border-orange-600 text-orange-600 font-semibold rounded-[5px] hover:text-white hover:bg-orange-500 transition duration-300"
          href={"movie-detail"}
        >
          Xem thêm
          <RiArrowRightSLine className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default Movie;
