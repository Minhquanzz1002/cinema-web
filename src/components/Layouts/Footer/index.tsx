import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <>
            <div className="bg-[#333] h-1/2 w-full flex md:flex-row flex-col justify-around items-start p-20 text-white">
                <div className="p-5">
                    <ul>
                        <p className="font-bold text-2xl pb-4">GIỚI THIỆU</p>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Về Chúng Tôi
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Thoản Thuận Sử Dụng
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Quy Trình Hoạt Động
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Chính Sách Bảo Mật
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="font-bold text-2xl pb-4">GỐC ĐIỆN ẢNH</p>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Thể Loại Phim
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Bình Luận Phim
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Blog Điện Ảnh
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Phim Hay Tháng
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Phim IMAX
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="font-bold text-2xl pb-4">HỖ TRỢ</p>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Góp Ý
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Sale & Services
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Rạp / Giá Vé
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            Tuyển dụng
                        </li>
                        <li className="text-md pb-2 font-sans hover:text-orange-600 cursor-pointer">
                            FQA
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="font-bold text-3xl pb-6">
                            Stream<span className="text-blue-600">line</span>
                        </p>
                        <div className="flex gap-6 pb-5">
                            <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600" />
                            <FaInstagram className="text-2xl cursor-pointer hover:text-pink-600" />
                            <FaTwitter className="text-2xl cursor-pointer hover:text-blue-600" />
                            <FaYoutube className="text-2xl cursor-pointer hover:text-red-600" />
                        </div>
                    </ul>
                </div>
            </div>
            <div className="mt-1 border-b-1] border-[#feffff]"></div>
            <div className="flex flex-col justify-center items-center text-center bg-[#333] text-white">
                <h1 className="text-md pb-2 font-semibold">
                    © 2024 Streamline. All rights reserved.
                </h1>
            </div>
        </>
    );
}
