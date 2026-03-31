document.addEventListener('DOMContentLoaded', () => {

  // --- Dismiss announcement bar ---
  const announceClose = document.getElementById('announce-close');
  const announceBar = document.getElementById('announcement-bar');
  announceClose?.addEventListener('click', () => {
    announceBar.style.display = 'none';
  });

  // --- Sticky header glow on scroll ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  // --- Scroll fade-up animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // --- Mobile menu toggle ---
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('menu-close-btn');

  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeBtn?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) mobileMenu.classList.remove('open');
  });

  // --- FAQ Accordion ---
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless already open)
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

});
