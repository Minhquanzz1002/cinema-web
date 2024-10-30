import React, { useEffect, useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import Link from 'next/link';

function Movie() {
    const [activeTab, setActiveTab] = useState<string>('nowShowing'); // Trạng thái của tab hiện tại
    const [movies, setMovies] = useState<any[]>([]); // Khởi tạo movies là một mảng rỗng
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/movies');
                const result = await response.json();

                console.log('Full API response:', result); // In toàn bộ dữ liệu phản hồi

                if (result && result.data && result.data.content) {
                    setMovies(result.data.content); // Lưu trữ danh sách phim từ API
                } else {
                    console.error('Data structure not as expected:', result);
                    setMovies([]); // Nếu không có dữ liệu, để rỗng
                }

                setLoading(false); // Tắt trạng thái loading
            } catch (error) {
                console.error('Error fetching movies:', error);
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
            movie =>
                activeTab === 'nowShowing'
                    ? movie.status?.toUpperCase() === 'ACTIVE' // Sử dụng toUpperCase() để so sánh không phân biệt chữ hoa/thường
                    : movie.status?.toUpperCase() === 'COMING_SOON', // Sửa lỗi trong điều kiện lọc
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
            ageRating: movie.ageRating,
        };

        console.log('Movie data to save:', movieData);
        localStorage.setItem('selectedMovie', JSON.stringify(movieData));

        localStorage.setItem('slug', movie.slug);
    };

    if (loading) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="mb-10 border-b-[4px] px-[10%]">
            <div className="relative mb-10 flex items-center">
                <span className="mr-2 block h-8 w-1 bg-blue-700"></span>
                <p className="mr-10 font-sans text-xl font-bold">GÓC ĐIỆN ẢNH</p>
                <div className="relative flex space-x-0">
                    <button
                        className={`relative px-4 py-2 text-center font-bold ${
                            activeTab === 'nowShowing' ? 'text-blue-700' : 'text-gray-600'
                        }`}
                        onClick={() => handleTabChange('nowShowing')}
                    >
                        Đang chiếu
                        {activeTab === 'nowShowing' && (
                            <div className="absolute bottom-0 left-9 h-0.5 w-[50px] bg-blue-700"></div>
                        )}
                    </button>
                    <button
                        className={`relative px-4 py-2 text-center font-bold ${
                            activeTab === 'comingSoon' ? 'text-blue-700' : 'text-gray-600'
                        }`}
                        onClick={() => handleTabChange('comingSoon')}
                    >
                        Sắp chiếu
                        {activeTab === 'comingSoon' && (
                            <div className="absolute bottom-0 left-6 h-0.5 w-[50px] bg-blue-700"></div>
                        )}
                    </button>
                </div>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {displayedMovies.length > 0 ? (
                    displayedMovies.map(movie => (
                        <Link
                            key={movie.id}
                            href={{
                                pathname: '/booking',
                                query: { slug: movie.slug }, // Thêm dữ liệu muốn truyền
                            }}
                        >
                            <div
                                className="relative cursor-pointer p-2 transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={() => handleMovieClick(movie)}
                            >
                                <img
                                    src={movie.imagePortrait}
                                    alt={movie.title}
                                    className="mb-2 h-[394px] w-full rounded-md object-cover" // Sử dụng w-full để hình ảnh chiếm toàn bộ chiều rộng của cột
                                />
                                <h2 className="text-lg font-bold">{movie.title}</h2>
                                {/* Container thông tin ở góc dưới bên phải */}
                                <div className="absolute bottom-20 right-0 p-2 text-white">
                                    <div className="flex items-center justify-center gap-1 bg-black bg-opacity-60">
                                        <img
                                            src="/image/star.png"
                                            alt="star"
                                            className="ml-3 mr-2 h-4 w-4"
                                        />
                                        <p className="mr-2 text-[17px] font-bold">
                                            {movie.rating} {/* Hiển thị chỉ số đánh giá */}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute bottom-11 right-2 flex items-center p-2 font-bold text-white">
                                    <button className="h-8 rounded-md bg-orange-500 px-3 py-1 text-xs text-white sm:text-sm md:text-base lg:text-lg">
                                        {movie.ageRating} {/* Hiển thị mã số của phim */}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Không có phim nào để hiển thị.</p>
                )}
            </div>

            <div className="mb-10 flex items-center justify-center">
                <Link
                    className="flex items-center rounded-[5px] border border-orange-600 px-6 py-2 font-semibold text-orange-600 transition duration-300 hover:bg-orange-500 hover:text-white"
                    href={'movie-detail'}
                >
                    Xem thêm
                    <RiArrowRightSLine className="ml-2" />
                </Link>
            </div>
        </div>
    );
}

export default Movie;
