const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

type ErrorResponse = {
  message?: string;
};

export async function apiRequest<T>(
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

  const response = await fetch(`${API_URL}${endpoint}`, {
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
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
  }

  return data as T;
}
