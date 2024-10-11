const formatNumberToCurrency = (number: number) => {
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number);
    return formatter + ' VND';
};

export {
    formatNumberToCurrency,
};