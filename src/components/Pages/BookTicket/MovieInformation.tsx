import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import moment, { Moment } from "moment";
import "moment/locale/vi"; // Import ngôn ngữ tiếng Việt cho moment
import { log } from "console";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { da, ro } from "@faker-js/faker";

interface Movie {
  id: number;
  imagePortrait: string;
  title: string;
  code: string;
  duration: number;
  releaseDate: string;
  rating: number;
  country: string;
  age: number;
  summary: string;
  status: string;
  producers: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  directors: Array<{ name: string }>;
  actors: Array<{ name: string }>;
  content: string;
  trailer: string;
}

interface Cinema {
  id: number;
  name: string;
  format: string;
  time: string[];
  city: {
    name: string;
  };
}

interface Room {
  name: string;
  rommId: number;
}

interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  cinemaName: string;
  startDate: string;
  room: Room;
  bookedSeat: number;
  totalSeat: number;
}

const MovieInformation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTrailerModalVisible, setIsTrailerModalVisible] =
    useState<boolean>(false); // State để điều khiển modal trailer
  const router = useRouter();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [theaters, setTheaters] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(
    null
  );

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const modalRef = useRef(null);

  const daysArray = Array.from({ length: 6 }, (_, i) => {
    const dayMoment = moment().add(i, "days");
    return {
      dayOfWeek: dayMoment.isSame(moment(), "day")
        ? "Hôm nay"
        : dayMoment.format("dddd").charAt(0).toUpperCase() +
          dayMoment.format("dddd").slice(1),
      date: dayMoment.format("DD/MM"),
      dayMoment,
    };
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const slug = localStorage.getItem("slug");
      console.log("Slug từ localStorage:", slug); // Kiểm tra giá trị của slug

      if (slug) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/movies/${slug}`
          );
          console.log("Dữ liệu phim nhận được từ API:", response.data.data); // Kiểm tra dữ liệu nhận được từ API
          setMovie(response.data.data); // Cập nhật state với dữ liệu từ API
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      } else {
        console.error("Slug không có trong localStorage");
      }
    };

    fetchMovieDetails();
  }, []);

  console.log("Movie data:", movie); // Kiểm tra dữ liệu phim

  // Get cinemas
  useEffect(() => {
    const fetchCinemas = async () => {
      setLoading(true); // Bật trạng thái loading
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/cinemas"
        );
        const cinemasData = response.data;

        console.log("Full API response:", cinemasData); // In toàn bộ dữ liệu phản hồi

        if (cinemasData && cinemasData.data) {
          setCinemas(cinemasData.data); // Lưu trữ danh sách rạp chiếu phim từ API
          localStorage.setItem("cinemas", JSON.stringify(cinemasData.data));
        } else {
          console.error("Data structure not as expected:", cinemasData);
          setCinemas([]); // Nếu không có dữ liệu, để rỗng
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchCinemas();
  }, []);

  useEffect(() => {
    // Lấy danh sách khu vực từ dữ liệu cinemas
    const uniqueRegions = Array.from(
      new Set(cinemas.map((cinema) => cinema.city.name))
    );
    setRegions(uniqueRegions);
  }, [cinemas]);

  useEffect(() => {
    // Cập nhật danh sách rạp khi khu vực thay đổi
    if (selectedRegion) {
      const filteredTheaters = cinemas.filter(
        (cinema) => cinema.city.name === selectedRegion
      );
      setTheaters(filteredTheaters);
      setSelectedTheater(""); // Đặt lại giá trị rạp đã chọn
      setSelectedTheaterId(null); // Đặt lại ID của rạp đã chọn
    } else {
      setTheaters(cinemas); // Hiển thị tất cả rạp nếu không chọn khu vực
    }
  }, [selectedRegion, cinemas]);

  // Hiển thị rạp đã chọn
  useEffect(() => {
    if (selectedTheater) {
      const selectedTheaterData = theaters.find(
        (theater) => theater.name === selectedTheater
      );
      // luu id rạp đã chọn vào state
      setSelectedTheaterId(selectedTheaterData?.id || null);
    }
  }, [selectedTheater, theaters]);

  // Hiển thị id rạp đã chọn
  console.log("Rạp đã chọn:", selectedTheater);
  console.log("ID rạp đã chọn:", selectedTheaterId);
  // Hiển thị ngày đã chọn
  console.log("Ngày đã chọn:", selectedDate.format("DD/MM/YYYY"));
  // Hiển thị movie id
  console.log("ID phim:", movie?.id);

  //handleRegionChange
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  // API showtime
  useEffect(() => {
    const fetchShowTimes = async () => {
      if (movie?.id) {
        const movieId = movie.id;
        const date = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
        const cinemaId = selectedTheaterId;

        try {
          let response;
          if (date && cinemaId) {
            // Gọi API khi đã chọn date và cinemaId
            response = await axios.get(
              `http://localhost:8080/api/v1/show-times?movieId=${movieId}&date=${date}&cinemaId=${cinemaId}`
            );
          } else {
            // Gọi API chỉ với movieId khi chưa chọn date và cinemaId
            response = await axios.get(
              `http://localhost:8080/api/v1/show-times?movieId=${movieId}`
            );
          }

          setShowtimes(response.data.data); // Giả sử dữ liệu cần nằm trong response.data.data
        } catch (error) {
          console.error("Error fetching showtimes:", error);
        }
      }
    };

    fetchShowTimes();
  }, [movie, selectedDate, selectedTheaterId]);

  // Hiển thị showtimes dữ liệu từ API startTime, cinemaName, room
  console.log(
    "Danh sách suất chiếu:",
    showtimes.map(
      (showtime) =>
        showtime.startTime +
        " - " +
        showtime.cinemaName +
        " - " +
        showtime.room.name
    )
  );

  // Hiển thị showtimes  "id": "e3b257d1-aa0e-4df2-8f18-69dae6620cd4", showtime.id đã chọn

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const { cinemaName, room, id, startTime } = showtime;

    // Nếu cinema chưa tồn tại trong acc, tạo mới
    if (!acc[cinemaName]) {
      acc[cinemaName] = {};
    }

    // Nếu room chưa tồn tại trong cinema, tạo mới
    if (!acc[cinemaName][room.name]) {
      acc[cinemaName][room.name] = [];
    }

    // Thêm đối tượng chứa giờ chiếu và id vào room
    acc[cinemaName][room.name].push({ id, startTime });

    return acc;
  }, {} as Record<string, Record<string, { id: string; startTime: string }[]>>);

  // Lấy giá trị của accessToken từ localStorage
  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);
  console.log("accessToken:", accessToken);
  

  // Hàm xử lý khi người dùng nhấp vào giờ chiếu
  const handleTimeClick = async (theater: Cinema, showtimeId: string) => {
    // Hiển thị showtimeId
    console.log("ID suất chiếu đã chọn:", showtimeId);
  
    // Tìm kiếm thông tin về suất chiếu dựa trên showtimeId
    let selectedShowtime: { id: string; startTime: string } | undefined;
    let roomName: string | undefined; // Biến để lưu tên phòng
  
    // Duyệt qua groupedShowtimes để tìm suất chiếu đã chọn
    for (const cinemaName in groupedShowtimes) {
      for (const room in groupedShowtimes[cinemaName]) {
        const showtimes = groupedShowtimes[cinemaName][room];
        selectedShowtime = showtimes.find(showtime => showtime.id === showtimeId);
  
        if (selectedShowtime) {
          roomName = room; // Lưu tên phòng nếu tìm thấy
          break; // Nếu đã tìm thấy, dừng vòng lặp
        }
      }
      if (selectedShowtime) {
        break; // Dừng vòng lặp bên ngoài nếu đã tìm thấy
      }
    }
  
    console.log(
      "Cấu trúc groupedShowtimes:",
      JSON.stringify(groupedShowtimes, null, 2)
    ); // Kiểm tra cấu trúc
  
    if (selectedShowtime) {
      // Tạo thông tin truyền qua trang choose-seat
      const infomationtransfer = {
        image: movie?.imagePortrait,
        movieTitle: movie?.title,
        age: movie?.age,
        cinemaName: theater.name,
        roomName: roomName || "Không tìm thấy rạp", // Lưu tên phòng đã chọn
        time: selectedShowtime.startTime, // Lấy startTime từ suất chiếu đã chọn
        date: selectedDate.format("DD/MM/YYYY"),
        roomId: selectedTheaterId,
        showtimeId: selectedShowtime.id, // Lấy id của suất chiếu đã chọn
        // orderID của API tạo hóa đơn Response từ API tạo hóa đơn: id: "b72f4034-14d2-4c57-bfd8-547057b33a99" đã tạo
        
  
        // Truyền thứ đã chọn
        dayOfWeek: selectedDate.format("dddd").charAt(0).toUpperCase() + selectedDate.format("dddd").slice(1),
      };
  
      console.log("Thông tin truyền qua trang choose-seat:", infomationtransfer);
  
      // Lưu thông tin vào localStorage
      localStorage.setItem("showtime", JSON.stringify(infomationtransfer));
  
      // Gọi API tạo hóa đơn
      // try {
      //   const response = await axios.post(
      //     'http://localhost:8080/api/v1/orders',
      //     {
      //       showTimeId: showtimeId, // ID suất chiếu đã chọn
      //       seatIds: [0] // giá trị cố định cho ghế
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${accessToken}` // Truyền token từ localStorage
      //       }
      //     }
      //   );
      
      //   // Kiểm tra phản hồi API
      //   if (response.status === 200 || response.status === 201) {
      //     // Lấy dữ liệu trả về từ API
      //     const orderData = response.data.data; // Truy cập vào 'data' trong phản hồi
      //     console.log("Response từ API tạo hóa đơn:", orderData);
      
      //     // Lấy orderID từ orderData.id
      //     const orderId = orderData.id;
      
      //     if (orderId) {
      //       // Lưu orderID vào localStorage nếu tìm thấy
      //       localStorage.setItem("orderID", orderId);
      //       console.log("orderID lưu vào localStorage:", orderId);
      //     } else {
      //       console.error("Không tìm thấy orderID trong phản hồi API.");
      //     }
      
      //     // Điều hướng sang trang choose-seat
      //     router.push("/choose-seat");
      //   } else {
      //     console.error("Phản hồi không thành công:", response.status);
      //   }
      // } catch (error) {
      //   console.error("Lỗi khi gọi API tạo hóa đơn:", error);
      // }
      
      router.push("/choose-seat");
      
    } else {
      console.error("Không tìm thấy suất chiếu với ID:", showtimeId);
    }
  };
  
  

  return (
    <div>
      {/* Hình ảnh chính */}
      <div className="relative flex justify-center bg-black">
        <div className="absolute w-full"></div>
        <div className="relative h-full">
          <div className="absolute top-0 -left-[0%] z-100">
            <img
              alt="Blur Left"
              src="https://www.galaxycine.vn/_next/static/media/blur-left.7a4f1851.png"
              className="w-full lg:h-[500px] object-cover lg:block hidden"
              decoding="async"
              width={342}
              height={680}
            />
          </div>
          <div className="relative">
            {movie ? (
              <>
                <img
                  src={movie.imagePortrait}
                  alt="movie"
                  className="w-[860px] h-full md:h-full lg:h-[500px] object-cover duration-500 ease-in-out group-hover:opacity-100"
                />

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                  <button onClick={() => setIsTrailerModalVisible(true)}>
                    <img
                      src="https://www.galaxycine.vn/_next/static/media/button-play.2f9c0030.png"
                      alt="button-play"
                      className="w-[40px] h-[40px] lg:w-[64px] lg:h-[64px] object-cover"
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Loading...
              </div>
            )}
          </div>
          <div className="absolute top-0 -right-[0%] z-100 lg:block hidden">
            <img
              alt="Blur Right"
              src="https://www.galaxycine.vn/_next/static/media/blur-right.52fdcf99.png"
              className="w-full lg:h-[500px] object-cover"
              decoding="async"
              width={342}
              height={680}
            />
          </div>
        </div>
      </div>
      {/* Modal hiển thị trailer */}
      {isTrailerModalVisible && movie && (
        <div
          className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsTrailerModalVisible(false)} // Đóng modal khi click ra ngoài
          tabIndex={-1} // Thêm tabIndex để có thể focus
          ref={modalRef} // Gán ref cho modal
        >
          <div
            className="bg-black p-4 rounded-lg shadow-lg w-full max-w-7xl relative"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn việc đóng modal khi click vào bên trong modal
          >
            <ReactPlayer
              url={movie.trailer} // Đường dẫn trailer từ movie data
              controls
              width="100%"
              height="520px"
            />
          </div>
        </div>
      )}

      {/* Chia layout cho hình bên trái và thông tin bên phải */}
      <div className="relative flex w-full mt-[-50px] ml-[200px]">
        <div className="relative w-[280px] h-[420px] bg-black border-2 border-white mx-auto mb-5 z-30">
          {movie ? (
            <img
              src={movie.imagePortrait}
              alt={movie.title}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Loading...
            </div>
          )}
        </div>

        <div className="flex-1 px-10 py-8 mt-20">
          {movie ? (
            <>
              <div className="flex items-center justify-start mb-2">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                <button className="bg-orange-500 text-white px-2 py-1 rounded-md text-[14px] font-bold ml-5">
                  T{movie.age}
                </button>
              </div>
              <div className="flex items-center justify-start text-[14px] font-sans mb-3">
                <div className="flex justify-start mr-8">
                  <img
                    src="../image/time.png"
                    alt="time"
                    className="w-[16px] h-[16px] object-cover mt-0.5 mr-1"
                  />
                  {movie.duration} phút
                </div>
                <div className="flex">
                  <img
                    src="../image/date.png"
                    alt="calendar"
                    className="w-[16px] h-[16px] object-cover mt-0.5 mr-1"
                  />
                  {moment(movie.releaseDate).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="flex items-center justify-start text-[18px] font-sans mb-3">
                <img
                  src="../image/star.png"
                  alt="star"
                  className="w-[25px] h-[25px] object-cover -mt-0.5 mr-1"
                />
                {movie.rating}
              </div>
              <div className="mb-3">
                <span className="mr-3 font-sans">Quốc gia:</span>{" "}
                {movie.country}
              </div>
              <div className="mb-3">
                <span className="mr-3 font-sans">Nhà sản xuất:</span>{" "}
                {movie.producers.map((producer, index) => (
                  <span key={index}>{producer.name}</span>
                ))}
              </div>

              <div className="mb-2">
                <span className="mr-3 font-sans">Thể loại:</span>
                {movie.genres.map((genre, index) => (
                  <button
                    key={index}
                    className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
              <div className="mb-2">
                <span className="mr-3 font-sans">Đạo diễn:</span>
                {movie.directors.map((director, index) => (
                  <button
                    key={index}
                    className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400"
                  >
                    {director.name}
                  </button>
                ))}
              </div>
              <div className="mb-3">
                <span className="mr-3 font-sans">Diễn viên:</span>
                {movie.actors.length > 0 ? (
                  movie.actors.map((actor, index) => (
                    <button
                      key={index}
                      className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400"
                    >
                      {actor.name}
                    </button>
                  ))
                ) : (
                  <p>Thông tin diễn viên không có sẵn</p>
                )}
              </div>
            </>
          ) : (
            <div>Loading movie details...</div>
          )}
        </div>
      </div>

      {/* Nội dung phim */}
      <div className="px-[13%] py-1 mb-10">
        <div className="flex items-center mb-5">
          <span className="block w-1 h-8 bg-blue-700 mr-2"></span>
          <p className="text-xl font-sans font-bold">Nội Dung Phim</p>
        </div>
        {movie ? (
          <p className="text-justify text-sm leading-6">{movie.summary}</p>
        ) : (
          <div>Loading movie content...</div>
        )}
      </div>

      {/* Lịch chiếu */}
      <div className="px-[13%] py-0">
        <div className="flex items-center mb-5">
          <span className="block w-1 h-8 bg-blue-700 mr-2"></span>
          <p className="text-xl font-sans font-bold">Lịch chiếu</p>
        </div>

        {/* Dòng ngày chiếu */}
        <div className="flex items-center justify-around mb-4">
          <div className="flex items-center mb-4 space-x-2 overflow-x-auto">
            {daysArray.map((day, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md border ${
                  selectedDate.isSame(day.dayMoment, "day")
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedDate(day.dayMoment)}
              >
                <div className="text-sm font-bold">{day.dayOfWeek}</div>
                <div className="text-xs">{day.date}</div>
              </button>
            ))}
          </div>

          {/* Hiển thị khu vực và rạp */}
          <div className="flex items-center mb-4 space-x-6">
            <select
              className="border border-gray-300 rounded-md p-2 w-48 transition-all duration-300 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
            >
              <option value="">Chọn khu vực</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-md p-2 w-48 transition-all duration-300 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={selectedTheater}
              onChange={(e) => setSelectedTheater(e.target.value)}
            >
              <option value="">Tất cả rạp</option>
              {theaters.map((theater, index) => (
                <option key={index} value={theater.name}>
                  {theater.name}
                </option>
              ))}
            </select>
          </div>
          {/* Danh sách rạp và suất chiếu */}
        </div>
        <div className="space-y-4">
          {Object.entries(groupedShowtimes).map(([cinemaName, rooms]) => (
            <div key={cinemaName} className="p-4 border rounded-md">
              <h3 className="font-bold mb-2">{cinemaName}</h3>
              {Object.entries(rooms).map(([roomName, times]) => (
                <div
                  key={roomName}
                  className="flex items-center space-x-10 mb-4"
                >
                  {/* Tên rạp chiếu - chiếm 12.5% */}
                  <div className="w-1/7 ml-6">
                    {" "}
                    {/* Sửa lại kích thước để phù hợp */}
                    <p className="text-sm font-semibold">{roomName}</p>
                  </div>

                  {/* Danh sách giờ chiếu - chiếm 87.5% */}
                  <div className="w-6/7 flex flex-wrap items-center justify-start space-x-2">
                    {" "}
                    {/* Sửa lại kích thước */}
                    {times.slice(0, 8).map(({ id, startTime }) => (
                      <button
                        key={id}
                        className="mx-1  px-1 py-1 rounded-md border bg-gray-100 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-200" // Tăng độ mượt cho hiệu ứng
                        style={{ width: "90px", justifyContent: "center" }}
                        onClick={() =>
                          handleTimeClick(
                            theaters.find(
                              (theater) => theater.name === cinemaName
                            )!,
                            id
                            // Thay đổi từ startTime thành id
                            // Lấy name của rạp chiếu để truyền vào hàm handleTimeClick
                          )
                        }
                      >
                        {startTime.slice(0, 5)} {/* Hiển thị giờ */}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieInformation;
