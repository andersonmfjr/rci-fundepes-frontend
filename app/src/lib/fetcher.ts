import { env } from "@/env";
import { applyCorrectHeaders } from "./apply-correct-headers";

export async function fetcher<T>(url: string, config?: RequestInit) {
    const baseURL = env.VITE_API_URL;
    const fullURL = `${baseURL}${url}`;

    const headers = applyCorrectHeaders(config);

    const response = await fetch(fullURL, {
        ...config,
        headers
    });

    if (config?.method === 'DELETE') {
        return { response, error: false, data: null as T, message: null };
    }

    if (response.status == 400) {
        const errorData = await response.json();
        return {
            data: null,
            error: true,
            message: errorData[Object.keys(errorData)[0]],
            response,
        };
    }

    if (!response.ok) {
        return {
            error: true,
            data: null,
            response,
            message: response.statusText,
        };
    }


    const data: T = await response.json();

    return { response, data, error: false, message: null };
}