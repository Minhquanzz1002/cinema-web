export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    name: string;
    email: string;
    phone: string;
    role: string;
    gender: boolean;
    birthday: Date;
}

export interface LoginResponse extends User {
    accessToken: string;
    refreshToken: string;
}