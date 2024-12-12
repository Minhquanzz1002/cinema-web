export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar?: string;
    gender: boolean;
    birthday: Date;
}

export interface LoginResponse extends User {
    accessToken: string;
    refreshToken: string;
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export const UserStatusVietnamese: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: 'Hoạt động',
    [UserStatus.INACTIVE]: 'Ngưng hoạt động',
};

export interface ChangePasswordResponse {
    accessToken: string;
    refreshToken: string;
}