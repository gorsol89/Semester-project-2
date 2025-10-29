// Auth handlers for register + login pages (SP2 - Auction House)
import { registerUser, loginUser, ensureApiKey, setToken } from './api.js';

// ---------- REGISTER ----------
const registerForm = document.getElementById('registerForm');
const registerMsg = document.getElementById('regMsg');
const registerBtn = document.getElementById('regBtn');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const name = form.name?.value.trim();
    const email = form.email?.value.trim();
    const password = form.password?.value;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      if (registerBtn) registerBtn.disabled = true;
      if (registerMsg) {
        registerMsg.textContent = 'Creating account…';
        registerMsg.className = 'text-sm mt-2 text-gray-600';
      }

      // 1) Register
      await registerUser({ name, email, password });

      // 2) Auto-login
      const loginRes = await loginUser({ email, password });
      const user = loginRes?.data || loginRes;
      const accessToken = user?.accessToken;
      const profileName = user?.name || name;

      if (accessToken) {
        setToken(accessToken);
      }
      if (profileName) localStorage.setItem('username', profileName);

      // 3) Ensure API key exists (create if missing)
      try {
        await ensureApiKey();
      } catch (_) {
        // ignore (we still let the user in; profile fetch will error if missing)
      }

      if (registerMsg) {
        registerMsg.textContent = 'Account created! Redirecting…';
        registerMsg.className = 'text-sm mt-2 text-green-700';
      }
      window.location.href = 'profile.html';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      if (registerMsg) {
        registerMsg.textContent = msg;
        registerMsg.className = 'text-sm mt-2 text-red-700';
      }
    } finally {
      if (registerBtn) registerBtn.disabled = false;
    }
  });
}

// ---------- LOGIN ----------
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const loginBtn = document.getElementById('loginBtn');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = form.email?.value.trim();
    const password = form.password?.value;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      if (loginBtn) loginBtn.disabled = true;
      if (loginMsg) {
        loginMsg.textContent = 'Signing in…';
        loginMsg.className = 'text-sm mt-2 text-gray-600';
      }

      const res = await loginUser({ email, password });
      const user = res?.data || res;

      const accessToken = user?.accessToken;
      const profileName = user?.name;

      if (accessToken) setToken(accessToken);
      if (profileName) localStorage.setItem('username', profileName);

      // Ensure API key exists for Auction endpoints
      try {
        await ensureApiKey();
      } catch (_) {
        // ignore
      }

      if (loginMsg) {
        loginMsg.textContent = 'Signed in! Redirecting…';
        loginMsg.className = 'text-sm mt-2 text-green-700';
      }
      window.location.href = 'profile.html';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (loginMsg) {
        loginMsg.textContent = msg;
        loginMsg.className = 'text-sm mt-2 text-red-700';
      }
    } finally {
      if (loginBtn) loginBtn.disabled = false;
    }
  });
}
