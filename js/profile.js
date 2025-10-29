// Minimal, reusing your helpers
import { ensureApiKey, getAuctionProfile, updateAuctionProfile } from './api/api.js';

const nameEl = document.getElementById('profileName');
const emailEl = document.getElementById('profileEmail');
const creditsEl = document.getElementById('profileCredits');
const avatarEl = document.getElementById('profileAvatar');
const msgEl = document.getElementById('profMsg');
const logoutBtn = document.getElementById('logoutBtn');

const openAvatarSettingsBtn = document.getElementById('openAvatarSettings');
const avatarSettings = document.getElementById('avatarSettings');

const avatarForm = document.getElementById('avatarForm');
const avatarUrlEl = document.getElementById('avatarUrl');
const avatarAltEl = document.getElementById('avatarAlt');
const avatarMsg = document.getElementById('avatarMsg');
const saveAvatarBtn = document.getElementById('saveAvatarBtn');

const statListingsEl = document.getElementById('statListings');
const statWinsEl = document.getElementById('statWins');
const statActiveEl = document.getElementById('statActive');
const statEndedEl = document.getElementById('statEnded');

function setMsg(text, cls = 'text-gray-600') {
  if (!msgEl) return;
  msgEl.textContent = text || '';
  msgEl.className = `relative text-sm mt-3 h-5 ${cls}`;
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

function countActiveEnded(listings = []) {
  const now = Date.now();
  let active = 0, ended = 0;
  for (const l of listings) {
    const endsAt = l?.endsAt ? Date.parse(l.endsAt) : 0;
    if (endsAt && endsAt > now) active++;
    else ended++;
  }
  return { active, ended };
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
    await ensureApiKey(); // make sure X-Noroff-API-Key is present

    // include lists so we can show counts
    const res = await getAuctionProfile(username, { listings: true, wins: true });
    const data = res?.data || res;

    const loadedName = data?.name || username;
    if (nameEl) nameEl.textContent = loadedName;
    if (emailEl) emailEl.textContent = data?.email || '—';
    if (creditsEl) creditsEl.textContent = Number.isFinite(data?.credits) ? data.credits : '—';

    const avatarUrl = data?.avatar?.url;
    if (avatarEl) {
      if (avatarUrl) {
        avatarEl.src = avatarUrl;
        avatarEl.alt = data?.avatar?.alt || `${loadedName}'s avatar`;
      } else {
        avatarEl.alt = 'Default mushroom avatar';
      }
    }
    if (avatarUrlEl && avatarUrl) avatarUrlEl.value = avatarUrl;

    const listings = Array.isArray(data?.listings) ? data.listings : [];
    const wins = Array.isArray(data?.wins) ? data.wins : [];

    if (statListingsEl) statListingsEl.textContent = listings.length.toString();
    if (statWinsEl) statWinsEl.textContent = wins.length.toString();

    const { active, ended } = countActiveEnded(listings);
    if (statActiveEl) statActiveEl.textContent = active.toString();
    if (statEndedEl) statEndedEl.textContent = ended.toString();

    if (openAvatarSettingsBtn) openAvatarSettingsBtn.classList.remove('hidden');
    setMsg('');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not load profile';
    setMsg(msg, 'text-red-700');
  }
}

// toggle settings
if (openAvatarSettingsBtn && avatarSettings) {
  openAvatarSettingsBtn.addEventListener('click', () => {
    avatarSettings.classList.toggle('hidden');
    const expanded = openAvatarSettingsBtn.getAttribute('aria-expanded') === 'true';
    openAvatarSettingsBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
}

// save avatar
if (avatarForm) {
  avatarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    if (!username) {
      window.location.href = 'login.html';
      return;
    }

    const url = (avatarUrlEl?.value || '').trim();
    const alt = (avatarAltEl?.value || '').trim();

    if (!/^https?:\/\//i.test(url)) {
      setAvatarMsg('Please paste a valid image URL (https://…).', 'error');
      return;
    }

    try {
      saveAvatarBtn.disabled = true;
      saveAvatarBtn.textContent = 'Saving…';
      setAvatarMsg('Updating avatar…', 'info');

      const res = await updateAuctionProfile(username, {
        avatar: { url, ...(alt ? { alt } : {}) },
      });

      const data = res?.data || res;
      const newUrl = data?.avatar?.url || url;
      const newAlt = data?.avatar?.alt || alt || `${username}'s avatar`;

      if (avatarEl) {
        avatarEl.src = newUrl;
        avatarEl.alt = newAlt;
      }

      setAvatarMsg('Avatar updated!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not update avatar.';
      setAvatarMsg(msg, 'error');
    } finally {
      saveAvatarBtn.disabled = false;
      saveAvatarBtn.textContent = 'Save avatar';
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

// tiny footer year
document.getElementById('year')?.append(new Date().getFullYear().toString());

// go
loadProfile();
