/* ========================
   FinanceFlow — script.js
======================== */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on nav link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
      let delay = 0;
      if (siblings) {
        Array.from(siblings).forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
      }
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  const prefixText = el.dataset.prefix || '';
  const suffixText = el.dataset.suffixText || '';
  const isLarge = target >= 1000000000;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);

    let displayVal;
    if (isLarge) {
      // Show as $2.4B+
      const val = (target * eased) / 1e9;
      displayVal = prefixText + val.toFixed(1) + 'B' + suffixText;
    } else {
      const val = Math.floor(target * eased);
      displayVal = prefixText + val.toLocaleString() + suffixText;
    }
    el.textContent = displayVal;

    if (progress < 1) requestAnimationFrame(step);
    else {
      if (isLarge) el.textContent = '$2.4B+';
      else el.textContent = prefixText + target.toLocaleString() + suffixText;
    }
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ===== PRICING TOGGLE =====
const monthlyBtn  = document.getElementById('toggle-monthly');
const annualBtn   = document.getElementById('toggle-annual');
const priceAmounts = document.querySelectorAll('.price-amount[data-monthly]');

function setPricing(mode) {
  priceAmounts.forEach(el => {
    const val = mode === 'annual' ? el.dataset.annual : el.dataset.monthly;
    el.textContent = '$' + val;
  });
  if (mode === 'annual') {
    annualBtn.classList.add('active');
    annualBtn.setAttribute('aria-pressed', 'true');
    monthlyBtn.classList.remove('active');
    monthlyBtn.setAttribute('aria-pressed', 'false');
  } else {
    monthlyBtn.classList.add('active');
    monthlyBtn.setAttribute('aria-pressed', 'true');
    annualBtn.classList.remove('active');
    annualBtn.setAttribute('aria-pressed', 'false');
  }
}

monthlyBtn.addEventListener('click', () => setPricing('monthly'));
annualBtn.addEventListener('click',  () => setPricing('annual'));

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const yOffset = -90; // offset for fixed navbar
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ===== FLOATING NAVBAR ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#0EA5E9';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => activeObserver.observe(sec));
