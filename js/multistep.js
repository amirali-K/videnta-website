/* ═══════════════════════════════════════════════════
   Multi-Step Form Handler
   ═══════════════════════════════════════════════════ */

(function () {

  function initMultiStep(form) {
    const steps   = Array.from(form.querySelectorAll('.ms-step'));
    const bar     = form.querySelector('.ms-bar');
    const success = form.querySelector('.ms-success');
    let current   = 0;

    const updateBar = () => {
      if (!bar) return;
      bar.style.width = ((current + 1) / (steps.length) * 100) + '%';
    };

    const showStep = (idx) => {
      steps.forEach((s, i) => s.classList.toggle('hidden', i !== idx));
      current = idx;
      updateBar();
      // Animate new step in
      const step = steps[idx];
      step.style.opacity = '0';
      step.style.transform = 'translateY(12px)';
      requestAnimationFrame(() => {
        step.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        step.style.opacity = '1';
        step.style.transform = 'translateY(0)';
      });
    };

    const validateStep = (idx) => {
      let valid = true;
      steps[idx].querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.classList.remove('error');
        if (!input.value.trim()) {
          input.classList.add('error');
          input.addEventListener('input', () => input.classList.remove('error'), { once: true });
          valid = false;
        }
      });
      if (!valid) steps[idx].querySelector('input[required]')?.focus();
      return valid;
    };

    // Next buttons
    form.querySelectorAll('.ms-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!validateStep(current)) return;
        if (current < steps.length - 1) showStep(current + 1);
      });
    });

    // Back buttons
    form.querySelectorAll('.ms-back').forEach(btn => {
      btn.addEventListener('click', () => {
        if (current > 0) showStep(current - 1);
      });
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(current)) return;

      const submitBtn = form.querySelector('.ms-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.6'; }

      setTimeout(() => {
        steps[current].classList.add('hidden');
        if (success) {
          success.classList.remove('hidden');
          success.style.opacity = '0';
          requestAnimationFrame(() => {
            success.style.transition = 'opacity 0.5s ease';
            success.style.opacity = '1';
          });
        }
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
        // Reset after 6s
        setTimeout(() => {
          success?.classList.add('hidden');
          showStep(0);
        }, 6000);
      }, 600);
    });

    // Init
    updateBar();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ms-form').forEach(initMultiStep);
  });

})();
