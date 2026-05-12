const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || API_URL;

type ErrorResponse = {
  message?: string;
};

async function request<T>(
  baseUrl: string,
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  let data: unknown;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = typeof data === 'object' && data !== null && 'message' in data
      ? (data as ErrorResponse).message
      : typeof data === 'string' ? data : undefined;
    throw new Error(errorMessage ?? `Request failed with status ${response.status}`);
  }

  return data as T;
}

export function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  token?: string | null
): Promise<T> {
  return request<T>(API_URL, endpoint, method, body, token);
}

export function authApiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  token?: string | null
): Promise<T> {
  return request<T>(AUTH_URL, endpoint, method, body, token);
}
