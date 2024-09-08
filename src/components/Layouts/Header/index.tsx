"use client";
import Image from "next/image";
import React, {useState} from "react";
import {FaChevronDown, FaEye, FaEyeSlash, FaSearch, FaTimes} from "react-icons/fa";
import Link from "next/link"; // Import useRouter


export default function Header() {

    const [showSearch, setShowSearch] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);


    const handleSearchClick = () => {
        setShowSearch(!showSearch);
    };

    const handleLoginClick = () => {
        setShowLoginForm(true);
        setShowRegisterForm(false); // Đóng form đăng ký khi mở form đăng nhập
    };

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    const handleRegisterClick = () => {
        setShowRegisterForm(true);
        setShowLoginForm(false); // Đóng form đăng nhập khi mở form đăng ký
    };

    const handleCloseRegisterForm = () => {
        setShowRegisterForm(false);
    };

    return (
        <div className="flex justify-between items-center p-5 px-20">
            <Link href="/">
                <Image src="/image/logo.png" alt="logo" width={120} height={65}/>
            </Link>
            <div className="flex items-center space-x-4 mr-5">
                <button className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center">
                    <Image src="/image/btn-ticket.42d72c96.webp" alt="Ticket" width={100} height={65}/>
                </button>
                <button className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center">
                    Phim <FaChevronDown className="ml-1 text-[10px]"/>
                </button>
                <button className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center">
                    Góc điện ảnh <FaChevronDown className="ml-1 text-[10px]"/>
                </button>
                <button className="bg-white text-gray-500 p-1 px-3 rounded-full flex items-center">
                    Sự kiện <FaChevronDown className="ml-2 text-[10px]"/>
                </button>
                <button className="bg-white text-gray-500 p-1 px-3 rounded-full flex items-center">
                    Rạp/Giá vé <FaChevronDown className="ml-2 text-[10px]"/>
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <FaSearch
                        className="text-gray-500 cursor-pointer text-[14px]"
                        onClick={handleSearchClick}
                    />
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            className="text-gray-700 bg-gray-100 rounded-full px-3 py-2 outline-none w-64"
                        />
                    )}
                </div>
                <button
                    className="bg-white text-gray-500 p-2 px-3 rounded-full"
                    onClick={handleLoginClick}
                >
                    Đăng nhập
                </button>
                <button
                    className="bg-white text-gray-500 p-2 px-3 rounded-full"
                    onClick={handleRegisterClick}
                >
                    Đăng ký
                </button>
            </div>
            {showLoginForm && <LoginForm onClose={handleCloseLoginForm}/>}
            {showRegisterForm && <RegisterForm onSwitchToLogin={handleLoginClick} onClose={handleCloseRegisterForm}/>}
            {showLoginForm && <LoginForm onSwitchToRegister={handleRegisterClick} onClose={handleCloseLoginForm}/>}
        </div>
    );
}

function LoginForm({onClose, onSwitchToRegister}: { onClose: () => void; onSwitchToRegister?: () => void }) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-7 rounded-lg shadow-lg w-[410px]">
                <div className="flex justify-end items-center">
                    <FaTimes
                        className="text-gray-500 cursor-pointer text-lg"
                        onClick={onClose}
                    />
                </div>
                <Image
                    src="/image/LoginLogo.png"
                    alt="logoLogin"
                    width={530}
                    height={140}
                />
                <label className="block text-gray-500 text-[10px] font-bold mt-4">
                    Email
                </label>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-1.5 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
                <label className="block text-gray-500 text-[10px] font-bold mt-0">
                    Mật khẩu
                </label>
                <div className="relative w-full mb-4">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className="w-full p-1.5 pr-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                    />
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? (
                            <FaEye className="text-gray-500"/>
                        ) : (
                            <FaEyeSlash className="text-gray-500"/>
                        )}
                    </div>
                </div>
                <button className="w-full bg-[#F58020] text-white p-2 rounded mt-2">
                    ĐĂNG NHẬP
                </button>
                <div className="text-left mt-2.5"></div>
                <div className="text-left mt-4">
                    <a href="#" className="text-[14px] text-gray-500">
                        Quên mật khẩu?
                    </a>
                </div>
                <div className="text-left mt-4 border-b-[1px] border-[#d1d5db]"></div>
                <div className="text-center mt-4">
                    <label className="text-left text-gray-500 text-[14px]">
                        Bạn chưa có tài khoản?
                    </label>
                </div>
                <button
                    className="w-full text-[#F58020] p-1.5 rounded mt-2 border border-[#F58020] hover:bg-[#F58020] hover:text-white focus:bg-[#F58020] focus:text-white"
                    onClick={onSwitchToRegister}
                >
                    Đăng ký
                </button>
            </div>
        </div>
    );
}

