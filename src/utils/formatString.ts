export const formatRole = (role: string) => {
    switch (role) {
        case 'ROLE_ADMIN':
            return 'Quản trị viên';
        case 'ROLE_EMPLOYEE_SALE':
            return 'Nhân viên bán hàng';
    }
};

export const removeCityPrefix = (name: string): string => {
    return name.replace(/(Thành phố|Tỉnh)\s+/g, '');
};

export const removeWardPrefix = (name: string): string => {
    return name.replace(/(Xã|Thị trấn)\s+/g, '');
};

export const removeDistrictPrefix = (name: string): string => {
    return name.replace(/(Huyện)\s+/g, '');
};
