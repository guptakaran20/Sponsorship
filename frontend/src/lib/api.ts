export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API = `${API_BASE_URL}/api`;
// Kept for any legacy code that may reference these — token is now managed via HTTP-only cookies
export const setAuthToken = (_token: string) => {};
export const getAuthToken = () => null;
export const removeAuthToken = () => {};

let csrfToken: string | null = null;

const getCsrfToken = async (): Promise<string | null> => {
    if (csrfToken) return csrfToken;
    try {
        const response = await fetch(`${API}/csrf-token`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            csrfToken = data.csrfToken;
            return csrfToken;
        }
    } catch {
        // ignore — server may not support CSRF tokens
    }
    return null;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Include CSRF token for state-changing requests
    const method = (options.method || 'GET').toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const csrf = await getCsrfToken();
        if (csrf) {
            headers.set('x-csrf-token', csrf);
        }
    }

    const response = await fetch(`${API}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
    });

    // If CSRF token is stale, invalidate the cache and retry once
    if (response.status === 403) {
        const errData = await response.json().catch(() => null);
        if (errData?.code === 'EBADCSRFTOKEN') {
            csrfToken = null;
            const newCsrf = await getCsrfToken();
            if (newCsrf) {
                headers.set('x-csrf-token', newCsrf);
                const retryResponse = await fetch(`${API}${endpoint}`, {
                    ...options,
                    credentials: 'include',
                    headers,
                });
                const retryData = await retryResponse.json().catch(() => null);
                if (!retryResponse.ok) {
                    throw new Error(retryData?.message || 'Something went wrong');
                }
                return retryData;
            }
        }
        throw new Error(errData?.message || 'Something went wrong');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        // Contextual error messages based on status code
        if (response.status === 401) {
            throw new Error(data?.message || 'Session expired. Please sign in again.');
        }
        if (response.status === 404) {
            throw new Error(data?.message || 'The requested resource was not found.');
        }
        if (response.status === 422 || response.status === 400) {
            throw new Error(data?.message || 'Please check your input and try again.');
        }
        if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
        }
        if (response.status >= 500) {
            throw new Error(data?.message || 'Server error. Please try again later.');
        }
        throw new Error(data?.message || 'Something went wrong');
    }

    return data;
};
