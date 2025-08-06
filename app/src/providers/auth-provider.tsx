/* eslint-disable react-refresh/only-export-components */
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface IAuthContext {
    user: User | null;
    isAuthenticated: boolean;
    login(data: { email: string, password: string }): Promise<void>;
    refreshToken(): Promise<string>;
    logout(): void;
    handleSetUser(user: User): void;
}

const TOKEN_KEY = "rci_token";
const REFRESH_TOKEN_KEY = "rci_refresh_token";
const USER_KEY = "rci_user";


const AuthContext = createContext({} as IAuthContext);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!localStorage.getItem(TOKEN_KEY);

    const { data: fetchedUser } = useQuery({
        queryKey: ['get-user'],
        queryFn: async () => fetcher<User>('/app/perfil'),
        staleTime: 0,
        enabled: isAuthenticated,
    });

    const login = useCallback(async (data: { email: string, password: string }) => {
        const loginData = await fetcher<LoginResponse>('/token/', {
            method: 'POST',
            body: JSON.stringify({
                username: data.email,
                password: data.password,
            }),
            withoutAuth: true,
        });

        const userData = await fetcher<User>('/app/perfil', {
            token: loginData.access,
        });

        setUser({ ...userData, token: loginData.access, refresh_token: loginData.refresh });

        localStorage.setItem(TOKEN_KEY, loginData.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, loginData.refresh);
    }, []);

    const handleSetUser = useCallback((user: User | null) => {
        setUser(user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    }, []);

    const refreshToken = async () => {
        const newToken = "mock_jwt_token_" + Date.now();
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
    };

    useEffect(() => {
        setUser(fetchedUser);
    }, [fetchedUser]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshToken, handleSetUser }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};
