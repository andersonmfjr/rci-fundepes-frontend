const TOKEN_KEY = "rci_token";

export function applyCorrectHeaders(config: RequestInit | undefined) {
    let headers: Record<string, string> = {
        ...(config?.headers as Record<string, string>),
    };

    const token = localStorage.getItem(TOKEN_KEY);

    if (headers['Content-Type'] == 'multipart/form-data') delete headers['Content-Type'];
    else headers = { ...headers, 'Content-Type': 'application/json' };

    if (!config.withoutAuth)
        headers = { ...headers, Authorization: `Bearer ${token}` };

    return headers;
}