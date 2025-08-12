import { env } from "@/env";
import { applyCorrectHeaders } from "./apply-correct-headers";
import { removeUserKeys } from "./remove-user-keys";

export async function fetcher<T>(url: string, config?: RequestInit) {
  const baseURL = env.VITE_API_URL;
  const fullURL = `${baseURL}${url}`;

  const headers = applyCorrectHeaders(config);

  const response = await fetch(fullURL, {
    ...config,
    headers,
  });

  if (config?.method === "DELETE") {
    return null;
  }

  if (response.status === 400) {
    const errorData = await response.json();
    throw new Error(errorData[Object.keys(errorData)[0]]);
  }

  if (response.status === 401) {
    removeUserKeys();
    window.location.href = "/login";
  }

  if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

  const data: T = await response.json();

  return data;
}
