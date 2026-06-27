/* ═══════════════════════════════════════════════════
   Before/After Slider + Service Form
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Before/After Slider ───────────────────────────
  const slider = document.getElementById('baSlider');
  if (slider) {
    const after  = slider.querySelector('.ba-after');
    const handle = document.getElementById('baHandle');
    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const raw  = (clientX - rect.left) / rect.width;
      const pos  = Math.max(0.02, Math.min(0.98, raw));
      const pct  = (pos * 100).toFixed(2);
      after.style.clipPath  = `inset(0 ${(100 - pos * 100).toFixed(2)}% 0 0)`;
      handle.style.left     = pct + '%';
    };

    // Mouse
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });
    window.addEventListener('mouseup',   () => isDragging = false);
    window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });

    // Touch
    handle.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend',   () => isDragging = false);
    window.addEventListener('touchmove',  (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Click anywhere on slider to jump
    slider.addEventListener('click', (e) => setPosition(e.clientX));

    // Init at 50%
    setPosition(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);
  }

  // ─── Consultation Form ─────────────────────────────
  const consultForm    = document.getElementById('consultForm');
  const consultSuccess = document.getElementById('consultSuccess');

  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = consultForm.querySelector('.form-submit');
    btn.textContent = 'در حال ارسال...';
    btn.disabled = true;

    setTimeout(() => {
      consultForm.querySelectorAll('input, textarea').forEach(el => el.value = '');
      consultSuccess.style.display = 'block';
      btn.textContent = 'درخواست مشاوره رایگان';
      btn.disabled = false;
      setTimeout(() => { consultSuccess.style.display = 'none'; }, 6000);
    }, 800);
  });

});
