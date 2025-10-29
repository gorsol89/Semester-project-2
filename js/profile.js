// Minimal profile loader + route guard for SP2
import { getAuctionProfile } from './api/api.js';

const nameEl = document.getElementById('profileName');
const emailEl = document.getElementById('profileEmail');
const creditsEl = document.getElementById('profileCredits');
const avatarEl = document.getElementById('profileAvatar');
const msgEl = document.getElementById('profMsg');
const logoutBtn = document.getElementById('logoutBtn');

function setMsg(text, cls = 'text-gray-600') {
  if (!msgEl) return;
  msgEl.textContent = text || '';
  msgEl.className = `text-sm mt-3 h-5 ${cls}`;
}

function requireAuth() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

async function loadProfile() {
  if (!requireAuth()) return;

  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'login.html';
    return;
  }

  try {
    setMsg('Loading profile…');
    const res = await getAuctionProfile(username);
    const data = res?.data || res;

    if (nameEl) nameEl.textContent = data?.name || username;
    if (emailEl) emailEl.textContent = data?.email || '—';
    if (creditsEl) {
      creditsEl.textContent = typeof data?.credits === 'number' ? data.credits : '—';
    }

    const avatarUrl = data?.avatar?.url;
    if (avatarEl) {
      if (avatarUrl) {
        avatarEl.src = avatarUrl;
        avatarEl.alt = `${data?.name || username}'s avatar`;
      } else {
        avatarEl.alt = 'Default mushroom avatar';
      }
    }

    setMsg('');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not load profile';
    setMsg(msg, 'text-red-700');
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  });
}

loadProfile();
