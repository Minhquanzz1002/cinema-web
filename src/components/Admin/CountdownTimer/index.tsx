import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    orderDate: Date;
    onExpired?: () => void;
}

const CountdownTimer = ({ orderDate, onExpired }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        if (!orderDate) return;

        const calculateTimeLeft = () => {
            const orderTime = new Date(orderDate).getTime();
            const expirationTime = orderTime + (7 * 60 * 1000); // orderDate + 7 minutes
            const now = new Date().getTime();
            const difference = expirationTime - now;

            if (difference <= 0) {
                setIsExpired(true);
                onExpired?.();
                return 0;
            }

            return Math.floor(difference / 1000);
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                setIsExpired(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [orderDate, onExpired]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (!orderDate) return null;

    return (
        <div className="text-lg font-semibold">
            {isExpired ? (
                <span className="text-red-500">Hết thời gian!</span>
            ) : (
                <span>Giữ ghế: {formattedTime}</span>
            )}
        </div>
    );
};

export default CountdownTimer;