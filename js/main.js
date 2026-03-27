/* ============================================
   FISIO TUNICH — Main JavaScript
   ============================================
   Global initialization and shared utilities.
   This file loads AFTER template-loader.js
   and animations.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 Fisio Tunich — Loaded');
});

/**
 * Smooth scroll to top (used by back-to-top buttons, etc.)
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Adds a class to body when the page is fully loaded
 * (useful for entrance animations)
 */
window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
});
