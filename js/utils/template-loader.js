/* ============================================
   FISIO TUNICH — Template Loader
   ============================================
   Dynamically loads navbar.html and footer.html
   into placeholder elements. Converts data-href
   attributes into correct relative href paths
   based on the current page's directory depth.
   ============================================ */

/**
 * Calculates how many directory levels deep the current page is
 * relative to the site root, and returns the appropriate prefix.
 * 
 * - /index.html          → depth=0 → prefix=""
 * - /pages/servicios.html → depth=1 → prefix="../"
 * - /pages/sub/page.html  → depth=2 → prefix="../../"
 * 
 * @returns {string} The relative path prefix to prepend to root-relative paths
 */
function getBasePath() {
  const path = window.location.pathname;
  
  // Remove leading slash and filename to get directory segments
  const cleanPath = path.replace(/^\//, '').replace(/[^/]*$/, '');
  
  // Count directory depth (number of slashes in the directory path)
  if (!cleanPath || cleanPath === '') {
    return ''; // We're at the root
  }
  
  const depth = cleanPath.split('/').filter(s => s.length > 0).length;
  
  if (depth === 0) {
    return '';
  }
  
  return '../'.repeat(depth);
}

/**
 * Resolves all data-href attributes inside a container to proper href,
 * prepending the correct base path for the current page depth.
 * @param {HTMLElement} container - The element containing links with data-href
 */
function resolveLinks(container) {
  const basePath = getBasePath();
  const links = container.querySelectorAll('[data-href]');

  links.forEach(link => {
    const relPath = link.getAttribute('data-href');
    link.setAttribute('href', basePath + relPath);
    link.removeAttribute('data-href');
  });
}

/**
 * Loads an HTML template from a file and injects it into a placeholder element.
 * After injection, resolves all data-href attributes.
 * @param {string} templatePath - Path to the template HTML file
 * @param {string} placeholderId - ID of the placeholder element
 * @returns {Promise<void>}
 */
async function loadTemplate(templatePath, placeholderId) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.warn(`[TemplateLoader] Placeholder #${placeholderId} not found.`);
    return;
  }

  try {
    const response = await fetch(templatePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    placeholder.innerHTML = html;

    // Resolve all data-href links to correct relative paths
    resolveLinks(placeholder);
  } catch (error) {
    console.error(`[TemplateLoader] Failed to load ${templatePath}:`, error);
  }
}

/**
 * Determines the correct path to the templates folder.
 * @returns {string} Path to templates folder
 */
function getTemplatePath() {
  return getBasePath() + 'templates/';
}

/**
 * Highlights the currently active link in the navbar based on the URL.
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-ft__link, .navbar-ft__cta');

  navLinks.forEach(link => {
    link.classList.remove('is-active');
    const href = link.getAttribute('href');

    if (!href || href === '#') return;

    // Get the filename from the href
    const linkFile = href.split('/').pop();
    // Get the filename from the current path
    const currentFile = currentPath.split('/').pop() || 'index.html';

    if (linkFile === currentFile) {
      link.classList.add('is-active');
    }
    // Handle root "/" case
    if ((currentPath === '/' || currentPath.endsWith('/')) && linkFile === 'index.html') {
      link.classList.add('is-active');
    }
  });
}

/**
 * Initializes all templates and post-load behaviors.
 */
async function initTemplates() {
  const basePath = getTemplatePath();

  // Load navbar and footer in parallel
  await Promise.all([
    loadTemplate(basePath + 'navbar.html', 'navbar-placeholder'),
    loadTemplate(basePath + 'footer.html', 'footer-placeholder')
  ]);

  // Post-load initialization
  setActiveNavLink();

  // Initialize navbar JS if the function exists
  if (typeof initNavbar === 'function') {
    initNavbar();
  }

  // Dispatch event for other scripts that need the templates loaded
  document.dispatchEvent(new CustomEvent('templatesLoaded'));
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTemplates);
