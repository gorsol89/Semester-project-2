import '../src/styles/tailwind.css';

// Update footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

console.log('Tailwind ready.');
