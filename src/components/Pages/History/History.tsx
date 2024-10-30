import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Seat {
    name: string;
    type: string;
}

interface OrderDetail {
    type: 'TICKET' | 'PRODUCT';
    quantity: number;
    price: number;
    seat: Seat | null;
    product: any | null;
}

interface UserData {
    name: string;
    email: string;
    phone: string;
    gender: boolean | null;
    birthday: string;
}

const History: React.FC = () => {
    const [accessToken, setAccessToken] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        phone: '',
        gender: null,
        birthday: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);
    // Thông tin người dùng
    // Gọi API để lấy thông tin user
    useEffect(() => {
        if (accessToken) {
            axios
                .get('http://localhost:8080/api/v1/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then(response => {
                    if (response.data.code === 200) {
                        setUserData(response.data.data);
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gọi API:', error);
                });
        }
    }, [accessToken]);

    // Lịch sử giao dịch
    useEffect(() => {
        if (accessToken) {
            fetch('http://localhost:8080/api/v1/orders', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('API response:', data);

                    if (Array.isArray(data)) {
                        setOrders(data);
                    } else if (Array.isArray(data?.data)) {
                        setOrders(data.data);
                    } else {
                        setOrders([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                });
        }
    }, [accessToken]);
    // Hiển thị model xử lý hoàn trả vé
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const openRefundModal = (order: any) => {
        setSelectedOrder(order); // Lưu lại đơn hàng đang được chọn
        setIsModalOpen(true); // Mở modal
    };
    const handleRefundRequest = () => {
        const currentTime = new Date().getTime();
        const showTime = new Date(selectedOrder.showTime.startTime).getTime();

        // Kiểm tra nếu thời gian hiện tại cách thời gian chiếu ít hơn 8 tiếng (28800000 milliseconds = 8 giờ)
        if (showTime - currentTime < 8 * 60 * 60 * 1000) {
            alert('Bạn chỉ có thể hủy vé trước 8 giờ so với giờ chiếu.');
            return;
        }

        if (refundReason.trim() === '') {
            alert('Vui lòng nhập lý do hoàn tiền.');
            return;
        }

        // Gọi API gửi yêu cầu hoàn tiền
        axios
            .put(
                `http://localhost:8080/api/v1/orders/${selectedOrder.id}/cancel-before-showtime`,
                {
                    reason: refundReason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Gửi token trong header
                    },
                },
            )
            .then(response => {
                alert('Yêu cầu hoàn tiền đã được gửi.');
                console.log('API response:', response.data);

                setIsModalOpen(false); // Đóng modal sau khi gửi yêu cầu thành công
                window.location.reload(); // Làm mới trang
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu hoàn tiền:', error);
                alert('Thời gian hủy phải trước 8 tiếng so với giờ chiếu.');
            });
    };

    return (
        <div className="container mx-auto grid grid-cols-2 px-[13%] py-6 md:grid-cols-3 md:gap-6">
            {/* Left Section: User Profile & Info */}
            <div className="rounded-lg bg-white p-6 shadow-md md:col-span-1">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="h-[72px] w-[72px] rounded-full border-4 border-solid border-[#E9E9E2] bg-[#D0D0D0] text-center leading-[62px]">
                            <img
                                alt="Camera"
                                width="20"
                                height="20"
                                decoding="async"
                                className='group-hover:opacity-100" grayscale-0) inline-block h-[20px] w-[20px] scale-100 object-cover blur-0 duration-500 ease-in-out'
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
                        Gọi đường dây nóng:{' '}
                        <a href="tel:19002224" className="text-blue-600">
                            19002224 (9:00 - 22:00)
                        </a>
                    </p>
                    <p className="text-sm">
                        Email:{' '}
                        <a href="mailto:hotro@galaxystudio.vn" className="text-blue-600">
                            hotro@galaxystudio.vn
                        </a>
                    </p>
                    <p className="text-sm">
                        Website:{' '}
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
                        Địa chỉ:{' '}
                        <span className="text-gray-600">
                            Đường Quang Trung, Phường 10, Quận Gò Vấp, TP.Hồ Chí Minh
                        </span>
                    </p>
                </div>
            </div>

            {/* Right Section: Transaction History */}

            <div className="rounded-lg bg-white p-6 shadow-md md:col-span-2">
                <div className="mb-4 border-b pb-4">
                    <h3 className="text-center text-[20px] font-bold text-blue-500">
                        Lịch Sử Giao Dịch
                    </h3>
                </div>

                {orders.length === 0 ? (
                    <p className="text-center text-gray-600">No transactions found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders
                            .sort(
                                (a, b) =>
                                    new Date(b.orderDate).getTime() -
                                    new Date(a.orderDate).getTime(),
                            ) // Sắp xếp theo thứ tự mới nhất trước
                            .map(order => (
                                <div
                                    key={order.id}
                                    className={`relative transform rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 active:scale-95 ${
                                        order.status === 'CANCELLED' ? 'bg-red-100' : 'bg-gray-50'
                                    }`}
                                >
                                    <div className="my-4 justify-center">
                                        {/* Date and Time */}
                                        <p className="absolute left-1/2 top-0 -translate-x-1/2 transform text-center text-sm text-gray-600">
                                            {new Date(order.orderDate).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            ,{new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>

                                    <div className="rounded bg-gray-50 p-4">
                                        <div className="mt-6 flex items-center space-x-4">
                                            {/* Image and age label */}
                                            <div className="w-25 relative h-44">
                                                <img
                                                    src={order.showTime.movie.imagePortrait}
                                                    alt={'Movie Poster'}
                                                    className="h-full w-full rounded-md object-cover"
                                                />
                                                {/* Age label at the bottom right of the image */}
                                                <span className="absolute bottom-2 right-2 rounded-md bg-orange-500 px-3 py-1 text-[14px] font-bold text-white sm:text-sm">
                                                    {order.showTime.movie.ageRating}
                                                </span>
                                            </div>

                                            {/* Movie details */}
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold">
                                                    {order.showTime.movie.title}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {order.showTime.cinemaName} {'-'}{' '}
                                                    {order.showTime.room.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Suất: {order.showTime.startTime} {'-'}{' '}
                                                    {new Date(
                                                        order.showTime.startDate,
                                                    ).toLocaleDateString()}
                                                </p>

                                                <p className="text-sm text-gray-600">
                                                    Ghế:{' '}
                                                    {order.orderDetails
                                                        .filter(
                                                            (detail: OrderDetail) =>
                                                                detail.type === 'TICKET' &&
                                                                detail.seat,
                                                        )
                                                        .map(
                                                            (detail: OrderDetail) =>
                                                                detail.seat!.name,
                                                        )
                                                        .join(', ')}
                                                </p>

                                                {/* Product details */}
                                                <p className="text-sm text-gray-600">
                                                    Sản phẩm:{' '}
                                                    {order.orderDetails
                                                        .filter(
                                                            (detail: any) =>
                                                                detail.type === 'PRODUCT',
                                                        )
                                                        .map((detail: any) => detail.product?.name)
                                                        .join(', ')}
                                                </p>

                                                <p
                                                    className="mt-1 inline-block cursor-pointer border border-red-500 px-2 py-0.5 text-sm text-red-500"
                                                    onClick={() => openRefundModal(order)}
                                                >
                                                    Trả vé trong 8 giờ
                                                </p>

                                                {/* Hoàn tiền và tổng tiền */}
                                                {order.status === 'CANCELLED' ? (
                                                    <div>
                                                        <p className="mt-1 text-sm text-red-500">
                                                            Đã hủy - Hoàn lại:{' '}
                                                            {order.refundAmount.toLocaleString()} đ
                                                        </p>
                                                        <p className="mt-1 text-sm text-orange-500 line-through">
                                                            Tổng tiền:{' '}
                                                            {order.finalAmount.toLocaleString()} đ
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="mt-1 text-sm text-orange-500">
                                                        Tổng tiền:{' '}
                                                        {order.finalAmount.toLocaleString()} đ
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-bold">Lý do hủy đơn</h2>
                        <textarea
                            value={refundReason}
                            onChange={e => setRefundReason(e.target.value)}
                            className="mb-4 h-32 w-full rounded border p-2"
                            placeholder="Nhập lý do hủy đơn..."
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded bg-gray-500 px-4 py-2 text-white"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleRefundRequest}
                                className="rounded bg-blue-500 px-4 py-2 text-white"
                            >
                                Gửi yêu cầu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
