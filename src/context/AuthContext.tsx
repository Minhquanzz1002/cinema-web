import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LoginResponse, User } from '@/modules/authentication/interface';
import { useRouter } from 'next/navigation';
import { useGetUser } from '@/modules/authentication/repository';
import { useQueryClient } from '@tanstack/react-query';
import { setAccessTokenForAxios } from '@/core/repository/http';

interface AuthContextType {
    isLoading: boolean;
    accessToken: string;
    refreshToken: string;
    user?: User;
    login: (response: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const storedAccessToken = Cookies.get('accessTokenAdmin');
        const storedRefreshToken = Cookies.get('refreshTokenAdmin');
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
            setAccessTokenForAxios(storedAccessToken);
        }
        setIsLoading(false);
    }, []);

    const { data: fetchedUser } = useGetUser({
        enabled: !!accessToken && !user,
    });

    useEffect(() => {
        if (fetchedUser?.data) {
            setUser(fetchedUser.data);
        }
    }, [fetchedUser]);

    useEffect(() => {
        console.log('accessToken:', accessToken);
        console.log('refreshToken:', refreshToken);
    }, [accessToken, refreshToken]);

    const login = (response: LoginResponse) => {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, ...user } = response;
        setAccessToken(newAccessToken);
        setAccessTokenForAxios(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(user);

        Cookies.set('accessTokenAdmin', newAccessToken, { expires: 1 });
        Cookies.set('refreshTokenAdmin', newRefreshToken, { expires: 14 });
    };

    const logout = () => {
        setAccessToken('');
        setRefreshToken('');
        setUser(undefined);

        Cookies.remove('accessTokenAdmin');
        Cookies.remove('refreshTokenAdmin');

        queryClient.clear();
        router.push('/admin/auth/login');
    };

    const value = {
        isLoading: isLoading,
        accessToken: accessToken || '',
        refreshToken: refreshToken || '',
        login,
        logout,
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };