const formatNumberToCurrency = (num: number): string | 0 => {
    if (num === 0) {
        return 0;
    }
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
    return formatter + ' VND';
};

export {
    formatNumberToCurrency,
};