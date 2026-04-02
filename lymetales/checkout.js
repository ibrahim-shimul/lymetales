/* ============================================================
   LYMETALES — Checkout engine
   Reads state from localStorage and handles UI validations
   ============================================================ */

(function () {
  'use strict';

  let cartData = null;
  
  const PRICES = {
    BASE: 29.99,
    HC_ADD: 10.00,
    POSTER: 14.99,
    GIFT_WRAP: 4.90,
    SHIPPING_STD: 4.90,
    SHIPPING_EXP: 9.90,
    SHIPPING_THRESHOLD: 40.00
  };

  const state = {
    delivery: 'standard', // 'standard' | 'express'
    addGiftWrap: false
  };

  const qs = (sel, ctx = document) => ctx.querySelector(sel);

  /* ── INIT ── */
  function init() {
    loadCart();
    renderSummary();
    setupInteractions();
    setupValidation();
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem('lymetales_cart');
      if (raw) cartData = JSON.parse(raw);
    } catch (e) { console.error('Error parsing cart:', e); }
    
    // Fallback if accessed directly
    if (!cartData || !cartData.book) {
      cartData = {
        book: { name: 'Your Child', gender: 'girl', hardcover: false },
        qty: 1,
        upsells: { poster: false, giftWrap: false }
      };
    }
  }

  function renderSummary() {
    const list = qs('#chkSummaryItems');
    if (!list) return;

    let html = '';
    let itemSubtotal = 0;

    // Book item
    if (cartData.book) {
      const b = cartData.book;
      const isHc = b.hardcover;
      const base = isHc ? PRICES.BASE + PRICES.HC_ADD : PRICES.BASE;
      const totalItem = base * cartData.qty;
      itemSubtotal += totalItem;

      html += `
        <div class="chk-item">
          <div class="chk-item-img-wrap">
            <img src="assets/book_1.png" alt="Book" class="chk-item-img">
            <div class="chk-item-qty">${cartData.qty}</div>
          </div>
          <div class="chk-item-details">
            <div class="chk-item-title">My First Easter Egg Hunt</div>
            <div class="chk-item-meta">${isHc ? 'Hardcover' : 'Softcover'} · Starring ${b.name || 'your child'}</div>
          </div>
          <div class="chk-item-price">€${totalItem.toFixed(2)}</div>
        </div>
      `;
    }

    // Upsells
    if (cartData.upsells.poster) {
      itemSubtotal += PRICES.POSTER;
      html += `
        <div class="chk-item">
          <div class="chk-item-img-wrap" style="background:#EAF2EE;font-size:1.5rem;">🖼️</div>
          <div class="chk-item-details">
            <div class="chk-item-title">Personalised Poster</div>
          </div>
          <div class="chk-item-price">€${PRICES.POSTER.toFixed(2)}</div>
        </div>
      `;
    }
    
    // Existing cart gift wrap OR local bump gift wrap
    const hasWrap = cartData.upsells.giftWrap || state.addGiftWrap;
    if (hasWrap) {
      itemSubtotal += PRICES.GIFT_WRAP;
      html += `
        <div class="chk-item">
          <div class="chk-item-img-wrap" style="background:#EAF2EE;font-size:1.5rem;">🎁</div>
          <div class="chk-item-details">
            <div class="chk-item-title">Premium Gift Wrap</div>
          </div>
          <div class="chk-item-price">€${PRICES.GIFT_WRAP.toFixed(2)}</div>
        </div>
      `;
    }

    list.innerHTML = html;

    // Calc shipping
    let shipping = 0;
    if (state.delivery === 'express') {
      shipping = PRICES.SHIPPING_EXP;
    } else {
      shipping = itemSubtotal >= PRICES.SHIPPING_THRESHOLD ? 0 : PRICES.SHIPPING_STD;
    }

    // Sync UI text
    qs('#chkSubtotalVal').textContent = `€${itemSubtotal.toFixed(2)}`;
    qs('#chkShippingVal').textContent = shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`;
    qs('#chkTotalVal').textContent = `€${(itemSubtotal + shipping).toFixed(2)}`;
    qs('#chkStdPrice').textContent   = itemSubtotal >= PRICES.SHIPPING_THRESHOLD ? 'Free' : `€${PRICES.SHIPPING_STD.toFixed(2)}`;

    // Sync button text
    qs('#chkPayBtn span').textContent = `Pay €${(itemSubtotal + shipping).toFixed(2)}`;
  }

  function setupInteractions() {
    // Delivery radio
    const delRadios = document.querySelectorAll('input[name="delivery"]');
    delRadios.forEach(rad => {
      rad.addEventListener('change', (e) => {
        state.delivery = e.target.value;
        const labels = document.querySelectorAll('.chk-method-card');
        labels.forEach(l => l.classList.remove('active'));
        e.target.closest('.chk-method-card').classList.add('active');
        renderSummary();
      });
    });

    // Payment radio (accordion)
    const payRadios = document.querySelectorAll('input[name="payment"]');
    payRadios.forEach(rad => {
      rad.addEventListener('change', (e) => {
        const labels = document.querySelectorAll('.chk-pay-card');
        labels.forEach(l => l.classList.remove('active'));
        e.target.closest('.chk-pay-card').classList.add('active');
        
        // Remove required attribute from card inputs if not card method
        const isCard = e.target.value === 'card';
        ['#chkCardNum', '#chkExp', '#chkCvc', '#chkNameOnCard'].forEach(id => {
          const inp = qs(id);
          if (inp) inp.required = isCard;
        });
      });
    });

    // Bump
    const wrapToggle = qs('#chkGiftWrapToggle');
    if (wrapToggle) {
      if (cartData && cartData.upsells && cartData.upsells.giftWrap) {
        wrapToggle.checked = true;
        state.addGiftWrap = true;
      }
      wrapToggle.addEventListener('change', (e) => {
        state.addGiftWrap = e.target.checked;
        if(cartData) cartData.upsells.giftWrap = e.target.checked;
        renderSummary();
      });
    }

    // Pay now fake logic
    const payBtn = qs('#chkPayBtn');
    payBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Inline visual check
      const required = document.querySelectorAll('input[required]');
      let allValid = true;
      required.forEach(inp => {
        if (!inp.value.trim()) {
          inp.classList.add('error');
          allValid = false;
        } else {
          inp.classList.remove('error');
        }
      });

      if (!allValid) {
        qs('input.error').focus();
        return;
      }

      // Success loading state
      payBtn.disabled = true;
      const textSpan = payBtn.querySelector('span');
      const spinner = payBtn.querySelector('.btn-spinner');
      if(textSpan) textSpan.textContent = 'Processing...';
      if(spinner) spinner.style.display = 'inline-block';
      
      setTimeout(() => {
        window.location.href = 'success.html';
      }, 1500);
    });
  }

  function setupValidation() {
    const inputs = document.querySelectorAll('.chk-input');
    inputs.forEach(inp => {
      inp.addEventListener('blur', () => {
        if (inp.required && !inp.value.trim()) {
          inp.classList.add('error');
        } else {
          inp.classList.remove('error');
        }
      });
      inp.addEventListener('input', () => {
        inp.classList.remove('error');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
