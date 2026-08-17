/** Relative `/api` in Docker/production (proxied by nginx); full URL for local Vite dev. */
export const API_URL = import.meta.env.VITE_API_URL || '/api';

export type ApiResult<T> = { data?: T; error?: string };

export function authHeaders(token?: string): Record<string, string> {
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, init);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json.error || res.statusText };
    return { data: json as T };
  } catch (err: any) {
    return { error: err?.message || 'Network error' };
  }
}
