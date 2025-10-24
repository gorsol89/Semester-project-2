// This code is from the JS2 CA 

export const API_BASE = import.meta.env.VITE_API_BASE;
const DEFAULT_API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

function authHeaders() {
  return { 'Content-Type': 'application/json' };
}

function socialHeaders() {
  let apiKey = localStorage.getItem('apiKey');
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    apiKey = DEFAULT_API_KEY;
  }
  const token  = localStorage.getItem('accessToken') || import.meta.env.VITE_BEARER_TOKEN;
  // Optionally, log the headers if debugging
  // console.log("Sending headers: ", {
  //   'Authorization': `Bearer ${token}`,
  //   'X-Noroff-API-Key': apiKey
  // });
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Noroff-API-Key': apiKey,
  };
}

export async function fetchAuth(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const { errors } = await res.json();
      throw new Error(errors ? errors[0] : 'Unknown error');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function fetchSocial(endpoint, options = {}) {
  //console.log("fetchSocial called:", endpoint, options);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...socialHeaders(),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const { errors } = await res.json();
      throw new Error(errors ? errors[0] : 'Unknown error');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}