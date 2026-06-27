/* ═══════════════════════════════════════════════════
   Mask Reveal Loader
   ═══════════════════════════════════════════════════ */

(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  // Logo + smile animate via CSS (no JS needed for those)
  // Just trigger the panel split at the right time

  // Split panels → reveal site
  setTimeout(() => loader.classList.add('reveal'), 1350);

  // Remove loader from DOM
  setTimeout(() => {
    loader.remove();
    document.body.classList.remove('loading');
  }, 2400);
})();
