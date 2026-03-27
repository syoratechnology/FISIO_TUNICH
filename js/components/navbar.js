/* ============================================
   FISIO TUNICH — Navbar Logic
   ============================================
   Handles scroll effect, mobile menu toggle,
   and overlay interactions.
   ============================================ */

/**
 * Initializes all navbar behaviors.
 * This is called after the navbar template is loaded.
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar-ft');
  if (!navbar) return;

  const hamburger = document.querySelector('.navbar-ft__hamburger');
  const nav = document.querySelector('.navbar-ft__nav');
  const overlay = document.querySelector('.navbar-ft__overlay');
  const navLinks = document.querySelectorAll('.navbar-ft__link');

  /* ── Scroll Effect ───────────────────────── */
  const SCROLL_THRESHOLD = 50;
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load (in case page is already scrolled)
  handleScroll();

  /* ── Mobile Menu Toggle ──────────────────── */
  function openMenu() {
    hamburger?.classList.add('is-active');
    nav?.classList.add('is-open');
    overlay?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger?.classList.remove('is-active');
    nav?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = nav?.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close menu on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      closeMenu();
    }
  });

  /* ── Smooth scroll for anchor links ──────── */
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}
