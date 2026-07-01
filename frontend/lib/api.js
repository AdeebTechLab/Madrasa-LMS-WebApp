const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sakinah_token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('sakinah_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem('sakinah_token', token);
  localStorage.setItem('sakinah_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('sakinah_token');
  localStorage.removeItem('sakinah_user');
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') clearSession();
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}
