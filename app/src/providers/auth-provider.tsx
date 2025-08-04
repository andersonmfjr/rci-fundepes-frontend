/* eslint-disable react-refresh/only-export-components */
import { fetcher } from "@/lib/fetcher";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

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
    const isAuthenticated = !!user;

    const login = useCallback(async (data: { email: string, password: string }) => {
        const { data: fetchedUser } = await fetcher('/token/', {
            method: 'POST',
            body: JSON.stringify({
                username: data.email,
                password: data.password,
            }),
            withoutAuth: true,
        });

        console.log(fetchedUser);
        localStorage.setItem(TOKEN_KEY, user.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, user.refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }, [user]);

    const handleSetUser = useCallback((user: User | null) => {
        setUser(user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);

    const refreshToken = async () => {
        const newToken = "mock_jwt_token_" + Date.now();
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
    };

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
