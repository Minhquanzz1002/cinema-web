import React, { useState } from "react";
import { FaThumbsUp, FaEye } from "react-icons/fa"; // Import các icon từ react-icons
import { RiArrowRightSLine } from "react-icons/ri";
import Image from "next/image";

function CinemaCorner() {
  const [activeTab, setActiveTab] = useState<string>("comments"); // 'comments' là tab mặc định

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="px-[10%] mb-10 border-b-[4px]">
      <div className="relative flex items-center mb-10">
        <span className="block w-1 h-8 bg-blue-700 mr-2"></span>
        <p className="text-xl font-sans font-bold mr-10">GÓC ĐIỆN ẢNH</p>
        <div className="flex space-x-[5] relative">
          <button
            className={`py-2 px-4 text-center font-bold relative ${
              activeTab === "comments" ? "text-blue-700" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("comments")}
          >
            Bình luận phim
            {activeTab === "comments" && (
              <div className="absolute bottom-0 left-12 w-[50px] h-0.5 bg-blue-700"></div>
            )}
          </button>
          <button
            className={`py-2 px-4 text-center font-bold relative ${
              activeTab === "blog" ? "text-blue-700" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("blog")}
          >
            Blog điện ảnh
            {activeTab === "blog" && (
              <div className="absolute bottom-0 left-12 w-[50px] h-0.5 bg-blue-700"></div>
            )}
          </button>
        </div>
      </div>
      <div>
        {activeTab === "comments" && (
          <div className="flex">
            {/* Phần bên trái chiếm 40% */}
            <div className="w-2.5/5 pr-4">
              <div className="flex flex-col items-start space-y-4">
                <Image
                  src="https://www.galaxycine.vn/media/2024/8/17/750_1723912371275.jpg"
                  alt="Review Image"
                  className="w-full h-[55%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110" // Phóng to khi hover
                  height={600} width={800}
                />
                <div className="flex-1 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    [Review] Alien Romulus: Quái Vật Không Gian Ngày Càng Đáng
                    Sợ Hơn!
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần bên phải chiếm 60% */}
            <div className="w-3/5 pl-4 space-y-4">
              <div className="flex flex-row items-start space-y-1">
                <Image
                  src="https://www.galaxycine.vn/media/2024/8/15/review-ma-da-750_1723714814349.jpg"
                  alt="Review Image"
                  className="w-[35%] h-[25%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  width={205} height={135}
                />
                <div className="flex-1 ml-5 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    [Review] Ma Da: Tình Mẫu Tử Cảm Động Trên Nền Hiện Tượng Tâm
                    Linh Kỳ Quái
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-start space-y-1">
                <Image
                  src="https://www.galaxycine.vn/media/2024/8/2/tham-tu-lung-danh-conan-ngoi-sao-5-canh-1-trieu-do-bi-an-lon-ve-kaito-kid-5_1722611870756.jpg"
                  alt="Review Image"
                  className="w-[35%] h-[25%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  width={205} height={135}
                />
                <div className="flex-1 ml-5 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    [Review] Thám Tử Lừng Danh Conan Ngôi Sao 5 Cánh 1 Triệu Đô:
                    Bí Ẩn Lớn Nhất Về Kaito Kid
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-start space-y-1">
                <Image
                  src="https://www.galaxycine.vn/media/2024/7/25/deadpool--wolverine-rv-750_1721899268523.jpg"
                  alt="Review Image"
                  className="w-[35%] h-[25%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  width={205} height={135}
                />
                <div className="flex-1 ml-5 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    [Review] Deadpool & Wolverine: Tri Ân 20 Năm X-Men Theo
                    Phong Cách Bẩn Bựa
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "blog" && (
          <div className="flex">
            {/* Phần bên trái chiếm 40% */}
            <div className="w-2.5/5 pr-4">
              <div className="flex flex-col items-start space-y-4">
                <Image
                  src="https://www.galaxycine.vn/media/2024/8/13/mufasa-750_1723533692413.jpg"
                  alt="Review Image"
                  className="w-[100%] h-[55%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  height={600} width={800}
                />
                <div className="flex-1 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    Mufasa: The Lion King Tiết Lộ Hành Trình Mufasa Trở Thành
                    Vua Sư Tử Vĩ Đại
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần bên phải chiếm 60% */}
            <div className="w-3/5 pl-4 space-y-4">
              <div className="flex flex-row items-start space-y-1">
                <Image
                  src="https://www.galaxycine.vn/media/2024/8/3/boc-trung-phuc-sinh-cua-deadpool--wolverine-1_1722692769418.jpg"
                  alt="Review Image"
                  className="w-[35%] h-[25%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  width={205} height={135}
                />
                <div className="flex-1 ml-5 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    Đếm 500 Cameo Từ Deadpool & Wolverine
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-start space-y-1">
                <Image
                  src="https://www.galaxycine.vn/media/2024/6/24/despicable-me-4-chung-ta-biet-duoc-bao-nhieu-ve-minions-3_1719218662477.jpg"
                  alt="Review Image"
                  className="w-[35%] h-[25%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  width={205} height={135}
                />
                <div className="flex-1 ml-5 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    Despicable Me 4: Chúng Ta Biết Được Bao Nhiêu Về Minions?
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-start space-y-1">
                <Image
                  src="https://www.galaxycine.vn/media/2024/6/6/venom-3-venom-se-chet-7_1717645169505.jpg"
                  alt="Review Image"
                  className="w-[35%] h-[25%] rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                  width={205} height={135}
                />
                <div className="flex-1 ml-5 text-start">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-800">
                    Venom 3: Venom Sẽ Chết?
                  </h3>
                  <div className="flex flex-col md:flex-row justify-start space-y-1 md:space-y-0 md:space-x-4">
                    <button className="flex items-center py-0.2 px-3 bg-blue-500 text-white text-sm rounded-[5px] hover:bg-blue-800">
                      <FaThumbsUp className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans font-bold">
                        Thích
                      </span>
                    </button>
                    <button className="flex items-center py-0.2 px-3 bg-gray-200 text-gray-800 text-sm rounded-[5px] hover:bg-gray-300">
                      <FaEye className="mr-1 py-0.5" />
                      <span className="text-[12px] font-sans">1050</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mb-10">
        <button className=" flex items-center px-6 py-2 border border-orange-600 text-orange-600 font-semibold rounded-[5px] hover:text-white hover:bg-orange-500 transition duration-300">
          Xem thêm
          <RiArrowRightSLine className="ml-2" />
        </button>
      </div>
    </div>
  );
}

export default CinemaCorner;
