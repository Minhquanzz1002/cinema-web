"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link"; // Import useRouter
import { useRouter } from "next/navigation";
import { ro } from "@faker-js/faker";
import { on } from "events";
import OtpInput from "react-otp-input"; // Import thư viện OTP
import { log } from "console";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user:", parsedUser); // Kiểm tra giá trị
      if (parsedUser.data && parsedUser.data.name) {
        console.log("Stored user name:", parsedUser.data.name); // Kiểm tra giá trị name
        setUser(parsedUser.data); // Cập nhật trạng thái người dùng
      } else {
        console.log("Stored user does not have a name");
      }
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    const { data } = userData; // Giả sử `userData` có cấu trúc như trong localStorage
    localStorage.setItem("user", JSON.stringify(userData)); // Lưu dữ liệu vào localStorage
    setUser(data); // Cập nhật trạng thái người dùng
    setShowLoginForm(false); // Đóng form đăng nhập
  };

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
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    setUser(null); // Cập nhật lại trạng thái để hiển thị nút đăng nhập/đăng ký
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowLoginForm(false); // Đóng form đăng nhập khi mở form quên mật khẩu
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="flex justify-between items-center p-5 px-20">
      <Link href="/">
        <Image src="/image/logo.png" alt="logo" width={120} height={65} />
      </Link>
      <div className="flex items-center space-x-4 mr-5">
        <button className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center">
          <Image
            src="/image/btn-ticket.42d72c96.webp"
            alt="Ticket"
            width={100}
            height={65}
          />
        </button>
        <button className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center">
          Phim <FaChevronDown className="ml-1 text-[10px]" />
        </button>
        <button className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center">
          Góc điện ảnh <FaChevronDown className="ml-1 text-[10px]" />
        </button>
        <button className="bg-white text-gray-500 p-1 px-3 rounded-full flex items-center">
          Sự kiện <FaChevronDown className="ml-2 text-[10px]" />
        </button>
        <button className="bg-white text-gray-500 p-1 px-3 rounded-full flex items-center">
          Rạp/Giá vé <FaChevronDown className="ml-2 text-[10px]" />
        </button>
      </div>
      {!user ? (
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
      ) : (
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-gray-500 text-3xl" />
          <span className="text-gray-700">
            {user ? user.name : "Tên người dùng"}
          </span>
          <button
            className="bg-white text-gray-500 p-2 px-3 rounded-full flex items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Đăng xuất
          </button>
        </div>
      )}

      {showLoginForm && (
        <LoginForm
          onClose={handleCloseLoginForm}
          onSuccess={handleLoginSuccess}
        />
      )}
      {showRegisterForm && (
        <RegisterForm
          onSwitchToLogin={handleLoginClick}
          onClose={handleCloseRegisterForm}
        />
      )}
      {showLoginForm && (
        <LoginForm
          onSwitchToRegister={handleRegisterClick}
          onClose={handleCloseLoginForm}
        />
      )}
      {showForgotPassword && (
        <ForgotPasswordModal onClose={handleCloseForgotPasswordModal} />
      )}

      {showLoginForm && (
        <LoginForm
          onSwitchToRegister={handleRegisterClick}
          onClose={handleCloseLoginForm}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      )}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={handleCloseForgotPasswordModal}
          onSwitchToLogin={handleLoginClick}
        />
      )}
    </div>
  );
}

// Component Modal Quên Mật Khẩu
function ForgotPasswordModal({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Khai báo useRouter

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email không được để trống");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        alert("Đã gửi email quên mật khẩu thành công!");
        onClose();
        onSwitchToLogin && onSwitchToLogin();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
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
        <div className="flex justify-center items-center mb-4">
          <Image
            src="https://www.galaxycine.vn/_next/static/media/icon-login.fbbf1b2d.svg"
            alt="logoForgotPassword"
            width={190}
            height={120}
          />
        </div>
        <div className="text-center">
          <h2 className="text-[16px] font-bold mb-4">Quên Mật Khẩu?</h2>
        </div>
        <p className="text-gray-500 text-[13px] text-left mb-4">
          Vui lòng nhập email đăng nhập chúng tôi sẽ gửi link kích hoạt cho bạn
        </p>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-500 text-sm font-bold mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (!email.trim()) {
                setError("Email không được để trống");
              } else if (!isValidEmail(email)) {
                setError("Email không đúng định dạng");
              } else {
                setError("");
              }
            }}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button className="w-full bg-[#F58020] text-white p-2 rounded font-bold">
            CẤP LẠI MẬT KHẨU
          </button>
        </form>
      </div>
    </div>
  );
}

