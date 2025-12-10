import { supabase } from './supabaseClient.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  // Attach Supabase access token if available so backend can authenticate the user.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const authHeader = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return res.text();
}

export function getApiBase() {
  return API_BASE;
}

export async function getHealth() {
  return request('/api/v1/health');
}

// Generic helpers for future use
export async function get(path) {
  return request(path, { method: 'GET' });
}

export async function post(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function patch(path, body) {
  return request(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function del(path) {
  return request(path, { method: 'DELETE' });
}
