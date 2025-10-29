// Minimal profile loader + route guard for SP2
import { getAuctionProfile, updateAuctionProfile } from './api/api.js';

const nameEl = document.getElementById('profileName');
const emailEl = document.getElementById('profileEmail');
const creditsEl = document.getElementById('profileCredits');
const avatarEl = document.getElementById('profileAvatar');
const msgEl = document.getElementById('profMsg');
const logoutBtn = document.getElementById('logoutBtn');

// avatar settings UI
const openAvatarSettingsBtn = document.getElementById('openAvatarSettings');
const avatarSettings = document.getElementById('avatarSettings');

// avatar form elements
const avatarForm = document.getElementById('avatarForm');
const avatarUrlEl = document.getElementById('avatarUrl');
const avatarAltEl = document.getElementById('avatarAlt');
const avatarMsg = document.getElementById('avatarMsg');
const saveAvatarBtn = document.getElementById('saveAvatarBtn');

function setMsg(text, cls = 'text-gray-600') {
  if (!msgEl) return;
  msgEl.textContent = text || '';
  msgEl.className = `text-sm mt-3 h-5 ${cls}`;
}

function setAvatarMsg(text, type = 'info') {
  if (!avatarMsg) return;
  avatarMsg.textContent = text || '';
  avatarMsg.className = 'text-sm h-5';
  if (type === 'error') avatarMsg.classList.add('text-red-700');
  else if (type === 'success') avatarMsg.classList.add('text-green-700');
  else avatarMsg.classList.add('text-gray-600');
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

    const loadedName = data?.name || username;

    if (nameEl) nameEl.textContent = loadedName;
    if (emailEl) emailEl.textContent = data?.email || '—';
    if (creditsEl) {
      creditsEl.textContent = typeof data?.credits === 'number' ? data.credits : '—';
    }

    const avatarUrl = data?.avatar?.url;
    if (avatarEl) {
      if (avatarUrl) {
        avatarEl.src = avatarUrl;
        avatarEl.alt = `${loadedName}'s avatar`;
      } else {
        avatarEl.alt = 'Default mushroom avatar';
      }
    }

    // prefill current avatar url in the input
    if (avatarUrlEl && avatarUrl) avatarUrlEl.value = avatarUrl;

    // Only show settings if this is the logged-in user's own profile
    const isOwner = loadedName === username;
    if (openAvatarSettingsBtn) {
      if (isOwner) {
        openAvatarSettingsBtn.classList.remove('hidden');
      } else {
        openAvatarSettingsBtn.classList.add('hidden');
      }
    }

    setMsg('');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not load profile';
    setMsg(msg, 'text-red-700');
  }
}

// Toggle settings panel
if (openAvatarSettingsBtn && avatarSettings) {
  openAvatarSettingsBtn.addEventListener('click', () => {
    const isHidden = avatarSettings.classList.contains('hidden');
    if (isHidden) {
      avatarSettings.classList.remove('hidden');
      openAvatarSettingsBtn.setAttribute('aria-expanded', 'true');
    } else {
      avatarSettings.classList.add('hidden');
      openAvatarSettingsBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Save avatar
if (avatarForm) {
  avatarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    if (!username) {
      window.location.href = 'login.html';
      return;
    }

    const url = avatarUrlEl?.value.trim();
    const alt = (avatarAltEl?.value || '').trim();

    if (!url || !/^https?:\/\//i.test(url)) {
      setAvatarMsg('Please paste a valid image URL (e.g. from images.unsplash.com).', 'error');
      return;
    }

    try {
      if (saveAvatarBtn) {
        saveAvatarBtn.disabled = true;
        saveAvatarBtn.textContent = 'Saving…';
      }
      setAvatarMsg('Updating avatar…', 'info');

      // PUT /auction/profiles/:name  { avatar: { url, alt } }
      const res = await updateAuctionProfile(username, {
        avatar: { url, ...(alt ? { alt } : {}) },
      });

      const data = res?.data || res;
      const newUrl = data?.avatar?.url || url;

      if (avatarEl && newUrl) {
        avatarEl.src = newUrl;
        avatarEl.alt = alt || `${username}'s avatar`;
      }

      setAvatarMsg('Avatar updated!', 'success');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not update avatar. Check the URL and try again.';
      setAvatarMsg(msg, 'error');
    } finally {
      if (saveAvatarBtn) {
        saveAvatarBtn.disabled = false;
        saveAvatarBtn.textContent = 'Save avatar';
      }
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  });
}

loadProfile();
