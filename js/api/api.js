/**
 * Noroff API v2 helpers for Semester Project 2 (Auction House).
 * Requires .env:
 *  VITE_API_BASE=https://v2.api.noroff.dev
 *  VITE_NOROFF_API_KEY=your_app_key
 */

export const API_BASE =
  (import.meta.env.VITE_API_BASE || 'https://v2.api.noroff.dev').replace(
    /\/+$/,
    ''
  );

/** Get stored API key (localStorage 'apiKey' overrides .env) */
export function getApiKey() {
  const fromStorage = localStorage.getItem('apiKey');
  return fromStorage && fromStorage !== 'undefined' && fromStorage !== ''
    ? fromStorage
    : import.meta.env.VITE_NOROFF_API_KEY;
}

/** Get stored access token from login */
export function getToken() {
  return localStorage.getItem('accessToken') || '';
}

/** Headers for JSON + API key only (Auth endpoints) */
export function keyHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': getApiKey(),
  };
}

/** Headers for JSON + API key + Bearer token (Auction endpoints) */
export function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': getApiKey(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Parse API error payload into a readable message */
function getErrorMessage(res, body) {
  if (body?.errors?.length) {
    const first = body.errors[0];
    return typeof first === 'string' ? first : first?.message || res.statusText;
  }
  return body?.message || res.statusText;
}

/**
 * Fetch wrapper for /auth endpoints (register/login).
 * @param {string} endpoint - Path beginning with /auth/...
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function fetchAuth(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...keyHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(getErrorMessage(res, data));
  }
  return data;
}

/**
 * Fetch wrapper for /auction endpoints (requires token + api key).
 * @param {string} endpoint - Path beginning with /auction/...
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
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
  if (!res.ok) {
    throw new Error(getErrorMessage(res, data));
  }
  return data;
}

/**
 * Register a new user (stud.noroff.no email required).
 * @param {{name:string,email:string,password:string,bio?:string,avatar?:{url:string,alt?:string},banner?:{url:string,alt?:string}}} payload
 */
export function registerUser(payload) {
  return fetchAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login and receive accessToken.
 * @param {{email:string,password:string}} payload
 * @returns {Promise<any>} -> { data: { accessToken, name, email, ... } }
 */
export function loginUser(payload) {
  return fetchAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Get an Auction profile by name.
 * @param {string} name
 * @param {{listings?:boolean,wins?:boolean}} [opts]
 */
export function getAuctionProfile(name, opts = {}) {
  const params = new URLSearchParams();
  if (opts.listings) params.set('_listings', 'true');
  if (opts.wins) params.set('_wins', 'true');
  const qs = params.toString() ? `?${params.toString()}` : '';
  return fetchAuction(`/auction/profiles/${encodeURIComponent(name)}${qs}`);
}
