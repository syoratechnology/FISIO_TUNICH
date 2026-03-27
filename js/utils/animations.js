/* ============================================
   FISIO TUNICH — Scroll Animations
   ============================================
   Uses Intersection Observer to trigger CSS
   animations when elements scroll into view.
   ============================================ */

/**
 * Initializes scroll-based reveal animations.
 * Elements with [data-animate] attribute will be observed
 * and get the .is-visible class when they enter the viewport.
 * 
 * Usage in HTML:
 *   <div data-animate="fade-up">                 → fades up
 *   <div data-animate="fade-left" data-animate-delay="200">  → fades left with delay
 *   <div class="stagger-children" data-animate="fade-up">    → staggers children
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,          // viewport
    rootMargin: '0px 0px -80px 0px',  // trigger slightly before fully in view
    threshold: 0.15      // 15% visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once animated, stop observing for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Initializes a parallax scrolling effect on elements.
 * Elements with [data-parallax] will move at a different speed.
 * 
 * Usage: <div data-parallax="0.3"> (0 = no movement, 1 = full scroll speed)
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Counter animation for numbers.
 * Elements with [data-count-to] will animate from 0 to the target number.
 * 
 * Usage: <span data-count-to="500">0</span>
 */
function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const duration = parseInt(el.dataset.countDuration, 10) || 2000;
        const suffix = el.dataset.countSuffix || '';
        
        animateCounter(el, 0, target, duration, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(element, start, end, duration, suffix) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    
    element.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ── Initialize Everything ───────────────── */
function initAnimations() {
  initScrollAnimations();
  initParallax();
  initCounters();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initAnimations);

// Also re-init after templates are loaded (for elements inside templates)
document.addEventListener('templatesLoaded', () => {
  // Small delay to let the DOM settle
  requestAnimationFrame(initScrollAnimations);
});
