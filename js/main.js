document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 Fisio Tunich — Loaded');
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
});
