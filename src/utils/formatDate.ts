import dayjs from 'dayjs';

const formatDateToLocalDate = (date: Date): string => {
    return dayjs(date).format('DD/MM/YYYY');
};

const formatDateInOrder = (date: Date): string => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const timeFromNow = (date: Date, withoutSuffix = false): string => {
    return dayjs(date).fromNow(withoutSuffix);
};

const formatTime = (timeString: string): string => {
    return dayjs(timeString, 'HH:mm:ss').format('HH:mm');
};

const getDayOfWeek = (date: Date): string => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayNumber = dayjs(date).day();
    return days[dayNumber];
};

export {
    formatDateInOrder,
    formatDateToLocalDate,
    timeFromNow,
    formatTime,
    getDayOfWeek,
};