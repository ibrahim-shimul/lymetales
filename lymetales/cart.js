/* ============================================================
   LYMETALES — Cart.js
   Dynamic Slide-in Cart state and UI engine
   ============================================================ */

(function () {
  'use strict';

  let cartState = {
    book: null,
    qty: 1,
    upsells: {
      poster: false,
      giftWrap: false
    }
  };

  const PRICES = {
    BASE: 29.99,
    HC_ADD: 10.00,
    POSTER: 14.99,
    GIFT_WRAP: 4.90,
    SHIPPING_THRESHOLD: 40.00,
    SHIPPING_FEE: 4.90
  };

  /* ── DOM HELPERS ── */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const ce = (tag, cls, html = '') => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html) el.innerHTML = html;
    return el;
  };

  /* ── INJECT CART DOM ── */
  function injectCart() {
    if (qs('#lymeCart')) return;

    const overlay = ce('div', 'cart-overlay');
    overlay.id = 'lymeCart';
    overlay.innerHTML = `
      <div class="cart-backdrop" id="cartBackdrop"></div>
      <div class="cart-drawer">
        <div class="cart-header">
          <h3 class="cart-title">Your Story</h3>
          <button class="cart-close" id="cartClose" aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="cart-body" id="cartBody">
          <!-- Populated dynamically -->
        </div>

        <div class="cart-footer" id="cartFooter" style="display:none;">
          <div class="cart-summary-line">
            <span>Subtotal</span>
            <span id="cartSubtotal">€0.00</span>
          </div>
          <div class="cart-summary-line" id="cartShippingLine">
            <span>Shipping</span>
            <span id="cartShippingFee">Calculated at checkout</span>
          </div>
          <div class="cart-summary-line total">
            <span>Total</span>
            <span id="cartTotal">€0.00</span>
          </div>
          
          <a href="checkout.html" class="cart-cta-primary" id="cartCheckoutBtn">Proceed to Checkout</a>
          <button class="cart-cta-secondary" id="cartContinueShopping">Continue shopping</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Events
    qs('#cartClose', overlay).addEventListener('click', closeCart);
    qs('#cartBackdrop', overlay).addEventListener('click', closeCart);
    qs('#cartContinueShopping', overlay).addEventListener('click', closeCart);
    qs('#cartCheckoutBtn', overlay).addEventListener('click', saveStateToStorage);
  }

  function renderCartBody() {
    const body = qs('#cartBody');
    const footer = qs('#cartFooter');

    if (!cartState.book) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛍️</div>
          <h4 class="cart-empty-title">Your cart is empty</h4>
          <p>Create a magical story for a special child.</p>
        </div>
      `;
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'block';

    const b = cartState.book;
    const name = b.name || 'your child';
    const isHardcover = b.hardcover;
    const basePrice = isHardcover ? PRICES.BASE + PRICES.HC_ADD : PRICES.BASE;
    const formatLabel = isHardcover ? 'Hardcover Book' : 'Softcover Book';

    let html = `
      <!-- PRODUCT -->
      <div class="cart-item">
        <button class="cart-item-edit" id="cartEditBtn">Edit</button>
        <div class="cart-item-img-wrap">
          <img src="assets/book_1.png" alt="Book Cover" class="cart-item-img">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">My First Easter Egg Hunt</h4>
          <div class="cart-item-meta">
            Format: <strong>${formatLabel}</strong><br>
            Starring: <strong>${name} (${b.gender})</strong>
            ${b.dedication ? '<br>✉️ Personal message included' : ''}
          </div>
          <div class="cart-item-controls">
            <div class="cart-qty">
              <button class="cart-qty-btn" id="cartQtyMinus">-</button>
              <div class="cart-qty-val">${cartState.qty}</div>
              <button class="cart-qty-btn" id="cartQtyPlus">+</button>
            </div>
            <div class="cart-item-price">€${(basePrice * cartState.qty).toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" id="cartRemoveItem">Remove item</button>
        </div>
      </div>

      <!-- UPSELLS -->
      <div class="cart-upsell-sec">
        <h4 class="cart-upsell-title">Make it even more special</h4>
        
        <div class="cart-upsell-item">
          <div class="cart-upsell-icon">🖼️</div>
          <div class="cart-upsell-info">
            <h5 class="cart-upsell-name">Personalised Poster</h5>
            <p class="cart-upsell-price">+ €${PRICES.POSTER.toFixed(2)}</p>
          </div>
          <button class="cart-upsell-add ${cartState.upsells.poster ? 'added' : ''}" data-upsell="poster">
            ${cartState.upsells.poster ? '✓ Added' : '+ Add'}
          </button>
        </div>

        <div class="cart-upsell-item">
          <div class="cart-upsell-icon">🎁</div>
          <div class="cart-upsell-info">
            <h5 class="cart-upsell-name">Premium Gift Wrap</h5>
            <p class="cart-upsell-price">+ €${PRICES.GIFT_WRAP.toFixed(2)}</p>
          </div>
          <button class="cart-upsell-add ${cartState.upsells.giftWrap ? 'added' : ''}" data-upsell="giftWrap">
            ${cartState.upsells.giftWrap ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
      
      <!-- DISCOUNT BANNER -->
      <div class="cart-discount">
        <div class="cart-discount-icon">🏷️</div>
        <div class="cart-discount-text">
          Want to gift another adventure? <strong>Get 20% off</strong> when you add a second book.
        </div>
        <button class="cart-discount-btn" id="cartAddAnother">Add another</button>
      </div>
    `;

    body.innerHTML = html;
    updateTotals();
    attachBodyEvents();
  }

  function attachBodyEvents() {
    qs('#cartQtyMinus').addEventListener('click', () => {
      if (cartState.qty > 1) {
        cartState.qty--;
        renderCartBody();
      }
    });
    qs('#cartQtyPlus').addEventListener('click', () => {
      cartState.qty++;
      renderCartBody();
    });
    qs('#cartRemoveItem').addEventListener('click', () => {
      cartState.book = null;
      renderCartBody();
      updateHeaderCount();
    });
    qs('#cartEditBtn').addEventListener('click', () => {
      closeCart();
      // Assume configurator overlay is on the page. We trigger it open.
      const cfg = qs('#cfgOverlay');
      if (cfg) { cfg.classList.add('cfg-open'); document.body.style.overflow = 'hidden'; }
    });

    // Upsell toggles
    const toggles = qs('#lymeCart').querySelectorAll('.cart-upsell-add');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.upsell;
        cartState.upsells[type] = !cartState.upsells[type];
        renderCartBody();
      });
    });

    qs('#cartAddAnother').addEventListener('click', () => {
      closeCart();
      // Normally this would reload configurator with empty state
      window.scrollTo(0, 0);
    });
  }

  function updateTotals() {
    if (!cartState.book) return;
    
    const isHardcover = cartState.book.hardcover;
    const basePrice = isHardcover ? PRICES.BASE + PRICES.HC_ADD : PRICES.BASE;
    let subtotal = basePrice * cartState.qty;

    if (cartState.upsells.poster) subtotal += PRICES.POSTER;
    if (cartState.upsells.giftWrap) subtotal += PRICES.GIFT_WRAP;

    let shipping = subtotal >= PRICES.SHIPPING_THRESHOLD ? 0 : PRICES.SHIPPING_FEE;
    let total = subtotal + shipping;

    qs('#cartSubtotal').textContent = `€${subtotal.toFixed(2)}`;
    
    const shipSpan = qs('#cartShippingFee');
    if (shipping === 0) {
      shipSpan.innerHTML = `<span style="color:#22c55e;">Free</span>`;
    } else {
      shipSpan.textContent = `€${shipping.toFixed(2)}`;
    }

    qs('#cartTotal').textContent = `€${total.toFixed(2)}`;
  }

  function updateHeaderCount() {
    const badge = qs('.cart-count');
    if (badge) {
      badge.textContent = cartState.book ? cartState.qty : '0';
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => { badge.style.transform = 'scale(1)'; }, 300);
    }
  }

  function openCart() {
    injectCart();
    renderCartBody();
    updateHeaderCount();
    const overlay = qs('#lymeCart');
    overlay.classList.add('cart-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    const overlay = qs('#lymeCart');
    if (overlay) overlay.classList.remove('cart-open');
    document.body.style.overflow = '';
  }

  function saveStateToStorage() {
    // So checkout.html can read it
    localStorage.setItem('lymetales_cart', JSON.stringify(cartState));
  }

  /* ── LISTEN FOR ADD TO CART ── */
  document.addEventListener('lymetales:cart:add', (e) => {
    cartState.book = e.detail;
    cartState.qty = 1;
    openCart();
  });

  /* ── AUTO-INIT HEADERS (if exist) ── */
  document.addEventListener('DOMContentLoaded', () => {
    injectCart();
    
    // Wire existing header cart icons to open the drawer
    const headerCarts = document.querySelectorAll('.header-actions a[href="#"], .header-actions a[href=""]');
    headerCarts.forEach(a => {
      if (a.querySelector('svg') || a.textContent.includes('0')) {
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          openCart();
        });
      }
    });
  });

})();
