import React, { useState, useEffect } from "react";
import Link from "next/link";
import moment, { Moment } from "moment";
import "moment/locale/vi"; // Import ngôn ngữ tiếng Việt cho moment
import { log } from "console";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

interface Movie {
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

interface Theater {
  name: string;
  format: string;
  time: string[];
}

interface Showtime {
  movieTitle?: string;
  theaterName: string;
  format: string;
  date: string;
  dayOfWeek: string;
  time: string;
  soT?: string;
  image?: string;
  showtimeDetails: string;
}

const theaterData: Record<string, Theater[]> = {
  "Toàn quốc": [
    {
      name: "Galaxy Nguyễn Du",
      format: "2D Phụ Đề",
      time: [
        "14:45",
        "15:30",
        "16:30",
        "17:15",
        "18:15",
        "19:15",
        "20:15",
        "21:15",
        "22:15",
      ],
    },
    {
      name: "Galaxy Hồ Chí Minh",
      format: "3D Phụ Đề",
      time: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    },
  ],
};

const MovieInformation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [selectedRegion, setSelectedRegion] = useState<string>("Toàn quốc");
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [theaters, setTheaters] = useState<Theater[]>(theaterData["Toàn quốc"]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTrailerModalVisible, setIsTrailerModalVisible] =
    useState<boolean>(false); // State để điều khiển modal trailer
  const router = useRouter();

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setTheaters(theaterData[region] || []);
    setSelectedTheater("");
  };

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

  console.log("Thông tin chi tiết:", movie);

  const handleTimeClick = (theater: Theater, showtime: string) => {
    const selectedShowtime: Showtime = {
      movieTitle: movie?.title,
      theaterName: theater.name,
      format: theater.format,
      date: selectedDate.format("DD/MM/YYYY"),
      dayOfWeek: selectedDate.format("dddd"),
      time: showtime,
      // soT: movie?.soT,
      // image: movie?.image,
      showtimeDetails: `${selectedDate.format("DD/MM/YYYY")} - ${showtime}`,
    };
    localStorage.setItem("selectedShowtime", JSON.stringify(selectedShowtime));

    // Điều hướng sang trang  choose-seat
    router.push("/choose-seat");
  };

  return (
    <div>
      {/* Hình ảnh chính */}
      <div className="relative flex justify-center w-full h-[500px] bg-black">
        <div className="absolute w-full h-full z-[300] bg-[#0003]"></div>
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

                <button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[400]"
                  onClick={() => setIsTrailerModalVisible(true)}
                >
                  <img
                    src="https://www.galaxycine.vn/_next/static/media/button-play.2f9c0030.png"
                    alt="button-play"
                    className="w-[40px] h-[40px] lg:w-[64px] lg:h-[64px] object-cover"
                  />
                </button>
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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 "
          onClick={() => setIsTrailerModalVisible(false)} // Đóng modal khi click ra ngoài
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
                  <button
                    key={index}
                    className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400"
                  >
                    {producer.name}
                  </button>
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
          <p className="text-justify text-sm leading-6">{movie.content}</p>
        ) : (
          <div>Loading movie content...</div>
        )}
      </div>

      {/* Lịch chiếu */}
      <div className="px-[13%] py-1">
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

          {/* Bộ lọc khu vực và rạp */}
          <div className="flex items-center mb-4 space-x-6">
            <select
              className="border border-gray-300 rounded-md p-2 w-48 transition-all duration-300 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
            >
              {Object.keys(theaterData).map((region, index) => (
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
        </div>

        {/* Danh sách rạp và suất chiếu */}
        <div className="space-y-4">
          {theaters
            .filter(
              (theater) =>
                !selectedTheater ||
                theater.name === selectedTheater ||
                selectedTheater === ""
            )
            .map((theater, index) => (
              <div key={index} className="p-4 border rounded-md">
                <h3 className="font-bold mb-2">{theater.name}</h3>
                <div className="flex items-center justify-start mb-2">
                  <p className="text-sm mr-20">{theater.format}</p>
                  <div className="grid grid-cols-6 gap-2">
                    {theater.time.map((showtime, idx) => (
                      <button
                        key={idx}
                        className="px-6 py-1.5 rounded-md border bg-gray-100 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-400"
                        style={{ width: "100px" }}
                        onClick={() => handleTimeClick(theater, showtime)} // Thêm sự kiện onClick
                      >
                        {showtime}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieInformation;
