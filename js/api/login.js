/**
 * Mushroom Market login flow (legacy, not used on page anymore)
 */

const API_BASE = 'https://v2.api.noroff.dev';

async function loginRequest(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

function saveLogin(profileData) {
  localStorage.setItem('accessToken', profileData.accessToken);
  localStorage.setItem('userProfile', JSON.stringify(profileData));
}

function setMessage(el, text, type = 'info') {
  if (!el) return;
  el.textContent = text || '';
  el.className = 'text-sm mt-2 h-5';
  if (type === 'error') el.classList.add('text-red-600');
  else if (type === 'success') el.classList.add('text-green-600');
  else el.classList.add('text-gray-600');
}

function setLoading(btn, isLoading) {
  if (!btn) return;
  btn.disabled = isLoading;
  if (isLoading) {
    btn.textContent = 'Signing in...';
    btn.classList.add('opacity-60', 'cursor-not-allowed');
  } else {
    btn.textContent = 'Sign in';
    btn.classList.remove('opacity-60', 'cursor-not-allowed');
  }
}

const formEl = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const msgEl = document.getElementById('loginMsg');
const btnEl = document.getElementById('loginBtn');

if (formEl && emailEl && passwordEl) {
  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if (!email || !password) {
      setMessage(msgEl, 'Please enter email and password.', 'error');
      return;
    }

    setLoading(btnEl, true);
    setMessage(msgEl, 'Signing you in...', 'info');

    try {
      const { ok, data } = await loginRequest(email, password);

      if (!ok) {
        const apiErrorMessage = data?.errors?.[0]?.message || 'Login failed. Check email/password.';
        setMessage(msgEl, apiErrorMessage, 'error');
        setLoading(btnEl, false);
        return;
      }

      const profileData = data?.data;
      if (!profileData || !profileData.accessToken) {
        setMessage(msgEl, 'Something went wrong: missing access token from server.', 'error');
        setLoading(btnEl, false);
        return;
      }

      saveLogin(profileData);
      setMessage(msgEl, `Welcome, ${profileData.name}!`, 'success');
      window.location.href = './profile.html';
    } catch (err) {
      console.error('Login error:', err);
      setMessage(msgEl, 'Network or server error. Please try again in a moment.', 'error');
      setLoading(btnEl, false);
    }
  });
}
