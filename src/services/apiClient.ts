let inMemoryAccessToken: string | null = null;
let logoutCallback: (() => void) | null = null;

export const initApiClient = (logout: () => void) => {
  logoutCallback = logout;
};

export const setToken = (token: string) => { inMemoryAccessToken = token; };
export const getToken = (): string | null => inMemoryAccessToken;
export const clearToken = () => { inMemoryAccessToken = null; };

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

// The core function that wraps fetch and handles token refresh.
const fetchWithRefresh = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Add the Authorization header if we have a token.
  const headers = new Headers(options.headers || {});
  if (inMemoryAccessToken) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(url, { ...options, headers, credentials: 'include' });

  if (response.status === 401) {
    console.log('Access token expired. Attempting refresh...');

    try {
      const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        console.error("Refresh token failed. Logging out.");
        if (logoutCallback) logoutCallback();
        throw new Error('Session expired. Please log in again.');
      }

      const { token: newAccessToken }: { token: string } = await refreshResponse.json();
      setToken(newAccessToken);

      headers.set('Authorization', `Bearer ${newAccessToken}`);
      response = await fetch(url, { ...options, headers, credentials: 'include' });

    } catch (error) {
      console.error('Failed to refresh token:', error);
      if (logoutCallback) logoutCallback();
      throw error;
    }
  }

  return response;
};

export default fetchWithRefresh;