function RegisterForm({onSwitchToLogin, onClose}: { onSwitchToLogin: () => void, onClose: () => void }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisibleReTurn, setPasswordVisibleReTurn] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordVisibilityReTurn = () => {
        setPasswordVisibleReTurn(!passwordVisibleReTurn);
    };

    const handleTermsChange = () => {
        setTermsAccepted(!termsAccepted);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-7 rounded-lg shadow-lg w-[410px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end items-center">
                    <FaTimes
                        className="text-gray-500 cursor-pointer text-lg"
                        onClick={onClose}
                    />
                </div>
                <div className="flex justify-center items-center mb-4">
                    <Image
                        src="/image/register.png"
                        alt="logoRegister"
                        width={300}
                        height={100}
                    />
                </div>
                <h3 className="text-center text-xl font-bold text-gray-700">Đăng Ký Tài Khoản</h3>
                <label className="block text-gray-500 text-[10px] font-bold mt-4">
                    Họ và tên
                </label>
                <input
                    type="text"
                    placeholder="Nhập Họ và tên"
                    className="w-full p-1.5 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
                <label className="block text-gray-500 text-[10px] font-bold">
                    Email
                </label>
                <input
                    type="email"
                    placeholder="Nhập Email"
                    className="w-full p-1.5 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
                <label className="block text-gray-500 text-[10px] font-bold">
                    Số điện thoại
                </label>
                <input
                    type="tel"
                    placeholder="Nhập Số điện thoại"
                    className="w-full p-1.5 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
                <div className="flex items-center mb-4">
                    <label className="flex items-center mr-4">
                        <input type="radio" name="gender" value="male" className="mr-2"/>
                        Nam
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="gender" value="female" className="mr-2"/>
                        Nữ
                    </label>
                </div>
                <label className="block text-gray-500 text-[10px] font-bold mt-0">
                    Ngày sinh
                </label>
                <input
                    type="date"
                    className="w-full p-1.5 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
                <label className="block text-gray-500 text-[10px] font-bold mt-0">
                    Mật khẩu
                </label>
                <div className="relative w-full mb-4">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className="w-full p-1.5 pr-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                    />
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? (
                            <FaEye className="text-gray-500"/>
                        ) : (
                            <FaEyeSlash className="text-gray-500"/>
                        )}
                    </div>
                </div>
                <label className="block text-gray-500 text-[10px] font-bold mt-0">
                    Nhập lại mật khẩu
                </label>
                <div className="relative w-full mb-4">
                    <input
                        type={passwordVisibleReTurn ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full p-1.5 pr-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                    />
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibilityReTurn}
                    >
                        {passwordVisibleReTurn ? (
                            <FaEye className="text-gray-500"/>
                        ) : (
                            <FaEyeSlash className="text-gray-500"/>
                        )}
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                        className="mr-2"
                    />
                    <label className="text-gray-500 text-[12px]">
                        Bằng việc đăng ký tài khoản, tôi đồng ý với các <i className="text-[#2563eb]">Điều khoản dịch
                        vụ</i> và <i className="text-[#2563eb]">Chính sách bảo mật</i> của Galaxy Cinema
                    </label>
                </div>
                <button
                    className={`w-full ${termsAccepted ? "bg-[#dc2626]" : "bg-gray-400"} text-white p-2 rounded mt-2`}
                    disabled={!termsAccepted}
                >
                    HOÀN THÀNH
                </button>
                <div className="text-left mt-8 border-b-[1px] border-[#d1d5db]"></div>
                <div className="text-center mt-4">
                    <label className="text-left text-gray-500 text-[14px]">
                        Bạn đã có tài khoản?
                    </label>
                </div>
                <button
                    className="w-full text-[#F58020] p-1.5 rounded mt-2 border border-[#F58020] hover:bg-[#F58020] hover:text-white focus:bg-[#F58020] focus:text-white"
                    onClick={onSwitchToLogin}
                >
                    Đăng nhập
                </button>
            </div>
        </div>
    );
}
