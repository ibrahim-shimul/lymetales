/**
 * faq.js - Core logic for accordion animations and category filtering
 * Updated to use global accordion classes: .accordion-item and .accordion-trigger
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. ACCORDION LOGIC
  const faqTriggers = document.querySelectorAll('.faq-item-wrapper .accordion-trigger');

  faqTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.accordion-item');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordions in this wrapper
      const allItems = document.querySelectorAll('.faq-item-wrapper .accordion-item');
      allItems.forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('open');
          item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      parentItem.classList.toggle('open');
      btn.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // 2. CATEGORY FILTERING
  const chips = document.querySelectorAll('.faq-chip');
  const items = document.querySelectorAll('.faq-item-wrapper .accordion-item');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Manage active state on chips
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');

      items.forEach(item => {
        // Reset expanded states when filtering
        item.classList.remove('open');
        item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');

        // Apply filter logic
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

});
