// Auth handlers for register + login pages (SP2 - Auction House)
import { registerUser, loginUser } from './api/api.js';

// ---------- REGISTER ----------
const registerForm = document.getElementById('registerForm');
const registerMsg = document.getElementById('regMsg');
const registerBtn = document.getElementById('regBtn');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Only required fields exist in your form right now
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

      // 1) Register (no token returned here)
      await registerUser({ name, email, password });

      // 2) Auto-login to get accessToken
      const loginRes = await loginUser({ email, password });
      const user = loginRes?.data || loginRes;

      const accessToken = user?.accessToken;
      const profileName = user?.name || name;

      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (profileName) localStorage.setItem('username', profileName);

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

      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (profileName) localStorage.setItem('username', profileName);

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
