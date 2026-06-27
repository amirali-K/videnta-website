/* ═══════════════════════════════════════════════════
   وی‌دنتا — App JS
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Helpers ───────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function toPersian(n) {
    return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  // ─── Scroll Progress Bar ───────────────────────────
  const progressBar = $('#scrollProgress');
  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }

  // ─── Navbar Scroll ─────────────────────────────────
  const navbar = $('#navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  // ─── Active Nav Link ───────────────────────────────
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // ─── Scroll Events ─────────────────────────────────
  window.addEventListener('scroll', () => {
    updateProgress();
    updateNavbar();
    updateActiveLink();
  }, { passive: true });

  // ─── Hamburger Menu ────────────────────────────────
  const hamburger = $('#hamburger');
  const navLinksList = $('#navLinks');
  const mobileOverlay = $('#mobileOverlay');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    navLinksList.classList.toggle('open', open);
    mobileOverlay.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    toggleMenu(!hamburger.classList.contains('open'));
  });

  mobileOverlay.addEventListener('click', () => toggleMenu(false));

  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ─── Smooth Scroll for Internal Links ──────────────
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── Scroll Reveal (Intersection Observer) ─────────
  const revealOpts = { threshold: 0.10, rootMargin: '0px 0px -32px 0px' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOpts);

  $$('.reveal, .reveal-light, .reveal-right').forEach(el => revealObserver.observe(el));

  // ─── Feature Items Stagger ─────────────────────────
  const featureObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.feature-item').forEach(item => {
          featureObs_single.observe(item);
        });
        featureObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const featureObs_single = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        featureObs_single.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  const featureWrap = document.querySelector('.service-features');
  if (featureWrap) featureObs.observe(featureWrap);

  // ─── Counter Animation ─────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const suffix = el.nextElementSibling?.classList.contains('stat-plus')
      ? '' : el.nextElementSibling?.classList.contains('stat-pct') ? '' : '';

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = toPersian(val);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = toPersian(target);
    };
    requestAnimationFrame(update);
  }

  const counterOpts = { threshold: 0.4 };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, counterOpts);

  $$('.counter').forEach(el => counterObserver.observe(el));

  // ─── Magnetic Buttons ──────────────────────────────
  function initMagnetic() {
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.08s ease';
      });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Only enable magnetic on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    initMagnetic();
  }

  // ─── Cursor Dot (desktop only) ─────────────────────
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: rgba(28, 53, 87, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9995;
      transform: translate(-50%, -50%);
      transition: transform 0.08s ease, opacity 0.3s;
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(dot);

    let cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
    });

    // Grow on interactive elements
    $$('a, button, .service-card, .article-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(3)';
        dot.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.opacity = '1';
      });
    });
  }

  // ─── Services Hover Slideshow ──────────────────────
  function initSlideshow() {
    const items    = $$('.sh-item');
    const images   = $$('.sh-img');
    const dots     = $$('.sh-dot');
    const nameEl   = $('#shPreviewName');
    const grid     = $('.sh-grid');
    if (!items.length) return;

    let autoTimer  = null;
    let currentIdx = 0;
    let isPaused   = false;

    function activate(service, idx) {
      items.forEach(i => i.classList.remove('active'));
      images.forEach(i => i.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      const item = document.querySelector(`.sh-item[data-service="${service}"]`);
      const img  = document.querySelector(`.sh-img[data-service="${service}"]`);
      const dot  = document.querySelector(`.sh-dot[data-service="${service}"]`);

      item?.classList.add('active');
      img?.classList.add('active');
      dot?.classList.add('active');

      if (nameEl && item) {
        nameEl.textContent = item.querySelector('.sh-name')?.textContent || '';
      }
      currentIdx = idx;
    }

    // Hover on list items
    items.forEach((item, idx) => {
      item.addEventListener('mouseenter', () => {
        isPaused = true;
        clearInterval(autoTimer);
        activate(item.dataset.service, idx);
      });
    });

    // Resume auto on mouse leave from grid
    grid?.addEventListener('mouseleave', () => {
      isPaused = false;
      startAuto();
    });

    // Auto-rotate every 3s
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (isPaused) return;
        currentIdx = (currentIdx + 1) % items.length;
        const next = items[currentIdx];
        activate(next.dataset.service, currentIdx);
      }, 3000);
    }

    // Init
    activate(items[0].dataset.service, 0);
    startAuto();
  }

  initSlideshow();

  // ─── Hero Video Playlist (seamless crossfade) ──────
  function initHeroPlaylist() {
    const srcs = [
      'assets/video/teaser-1.mp4',
      'assets/video/teaser-2.mp4',
      'assets/video/teaser-3.mp4'
    ];
    const vA = document.getElementById('heroVideoA');
    const vB = document.getElementById('heroVideoB');
    if (!vA || !vB) return;

    let idx = 0;
    let cur = vA, nxt = vB;
    const FADE_SEC = 0.7; // seconds before end to start crossfade

    function loadPlay(el, src) {
      return new Promise((res) => {
        el.src = src;
        el.load();
        const onCan = () => { el.removeEventListener('canplay', onCan); res(); };
        el.addEventListener('canplay', onCan);
        el.play().catch(() => {});
      });
    }

    function crossfade() {
      const nextIdx = (idx + 1) % srcs.length;

      // Prepare next video silently
      nxt.style.zIndex = '2';
      loadPlay(nxt, srcs[nextIdx]).then(() => {
        // Fade in next, fade out current simultaneously
        nxt.style.opacity = '1';
        cur.style.opacity = '0';

        setTimeout(() => {
          cur.pause();
          cur.removeAttribute('src');
          cur.style.zIndex = '1';
          cur.style.opacity = '0';
          // Swap roles
          [cur, nxt] = [nxt, cur];
          idx = nextIdx;
          watchEnd();
        }, FADE_SEC * 1000);
      });
    }

    function watchEnd() {
      const handler = () => {
        if (!cur.duration) return;
        if (cur.duration - cur.currentTime <= FADE_SEC + 0.15) {
          cur.removeEventListener('timeupdate', handler);
          crossfade();
        }
      };
      cur.addEventListener('timeupdate', handler);
    }

    // Boot: load first video and start
    loadPlay(vA, srcs[0]).then(() => {
      vA.style.opacity = '1';
      watchEnd();
    });
  }

  initHeroPlaylist();

  // ─── Typewriter on Service Card Hover ─────────────
  function initTypewriter() {
    $$('.service-card').forEach(card => {
      const desc = card.querySelector('.service-desc');
      if (!desc) return;

      const original = desc.textContent.trim();
      let timer = null;
      let active = false;

      card.addEventListener('mouseenter', () => {
        active = true;
        clearInterval(timer);
        desc.textContent = '';
        desc.style.minHeight = desc.scrollHeight + 'px';
        let i = 0;
        timer = setInterval(() => {
          if (!active || i >= original.length) { clearInterval(timer); return; }
          desc.textContent += original[i++];
        }, 22);
      });

      card.addEventListener('mouseleave', () => {
        active = false;
        clearInterval(timer);
        desc.textContent = original;
        desc.style.minHeight = '';
      });
    });
  }

  // Only on non-touch (hover devices)
  if (window.matchMedia('(hover: hover)').matches) {
    initTypewriter();
  }

  // ─── Quick Contact Form ────────────────────────────
  const quickForm    = $('#quickForm');
  const quickSuccess = $('#quickSuccess');

  quickForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = quickForm.querySelector('.quick-submit');
    btn.style.opacity = '0.6';
    btn.disabled = true;
    setTimeout(() => {
      quickForm.reset();
      quickSuccess.style.display = 'block';
      btn.style.opacity = '1';
      btn.disabled = false;
      setTimeout(() => { quickSuccess.style.display = 'none'; }, 5000);
    }, 700);
  });

  // ─── Floating Widget ───────────────────────────────
  const floatTrigger = $('#floatTrigger');
  const floatPanel   = $('#floatPanel');
  const floatClose   = $('#floatClose');
  const floatForm    = $('#floatForm');
  const floatSuccess = $('#floatSuccess');

  if (floatTrigger && floatPanel) {
    floatTrigger.addEventListener('click', () => {
      const isOpen = floatPanel.classList.contains('open');
      floatPanel.classList.toggle('open', !isOpen);
      floatPanel.setAttribute('aria-hidden', String(isOpen));
    });

    floatClose?.addEventListener('click', () => {
      floatPanel.classList.remove('open');
      floatPanel.setAttribute('aria-hidden', 'true');
    });

    floatForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      floatForm.style.display = 'none';
      floatSuccess.style.display = 'block';
      // Reset after 5s
      setTimeout(() => {
        floatForm.reset();
        floatForm.style.display = 'flex';
        floatSuccess.style.display = 'none';
        floatPanel.classList.remove('open');
        floatPanel.setAttribute('aria-hidden', 'true');
      }, 5000);
    });
  }

  // ─── Init ──────────────────────────────────────────
  updateNavbar();
  updateActiveLink();

});
