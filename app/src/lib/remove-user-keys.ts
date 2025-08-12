import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from "./keys";

export function removeUserKeys() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}