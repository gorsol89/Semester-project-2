import "../styles/tailwind.css";

// Update footer year (no optional-chaining assignment)
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

console.log("Tailwind ready.");
