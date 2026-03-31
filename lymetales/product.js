/* ============================================
   LYMETALES — Product Detail Page JS (v2)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. HEADER SCROLL ──────────────────────────────────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── 2. ANNOUNCE BAR DISMISS ──────────────────────────────────
  document.getElementById('announce-close')?.addEventListener('click', () => {
    document.getElementById('announcement-bar').style.display = 'none';
  });

  // ─── 3. MOBILE MENU ───────────────────────────────────────────
  document.getElementById('hamburger-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.add('open');
  });
  document.getElementById('menu-close-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.remove('open');
  });

  // ─── 4. THUMBNAIL GALLERY ─────────────────────────────────────
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.pdp-thumb');

  if (mainImage) {
    mainImage.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      if (mainImage && src) {
        mainImage.style.opacity = '0';
        mainImage.style.transform = 'scale(0.97)';
        setTimeout(() => {
          mainImage.src = src;
          mainImage.style.opacity = '1';
          mainImage.style.transform = '';
        }, 200);
      }
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // ─── 5. CONFIGURATOR: LIVE NAME PREVIEW ───────────────────────
  const configName = document.getElementById('configName');
  const configLiveNamePreview = document.getElementById('configLiveNamePreview');
  const configPreviewHint = document.getElementById('configPreviewHint');

  function formatName(val) {
    if (!val.trim()) return 'your child';
    return val.trim().charAt(0).toUpperCase() + val.trim().slice(1);
  }

  configName?.addEventListener('input', (e) => {
    const name = formatName(e.target.value);
    if (configLiveNamePreview) configLiveNamePreview.textContent = name;
    if (configPreviewHint) {
      configPreviewHint.style.background = e.target.value
        ? 'rgba(15,76,58,0.10)'
        : 'rgba(15,76,58,0.06)';
    }
  });

  // ─── 6. CONFIGURATOR: GENDER BUTTONS ──────────────────────────
  document.querySelectorAll('.config-icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.config-icon-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── 7. CONFIGURATOR: SWATCH SELECTS ──────────────────────────
  ['skinSwatches', 'hairSwatches'].forEach(groupId => {
    const group = document.getElementById(groupId);
    group?.querySelectorAll('.config-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        group.querySelectorAll('.config-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        // Brief press animation
        swatch.style.transform = 'scale(0.9)';
        setTimeout(() => { swatch.style.transform = ''; }, 150);
      });
    });
  });

  // ─── 8. STICKY MINI BAR ───────────────────────────────────────
  const stickyBar = document.getElementById('stickyBar');
  const pdpHero = document.querySelector('.pdp-hero');

  if (stickyBar && pdpHero) {
    const observer = new IntersectionObserver(
      ([entry]) => stickyBar.classList.toggle('visible', !entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(pdpHero);
  }

  // ─── 9. SCROLL FADE-UP ────────────────────────────────────────
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // ─── 10. FAQ ACCORDION ────────────────────────────────────────
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── 11. REVIEW STAR SELECTOR ─────────────────────────────────
  const starBtns = document.querySelectorAll('.review-form-stars button');
  let selectedStar = 0;

  starBtns.forEach(btn => {
    btn.addEventListener('mouseover', () => {
      const val = parseInt(btn.dataset.star);
      starBtns.forEach((b, i) => {
        b.style.color = i < val ? '#F9A825' : 'rgba(0,0,0,0.18)';
      });
    });
    btn.addEventListener('mouseleave', () => {
      starBtns.forEach((b, i) => {
        b.style.color = i < selectedStar ? '#F9A825' : 'rgba(0,0,0,0.18)';
      });
    });
    btn.addEventListener('click', () => {
      selectedStar = parseInt(btn.dataset.star);
      const hintEl = document.querySelector('.review-form-stars span');
      const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Perfect!'];
      if (hintEl) hintEl.textContent = labels[selectedStar] || 'Click to rate';
      starBtns.forEach(b => b.classList.remove('active'));
      for (let i = 0; i < selectedStar; i++) starBtns[i].classList.add('active');
    });
  });

  // ─── 12. REVIEW FORM SUBMIT ────────────────────────────────────
  document.querySelector('.review-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    btn.textContent = 'Thank you! ✓';
    btn.style.background = '#2E8B57';
    setTimeout(() => {
      btn.textContent = 'Submit Review';
      btn.style.background = '';
    }, 3000);
  });

  // ─── 13. NEWSLETTER FORM SUBMIT ────────────────────────────────
  document.querySelector('.pdp-newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    btn.textContent = 'You\'re in! ✓';
    btn.style.background = '#2E8B57';
    btn.style.color = '#fff';
  });

  // ─── 14. SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