function LoginForm({
  onClose,
  onSwitchToRegister,
  onSuccess,
  onForgotPasswordClick,
}: {
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSuccess?: (userData: { name: string }) => void;
  onForgotPasswordClick?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors: any = {};
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Đăng nhập thành công!");

        // Lưu dữ liệu đăng nhập vào localStorage
        localStorage.setItem("user", JSON.stringify(data));
        console.log("User data:", data);

        // Đóng form đăng nhập
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
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

        {/* Email */}
        <label className="block text-gray-500 text-[10px] font-bold mt-4">
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validate()}
          className="w-full p-1.5 mb-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mb-4">{errors.email}</p>
        )}

        {/* Mật khẩu */}
        <label className="block text-gray-500 text-[10px] font-bold mt-0">
          Mật khẩu
        </label>
        <div className="relative w-full mb-1">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validate()}
            className="w-full p-1.5 pr-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <FaEye className="text-gray-500" />
            ) : (
              <FaEyeSlash className="text-gray-500" />
            )}
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mb-4">{errors.password}</p>
        )}

        <button
          className="w-full bg-[#F58020] text-white p-2 rounded mt-2"
          onClick={handleSubmit}
        >
          ĐĂNG NHẬP
        </button>

        <div className="text-left mt-4">
          <button
            className="text-[14px] text-gray-500"
            onClick={onForgotPasswordClick}
          >
            Quên mật khẩu?
          </button>
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

