import React, { useState, useEffect } from "react";
import Link from "next/link";
import moment, { Moment } from "moment";
import "moment/locale/vi"; // Import ngôn ngữ tiếng Việt cho moment

interface Movie {
  image: string;
  title: string;
  soT: string;
  time: string;
  date: string;
  numberStar: string;
  nation: string;
  manufacturer: string;
  genre: string[];
  director: string[] | string;
  performer: string[] | string;
  status: string;
  content: string;
  showtimes: string[];
  theater: string;
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
      time: ["14:45", "15:30", "16:30", "17:15", "18:15", "19:15", "20:15", "21:15", "22:15"],
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

  useEffect(() => {
    const storedMovie = localStorage.getItem("selectedMovie");
    if (storedMovie) {
      setMovie(JSON.parse(storedMovie));
    }
  }, []);

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
        : dayMoment.format("dddd").charAt(0).toUpperCase() + dayMoment.format("dddd").slice(1),
      date: dayMoment.format("DD/MM"),
      dayMoment,
    };
  });

  const handleTimeClick = (theater: Theater, showtime: string) => {
    const selectedShowtime: Showtime = {
      movieTitle: movie?.title,
      theaterName: theater.name,
      format: theater.format,
      date: selectedDate.format("DD/MM/YYYY"),
      dayOfWeek: selectedDate.format("dddd"),
      time: showtime,
      soT: movie?.soT,
      image: movie?.image,
      showtimeDetails: `${selectedDate.format("DD/MM/YYYY")} - ${showtime}`,
    };
    localStorage.setItem("selectedShowtime", JSON.stringify(selectedShowtime));

    // Điều hướng sang trang  choose-seat
    window.location.href = "/choose-seat";
  };

  return (
    <div>
      {/* Hình ảnh chính */}
      <div className="relative flex justify-center w-full h-[500px] bg-black">
        <div className="absolute w-full h-full z-[300] bg-[#0003]"></div>
        <div className="relative h-full ">
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
                  src={movie.image}
                  alt={movie.title}
                  className='w-[860px] h-full md:h-full lg:h-[500px] object-cover duration-500 ease-in-out group-hover:opacity-100"
                          scale-100 blur-0 grayscale-10)'
                />
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
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

      {/* Chia layout cho hình bên trái và thông tin bên phải */}
      <div className="relative flex w-full mt-[-50px] ml-[200px]">
        <div className="relative w-[280px] h-[420px] bg-black border-2 border-white mx-auto mb-5 z-30">
          {movie ? (
            <img
              src={movie.image}
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
                  {movie.soT}
                </button>
              </div>
              <div className="flex items-center justify-start text-[14px] font-sans mb-3">
                <div className="flex justify-start mr-8">
                  <img
                    src="../image/time.png"
                    alt="time"
                    className="w-[16px] h-[16px] object-cover mt-0.5 mr-1"
                  />
                  {movie.time}
                </div>
                <div className="flex">
                  <img
                    src="../image/date.png"
                    alt="calendar"
                    className="w-[16px] h-[16px] object-cover mt-0.5 mr-1"
                  />
                  {movie.date}
                </div>
              </div>
              <div className="flex items-center justify-start text-[18px] font-sans mb-3">
                <img
                  src="../image/star.png"
                  alt="star"
                  className="w-[25px] h-[25px] object-cover -mt-0.5 mr-1"
                />
                {movie.numberStar}
              </div>
              <div className="mb-3">
                <span className="mr-3 font-sans">Quốc gia:</span> {movie.nation}
              </div>
              <div className="mb-3">
                <span className="mr-3 font-sans">Nhà sản xuất:</span>{" "}
                {movie.manufacturer}
              </div>

              <div className="mb-2">
                <span className="mr-3 font-sans">Thể loại:</span>
                {movie.genre.map((item, index) => (
                  <button
                    key={index}
                    className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="mb-2">
                <span className="mr-3 font-sans">Đạo diễn:</span>
                {Array.isArray(movie.director) ? (
                  movie.director.map((item, index) => (
                    <button
                      key={index}
                      className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400 "
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <button className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400">
                    {movie.director}
                  </button>
                )}
              </div>
              <div className="mb-3">
                <span className="mr-3 font-sans">Diễn viên:</span>
                {Array.isArray(movie.performer) ? (
                  movie.performer.map((item, index) => (
                    <button
                      key={index}
                      className="bg-gray-200 text-black px-3 py-1 rounded-md text-[14px] m-1 hover:outline hover:outline-orange-700 hover:outline-1 hover:outline-offset-1 transition-all duration-400"
                    >
                      {item}
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
