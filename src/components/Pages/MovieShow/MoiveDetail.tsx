import React, { useState } from "react";
import movies from "@/variables/client/movie";  // Import movie list from file
import { RiArrowRightSLine } from "react-icons/ri";  // Import icon from react-icons
import Link from "next/link";  // Import Link from Next.js for client-side navigation

function MovieDetail() {
  const [activeTab, setActiveTab] = useState("nowShowing");  // State for the current tab

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);  // Update state when tab changes
  };

  // Filter movies based on status (Now Showing or Coming Soon)
  const filteredMovies = movies.filter((movie) =>
    activeTab === "nowShowing"
      ? movie.status.includes("Đang chiếu")
      : movie.status.includes("Sắp chiếu")
  );

  // Function to handle clicking on a movie
  const handleMovieClick = (movie: any) => {
    // Save movie data to localStorage
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

    console.log("Movie data to save:", movieData); // Log data before saving

    // Use JSON.stringify to convert the object to a JSON string
    localStorage.setItem("selectedMovie", JSON.stringify(movieData));
  };

  return (
    <div className="px-[10%] mb-20 ">
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
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href="/booking"> {/* Use Link for navigation */}
              <div
                className="relative p-2 cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-auto mb-2 rounded-md"
                />
                <h2 className="text-lg font-bold">{movie.title}</h2>

                {/* Information container at the bottom right corner */}
                <div className="absolute bottom-20 right-0 text-white p-2">
                  <div className="flex items-center justify-center bg-black bg-opacity-60 gap-1">
                    <img
                      src="/image/star.png"
                      alt="star"
                      className="w-4 h-4 mr-2 ml-3"
                    />
                    <p className="text-[17px] font-bold mr-2">
                      {movie.numberStar.split(" ")[0]} {/* Display rating */}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-11 right-2 text-white font-bold text-[14px] p-2">
                  <button className="py-1 px-2 text-white bg-orange-500 rounded-md h-8 justify-center items-center">
                    {movie.soT} {/* Display movie code */}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
