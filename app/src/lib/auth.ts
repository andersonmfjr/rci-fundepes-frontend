import { User } from "@/types";

const TOKEN_KEY = "rci_token";
const REFRESH_TOKEN_KEY = "rci_refresh_token";
const USER_KEY = "rci_user";

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "admin@rci.com" && password === "admin123") {
      const user: User = {
        id: "1",
        name: "Analista RCI",
        email: email,
        token: "mock_jwt_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
      };

      localStorage.setItem(TOKEN_KEY, user.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return user;
    }

    throw new Error("Credenciais inválidas");
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  refreshToken: async (): Promise<string> => {
    // Mock refresh token logic
    const newToken = "mock_jwt_token_" + Date.now();
    localStorage.setItem(TOKEN_KEY, newToken);
    return newToken;
  },
};
