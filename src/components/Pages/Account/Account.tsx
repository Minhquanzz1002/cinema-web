import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserData {
    name: string;
    email: string;
    phone: string;
    gender: boolean | null;
    birthday: string;
  }

  function Account() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState("");
    const [userData, setUserData] = useState<UserData>({
      name: "",
      email: "",
      phone: "",
      gender: null,
      birthday: "",
    });
    const [updatedUserData, setUpdatedUserData] = useState<UserData>(userData);
    const [editField, setEditField] = useState<string | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }
    }, []);
  
    // Gọi API để lấy thông tin user
    useEffect(() => {
      if (accessToken) {
        axios
          .get("http://localhost:8080/api/v1/auth/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            if (response.data.code === 200) {
              setUserData(response.data.data);
              setUpdatedUserData(response.data.data);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
          });
      }
    }, [accessToken]);
  
    const handleEditClick = (field: string) => {
      setEditField(field);
    };
  
    const handleSave = () => {
      axios
        .put(
          "http://localhost:8080/api/v1/auth/profile",
          {
            name: updatedUserData.name,
            phone: updatedUserData.phone,
            gender: updatedUserData.gender,
            birthday: updatedUserData.birthday,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          if (response.data.code === 200) {
            setUserData(updatedUserData); // Cập nhật dữ liệu đã lưu thành công
            setEditField(null); // Tắt chế độ chỉnh sửa
            router.push("/"); // Quay về trang chủ
          }
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật thông tin:", error);
        });
    };
  

  return (
    <div className="container mx-auto px-[13%] py-6 grid grid-cols-2 md:grid-cols-3 md:gap-6">
      {/* Left Section: User Profile & Info */}
      <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-[72px] h-[72px] leading-[62px] text-center rounded-full bg-[#D0D0D0] border-4 border-solid border-[#E9E9E2]">
              <img
                alt="Camera"
                width="20"
                height="20"
                decoding="async"
                className='inline-block w-[20px] h-[20px] object-cover duration-500 ease-in-out group-hover:opacity-100"
                          scale-100 blur-0 grayscale-0)'
                src="https://www.galaxycine.vn/_next/static/media/camera.af597ff8.png"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-sm text-gray-600">🎁 0 Stars</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-2">
          <p className="text-sm">
            Gọi đường dây nóng:{" "}
            <a href="tel:19002224" className="text-blue-600">
              19002224 (9:00 - 22:00)
            </a>
          </p>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:hotro@galaxystudio.vn" className="text-blue-600">
              hotro@galaxystudio.vn
            </a>
          </p>
          <p className="text-sm">
            Website:{" "}
            <a
              href="https://galaxystudio.vn"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              galaxystudio.vn
            </a>
          </p>
          {/* Thông tin công ty */}
          <p className="text-sm">
            Địa chỉ:{" "}
            <span className="text-gray-600">
              Đường Quang Trung, Phường 10, Quận Gò Vấp, TP.Hồ Chí Minh
            </span>
          </p>
        </div>
      </div>
      {/* Right Section: User's Orders */}
      <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-[20px] font-bold text-center text-blue-500">
            Thông tin cá nhân
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ và tên */}
            <div>
            <label className="block text-gray-700">Họ và tên</label>
            <div className="flex items-center bg-gray-200 p-2 rounded-md">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                value={updatedUserData.name}
                onChange={(e) =>
                  setUpdatedUserData({ ...updatedUserData, name: e.target.value })
                }
                disabled={editField !== "name"}
                className="bg-transparent w-full outline-none"
              />
              <button
                onClick={() => handleEditClick("name")}
                className="text-orange-500 text-[12px] font-bold ml-2 whitespace-nowrap"
              >
                {editField === "name" ? "Lưu" : "Thay đổi"}
              </button>
            </div>
          </div>


          {/* Ngày sinh */}
          <div>
            <label className="block text-gray-700">Ngày sinh</label>
            <div className="flex items-center bg-gray-200 p-2 rounded-lg">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                value={updatedUserData.birthday}
                onChange={(e) =>
                  setUpdatedUserData({ ...updatedUserData, birthday: e.target.value })
                }
                disabled={editField !== "birthday"}
                className="bg-transparent w-full outline-none"
              />
              <button
                onClick={() => handleEditClick("birthday")}
                className="text-orange-500 text-[12px] font-bold ml-2 whitespace-nowrap"
              >
                {editField === "birthday" ? "Lưu" : "Thay đổi"}
              </button>
            </div>
          </div>


          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <div className="flex items-center bg-gray-200 p-2 rounded-lg">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                value={userData.email}
                disabled
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-gray-700">Số điện thoại</label>
            <div className="flex items-center bg-gray-200 p-2 rounded-lg">
              <FaPhone className="text-gray-500 mr-2" />
              <input
                type="text"
                value={updatedUserData.phone}
                onChange={(e) =>
                  setUpdatedUserData({ ...updatedUserData, phone: e.target.value })
                }
                disabled={editField !== "phone"}
                className="bg-transparent w-full outline-none"
              />
              <button
                onClick={() => handleEditClick("phone")}
                className="text-orange-500 text-[12px] font-bold ml-2 whitespace-nowrap"
              >
                {editField === "phone" ? "Lưu" : "Thay đổi"}
              </button>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700">Giới tính</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={updatedUserData.gender === true}
                  onChange={() =>
                    setUpdatedUserData({ ...updatedUserData, gender: true })
                  }
                  disabled={editField !== "gender"}
                />
                <span>Nam</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={updatedUserData.gender === false}
                  onChange={() =>
                    setUpdatedUserData({ ...updatedUserData, gender: false })
                  }
                  disabled={editField !== "gender"}
                />
                <span>Nữ</span>
              </label>
              <button
                onClick={() => handleEditClick("gender")}
                className="text-orange-500 text-[12px] font-bold ml-2 whitespace-nowrap mt-1"
              >
                {editField === "gender" ? "Lưu" : "Thay đổi"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-md"
            onClick={handleSave}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
