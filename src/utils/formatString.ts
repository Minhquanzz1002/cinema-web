export const formatRole = (role: string) => {
    switch (role) {
        case 'ROLE_ADMIN':
            return 'Quản trị viên';
        case 'ROLE_EMPLOYEE_SALE':
            return 'Nhân viên bán hàng';
    }
};