function RegisterForm({
  onSwitchToLogin,
  onClose,
}: {
  onSwitchToLogin: () => void;
  onClose: () => void;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleReTurn, setPasswordVisibleReTurn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState(""); // State cho OTP
  const [isOtpModalVisible, setOtpModalVisible] = useState(false); // State để điều khiển hiển thị modal OTP

  const router = useRouter();

  // State cho các trường input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(true);
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State cho các lỗi
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibilityReTurn = () => {
    setPasswordVisibleReTurn(!passwordVisibleReTurn);
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  // mở modal OTP sẽ đóng modal đăng ký
    const handleOtpModalClose = () => {
        setOtpModalVisible(false);
        onClose();
    };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const isOldEnough = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    return (
      age > 18 ||
      (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
    );
  };

  // Kiểm tra lỗi khi rời khỏi ô input
  const validateField = (name: string, value: string) => {
    const newErrors: any = { ...errors };

    switch (name) {
      case "name":
        newErrors.name = !value.trim() ? "Không được để trống" : "";
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Không được để trống";
        } else if (!isValidEmail(value)) {
          newErrors.email = "Email không đúng định dạng";
        } else {
          newErrors.email = "";
        }
        break;
      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Không được để trống";
        } else if (!isValidPhone(value)) {
          newErrors.phone = "Số điện thoại phải có 10 số";
        } else {
          newErrors.phone = "";
        }
        break;
      case "birthday":
        if (!value.trim()) {
          newErrors.birthday = "Không được để trống";
        } else if (!isOldEnough(value)) {
          newErrors.birthday = "Bạn phải đủ 18 tuổi";
        } else {
          newErrors.birthday = "";
        }
        break;
      case "password":
        if (!value.trim()) {
          newErrors.password = "Không được để trống";
        } else if (value.length < 8) {
          newErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
        } else {
          newErrors.password = "";
        }
        break;
      case "confirmPassword":
        if (!value.trim()) {
          newErrors.confirmPassword = "Không được để trống";
        } else if (value !== password) {
          newErrors.confirmPassword = "Mật khẩu không khớp";
        } else {
          newErrors.confirmPassword = "";
        }
        break;
    }

    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Không được để trống";
    if (!email.trim()) newErrors.email = "Không được để trống";
    else if (!isValidEmail(email))
      newErrors.email = "Email không đúng định dạng";
    if (!phone.trim()) newErrors.phone = "Không được để trống";
    else if (!isValidPhone(phone))
      newErrors.phone = "Số điện thoại phải có 10 số";
    if (!birthday) newErrors.birthday = "Không được để trống";
    else if (!isOldEnough(birthday)) newErrors.birthday = "Bạn phải đủ 18 tuổi";
    if (!password) newErrors.password = "Không được để trống";
    else if (password.length < 8)
      newErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name,
      email,
      phone,
      gender,
      birthday,
      password,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
       // lưu gmail vào localStorage để xác thực OTP
        localStorage.setItem("userData", JSON.stringify({ email }));
        console.log("userData:", { email });
        setOtpModalVisible(true); // Mở modal OTP
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };
  // Xử lý xác thực OTP
  const handleOtpSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    console.log("userData:", userData);
    
    const data = {
      otp,
      email: userData.email,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register/validate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Xác thực OTP thành công!");
        setOtpModalVisible(false); // Đóng modal OTP
        onClose(); // Đóng modal đăng ký
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Xác thực OTP thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
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
        <h3 className="text-center text-xl font-bold text-gray-700">
          Đăng Ký Tài Khoản
        </h3>

        {/* Họ và tên */}
        <label className="block text-gray-500 text-[10px] font-bold mt-4">
          Họ và tên
        </label>
        <input
          type="text"
          placeholder="Nhập Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => validateField("name", e.target.value)}
          className="w-full p-1.5 mb-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mb-4">{errors.name}</p>
        )}

        {/* Email */}
        <label className="block text-gray-500 text-[10px] font-bold">
          Email
        </label>
        <input
          type="email"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateField("email", e.target.value)}
          className="w-full p-1.5 mb-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mb-4">{errors.email}</p>
        )}

        {/* Số điện thoại */}
        <label className="block text-gray-500 text-[10px] font-bold">
          Số điện thoại
        </label>
        <input
          type="tel"
          placeholder="Nhập Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={(e) => validateField("phone", e.target.value)}
          className="w-full p-1.5 mb-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mb-4">{errors.phone}</p>
        )}

        {/* Ngày sinh */}
        <label className="block text-gray-500 text-[10px] font-bold">
          Ngày sinh
        </label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          onBlur={(e) => validateField("birthday", e.target.value)}
          className="w-full p-1.5 mb-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        {errors.birthday && (
          <p className="text-red-500 text-xs mb-4">{errors.birthday}</p>
        )}

        {/* Mật khẩu */}
        <label className="block text-gray-500 text-[10px] font-bold mt-0">
          Mật khẩu
        </label>
        <div className="relative w-full mb-1">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => validateField("password", e.target.value)}
            className="w-full p-1.5 pr-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <FaEye className="text-gray-500" />
            ) : (
              <FaEyeSlash className="text-gray-500" />
            )}
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mb-4">{errors.password}</p>
        )}

        {/* Nhập lại mật khẩu */}
        <label className="block text-gray-500 text-[10px] font-bold mt-0">
          Nhập lại mật khẩu
        </label>
        <div className="relative w-full mb-1">
          <input
            type={passwordVisibleReTurn ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={(e) => validateField("confirmPassword", e.target.value)}
            className="w-full p-1.5 pr-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={togglePasswordVisibilityReTurn}
          >
            {passwordVisibleReTurn ? (
              <FaEye className="text-gray-500" />
            ) : (
              <FaEyeSlash className="text-gray-500" />
            )}
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mb-4">{errors.confirmPassword}</p>
        )}

        {/* Đồng ý điều khoản */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="mr-2"
          />
          <label className="text-gray-500 text-[12px]">
            Bằng việc đăng ký tài khoản, tôi đồng ý với các{" "}
            <i className="text-[#2563eb]">Điều khoản dịch vụ</i> và{" "}
            <i className="text-[#2563eb]">Chính sách bảo mật</i> của Galaxy
            Cinema
          </label>
        </div>

        <button
          className={`w-full ${
            termsAccepted ? "bg-[#dc2626]" : "bg-gray-400"
          } text-white p-2 rounded mt-2`}
          disabled={!termsAccepted}
          onClick={handleSubmit}
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
      {/* Modal OTP */}
      {isOtpModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-7 rounded-lg shadow-lg w-[370px]">
            <h3 className="text-center text-xl font-bold text-gray-700 mb-4">
              Xác Thực OTP
            </h3>
            <div className="flex justify-center mb-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mx-2">-</span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: "50px",
                  height: "50px",
                  fontSize: "20px",
                  borderRadius: "8px",
                  border: "2px solid #ccc",
                  textAlign: "center",
                }}
                containerStyle="flex justify-center space-x-0"
              />
            </div>
            <button
              className="w-full bg-[#dc2626] text-white p-2 rounded mt-4"
              onClick={handleOtpSubmit}
            >
              Xác nhận OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
