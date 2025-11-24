declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE?: string;
    [key: string]: string | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

const isFormData = (body: BodyInit | null | undefined): body is FormData => typeof FormData !== 'undefined' && body instanceof FormData;

export const fetchWithFallback = async <T>(path: string, fallback: () => Promise<T> | T, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE}${path}`;
  try {
    const headers: HeadersInit = options?.headers || {};
    const init: RequestInit = { ...options, headers };
    if (options?.body && !isFormData(options.body)) {
      init.headers = { 'Content-Type': 'application/json', ...headers };
    }

    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`Falling back to mock data for ${path}`, error);
    return await fallback();
  }
};