/**
 * Noroff API v2 helpers for Semester Project 2 (Auction House).
 * .env options:
 *  VITE_API_BASE=https://v2.api.noroff.dev
 *  (or) VITE_NOROFF_API_BASE=https://v2.api.noroff.dev
 *  VITE_NOROFF_API_KEY=your_app_key
 */

export const API_BASE = (
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_NOROFF_API_BASE ||
  'https://v2.api.noroff.dev'
).replace(/\/+$/, '');

export function getApiKey() {
  const fromStorage = localStorage.getItem('apiKey');
  if (fromStorage && fromStorage !== 'undefined' && fromStorage !== '') return fromStorage;
  return import.meta.env.VITE_NOROFF_API_KEY || import.meta.env.VITE_API_KEY;
}

export function setApiKey(key) {
  if (key) localStorage.setItem('apiKey', key);
}

export function getToken() {
  return localStorage.getItem('accessToken') || '';
}
export function setToken(token) {
  if (token) localStorage.setItem('accessToken', token);
}

export function keyHeaders() {
  const apiKey = getApiKey();
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'X-Noroff-API-Key': apiKey } : {}),
  };
}

export function authHeaders() {
  const token = getToken();
  const apiKey = getApiKey();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(apiKey ? { 'X-Noroff-API-Key': apiKey } : {}),
  };
}

function getErrorMessage(res, body) {
  if (body?.errors?.length) {
    const first = body.errors[0];
    return typeof first === 'string' ? first : first?.message || res.statusText;
  }
  return body?.message || res.statusText;
}

/**
 * Fetch wrapper for /auth endpoints.
 * Adds API key if available + Authorization if token exists.
 */
export async function fetchAuth(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...keyHeaders(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(getErrorMessage(res, data));
  return data;
}

/**
 * Fetch wrapper for /auction endpoints (requires token + api key).
 */
export async function fetchAuction(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(getErrorMessage(res, data));
  return data;
}

/**
 * Register a new user (stud.noroff.no email required).
 */
export function registerUser(payload) {
  return fetchAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login and receive accessToken.
 */
export function loginUser(payload) {
  return fetchAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Create and return an API key for the logged-in user.
 */
export async function createApiKey() {
  const res = await fetchAuth('/auth/create-api-key', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  const key = res?.data?.key || res?.data?.apiKey || res?.key || res?.apiKey;
  if (!key) throw new Error('Could not create API key');
  return key;
}

/**
 * Ensure an API key exists (env/localStorage). If missing and token exists, create one.
 */
export async function ensureApiKey() {
  let key = getApiKey();
  if (key && key !== 'undefined' && key !== '') return key;

  const token = getToken();
  if (!token) return null;

  const created = await createApiKey();
  setApiKey(created);
  return created;
}

/**
 * Get an Auction profile by name.
 */
export function getAuctionProfile(name, opts = {}) {
  const params = new URLSearchParams();
  if (opts.listings) params.set('_listings', 'true');
  if (opts.wins) params.set('_wins', 'true');
  const qs = params.toString() ? `?${params.toString()}` : '';
  return fetchAuction(`/auction/profiles/${encodeURIComponent(name)}${qs}`);
}

/**
 * Update Auction profile (avatar, banner, bio).
 * body can be: { avatar: { url, alt }, banner: { url, alt }, bio: "..." }
 */
export function updateAuctionProfile(name, body) {
  return fetchAuction(`/auction/profiles/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
