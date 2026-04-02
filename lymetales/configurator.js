/* ============================================================
   LYMETALES — Configurator.js
   Premium 3-Step Book Personalisation Engine
   ============================================================ */

(function () {
  'use strict';

  /* ── STATE ── */
  const state = {
    step: 1,
    name: '',
    gender: 'girl',
    hairStyle: 'long',
    hairColor: '#F5D76E',
    eyeColor: '#4A90D9',
    skinTone: '#FFDFC4',
    accessories: [],
    dedication: '',
    hardcover: false,
    currentPage: 0,
  };

  /* ── PRICES ── */
  const PRICE_BASE     = 29.99;
  const PRICE_HC_ADD   = 10.00;

  /* ── AVATAR CONFIG ── */
  const genderEmojis = { girl: '👧', boy: '👦', neutral: '🧒' };
  const hairStyles = [
    { id: 'long',   emoji: '💁‍♀️', label: 'Long' },
    { id: 'short',  emoji: '💇',   label: 'Short' },
    { id: 'curly',  emoji: '🦱',   label: 'Curly' },
    { id: 'braids', emoji: '🧕',   label: 'Braids' },
    { id: 'ponytail', emoji: '👱‍♀️', label: 'Ponytail' },
    { id: 'afro',   emoji: '✊',   label: 'Afro' },
    { id: 'bun',    emoji: '🙆',   label: 'Bun' },
    { id: 'wavy',   emoji: '🌊',   label: 'Wavy' },
  ];
  const hairColors = [
    { hex: '#F5D76E', label: 'Blonde' },
    { hex: '#B5651D', label: 'Auburn' },
    { hex: '#7B4F2E', label: 'Brown' },
    { hex: '#2C1810', label: 'Black' },
    { hex: '#C0392B', label: 'Red' },
    { hex: '#E8E8E0', label: 'Silver' },
  ];
  const eyeColors = [
    { hex: '#4A90D9', label: 'Blue' },
    { hex: '#5D8A5E', label: 'Green' },
    { hex: '#8B6914', label: 'Hazel' },
    { hex: '#4B2E1E', label: 'Brown' },
    { hex: '#6B7B8D', label: 'Grey' },
  ];
  const skinTones = [
    { hex: '#FFDFC4', label: 'Light' },
    { hex: '#E8B996', label: 'Medium' },
    { hex: '#C68642', label: 'Tan' },
    { hex: '#8D5524', label: 'Dark' },
    { hex: '#4A2912', label: 'Deep' },
  ];
  const accessories = [
    { id: 'glasses', emoji: '👓', label: 'Glasses' },
    { id: 'hat',     emoji: '🎩', label: 'Hat' },
    { id: 'bow',     emoji: '🎀', label: 'Hair Bow' },
    { id: 'freckles',emoji: '✨', label: 'Freckles' },
  ];
  const dedicationTemplates = [
    {
      id: 'birthday',
      label: '🎂 Birthday',
      text: 'Happy Birthday, [NAME]! On your special day, we want you to know how much you are loved. This adventure is just for you — because YOU are the hero of our story. With all our love! 🎉',
    },
    {
      id: 'love',
      label: '❤️ Love',
      text: 'To our wonderful [NAME], You fill our lives with so much joy and laughter every single day. We love you more than words can say — to the moon and back, and beyond! 💛',
    },
    {
      id: 'milestone',
      label: '⭐ Milestone',
      text: 'Dear [NAME], today marks a very special milestone in your journey. We are so proud of you and everything you are becoming. Keep shining bright! With endless love. 🌟',
    },
  ];
  const surpriseTemplates = [
    'To the most magical little soul — [NAME] — may every day be filled with wonder, laughter, and the kind of magic only you can bring. 🌈✨',
    'Dear [NAME], you are the best chapter in our greatest story. Keep being wonderfully, perfectly, amazingly YOU! 🦋',
    'For our extraordinary [NAME]: never stop dreaming, never stop exploring, and never forget how deeply, completely loved you are. 💫',
  ];
  const bookPages = [
    { src: 'assets/book_1.png',        label: 'Cover' },
    { src: 'assets/page_spread_1.png', label: 'The Adventure Begins' },
    { src: 'assets/page_spread_2.png', label: 'The Magical Forest' },
    { src: 'assets/page_spread_3.png', label: 'Easter Morning Joy' },
  ];

  /* ── DOM HELPERS ── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const ce  = (tag, cls, html = '') => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html) el.innerHTML = html;
    return el;
  };

  /* ── BUILD HTML ── */
  function buildConfigurator() {
    const overlay = ce('div', 'cfg-overlay');
    overlay.id = 'cfgOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Book Personalisation Configurator');

    overlay.innerHTML = `
      <div class="cfg-backdrop" id="cfgBackdrop"></div>
      <div class="cfg-shell">

        <!-- ══ LEFT: LIVE PREVIEW ══ -->
        <div class="cfg-preview" id="cfgPreview">
          <div class="cfg-preview-label">
            <span class="live-dot"></span>
            Live Preview
          </div>

          <!-- Book Stage (Step 1 default + step 3) -->
          <div class="cfg-book-stage" id="cfgBookStage">
            <div class="cfg-book-wrap" id="cfgBookWrap">
              <img src="assets/book_1.png" alt="Book cover" class="cfg-book-cover-img" id="cfgBookCoverImg">
              <div class="cfg-book-overlay">
                <div class="cfg-character-avatar" id="cfgCharAvatar">👧</div>
                <div class="cfg-cover-name name-empty" id="cfgCoverName">child's name</div>
              </div>
              <div class="cfg-hc-badge" id="cfgHcBadge">Hardcover</div>
              <div class="cfg-book-shimmer" id="cfgShimmer"></div>
            </div>
          </div>

          <!-- Dedication Page (Step 2) -->
          <div class="cfg-dedication-preview" id="cfgDedicationPreview">
            <div class="cfg-dedication-page">
              <div class="cfg-dedication-to">A message for…</div>
              <div class="cfg-dedication-text empty" id="cfgDedicationText">Your personal message will appear here…</div>
              <div class="cfg-dedication-heart">🌿</div>
            </div>
          </div>

          <!-- Flipbook (Step 3) -->
          <div class="cfg-flipbook" id="cfgFlipbook">
            <div class="cfg-flip-pages" id="cfgFlipPages">
              ${bookPages.map((p, i) => `
                <div class="cfg-flip-page ${i === 0 ? 'page-active' : 'page-hidden'}" data-page="${i}" style="z-index:${bookPages.length - i}">
                  <img src="${p.src}" alt="${p.label}" loading="${i === 0 ? 'eager' : 'lazy'}">
                </div>
              `).join('')}
            </div>
            <div class="cfg-flip-controls">
              <button class="cfg-flip-btn" id="cfgFlipPrev" aria-label="Previous page" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span class="cfg-page-indicator" id="cfgPageIndicator">1 / ${bookPages.length}</span>
              <button class="cfg-flip-btn" id="cfgFlipNext" aria-label="Next page">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Confetti container -->
          <div class="cfg-confetti-container" id="cfgConfetti"></div>

          <!-- "Made just for" label -->
          <div class="cfg-made-for" id="cfgMadeFor">
            Made just for <strong id="cfgMadeForName">your child</strong> ✨
          </div>
        </div>

        <!-- ══ RIGHT: CONTROLS ══ -->
        <div class="cfg-controls">

          <!-- Progress -->
          <div class="cfg-progress-bar">
            <div class="cfg-progress-steps" id="cfgProgressSteps">
              <div class="cfg-step-pip step-active" data-step="1">
                <div class="cfg-pip-bubble" id="pip1">1</div>
                <div class="cfg-pip-label">Character</div>
              </div>
              <div class="cfg-pip-line" id="pipLine1"></div>
              <div class="cfg-step-pip" data-step="2">
                <div class="cfg-pip-bubble" id="pip2">2</div>
                <div class="cfg-pip-label">Message</div>
              </div>
              <div class="cfg-pip-line" id="pipLine2"></div>
              <div class="cfg-step-pip" data-step="3">
                <div class="cfg-pip-bubble" id="pip3">3</div>
                <div class="cfg-pip-label">Preview</div>
              </div>
            </div>
          </div>

          <!-- Step panels -->
          <div class="cfg-steps">

            <!-- ─── STEP 1: CHARACTER ─── -->
            <div class="cfg-step-panel panel-active" id="cfgPanel1">
              <h2 class="cfg-step-title">Create Your Character</h2>
              <p class="cfg-step-sub">Your child becomes the hero of this story.</p>

              <!-- Name -->
              <div class="cfg-group">
                <div class="cfg-group-label">
                  <span class="required-dot"></span>
                  Child's Name
                </div>
                <div class="cfg-name-wrap">
                  <input
                    type="text"
                    id="cfgNameInput"
                    class="cfg-name-input"
                    placeholder="Enter name…"
                    maxlength="12"
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                    aria-label="Child's name"
                    aria-required="true"
                  >
                  <button class="cfg-name-clear" id="cfgNameClear" aria-label="Clear name" type="button">×</button>
                </div>
                <div class="cfg-error-msg" id="cfgNameError">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Please enter your child's name
                </div>
              </div>

              <!-- Gender -->
              <div class="cfg-group">
                <div class="cfg-group-label">Character</div>
                <div class="cfg-gender-grid" id="cfgGenderGrid">
                  ${Object.entries(genderEmojis).map(([g, emoji]) => `
                    <button
                      class="cfg-gender-btn ${g === state.gender ? 'active' : ''}"
                      data-gender="${g}"
                      type="button"
                      aria-label="${g.charAt(0).toUpperCase() + g.slice(1)} character"
                      aria-pressed="${g === state.gender}"
                    >
                      <span class="cfg-gender-emoji">${emoji}</span>
                      <span class="cfg-gender-label">${g.charAt(0).toUpperCase() + g.slice(1)}</span>
                      <span class="cfg-gender-check" aria-hidden="true">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Hair Style -->
              <div class="cfg-group">
                <div class="cfg-group-label">Hair Style</div>
                <div class="cfg-hair-grid" id="cfgHairGrid">
                  ${hairStyles.map(h => `
                    <button
                      class="cfg-hair-tile ${h.id === state.hairStyle ? 'active' : ''}"
                      data-hair="${h.id}"
                      type="button"
                      aria-label="${h.label} hair"
                      aria-pressed="${h.id === state.hairStyle}"
                      title="${h.label}"
                    >
                      ${h.emoji}
                      <span class="cfg-hair-tile-check" aria-hidden="true">✓</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Hair Color -->
              <div class="cfg-group">
                <div class="cfg-group-label">Hair Colour</div>
                <div class="cfg-swatch-row" id="cfgHairColorRow">
                  ${hairColors.map(c => `
                    <button
                      class="cfg-color-swatch ${c.hex === state.hairColor ? 'active' : ''}"
                      style="background:${c.hex};"
                      data-hex="${c.hex}"
                      data-type="hairColor"
                      aria-label="${c.label}"
                      aria-pressed="${c.hex === state.hairColor}"
                      type="button"
                    >
                      <span class="swatch-dot" aria-hidden="true">✓</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Eye Color -->
              <div class="cfg-group">
                <div class="cfg-group-label">Eye Colour</div>
                <div class="cfg-swatch-row" id="cfgEyeColorRow">
                  ${eyeColors.map(c => `
                    <button
                      class="cfg-color-swatch ${c.hex === state.eyeColor ? 'active' : ''}"
                      style="background:${c.hex};"
                      data-hex="${c.hex}"
                      data-type="eyeColor"
                      aria-label="${c.label}"
                      aria-pressed="${c.hex === state.eyeColor}"
                      type="button"
                    >
                      <span class="swatch-dot" aria-hidden="true">✓</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Skin Tone -->
              <div class="cfg-group">
                <div class="cfg-group-label">Skin Tone</div>
                <div class="cfg-swatch-row" id="cfgSkinRow">
                  ${skinTones.map(c => `
                    <button
                      class="cfg-color-swatch ${c.hex === state.skinTone ? 'active' : ''}"
                      style="background:${c.hex};"
                      data-hex="${c.hex}"
                      data-type="skinTone"
                      aria-label="${c.label}"
                      aria-pressed="${c.hex === state.skinTone}"
                      type="button"
                    >
                      <span class="swatch-dot" aria-hidden="true">✓</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Accessories -->
              <div class="cfg-group">
                <div class="cfg-group-label">Accessories <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:0.65rem;color:#bbb;">(optional)</span></div>
                <div class="cfg-accessories" id="cfgAccessories">
                  ${accessories.map(a => `
                    <button
                      class="cfg-acc-toggle"
                      data-acc="${a.id}"
                      type="button"
                      aria-pressed="false"
                      aria-label="${a.label} toggle"
                    >
                      ${a.emoji} ${a.label}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- ─── STEP 2: DEDICATION ─── -->
            <div class="cfg-step-panel" id="cfgPanel2">
              <h2 class="cfg-step-title">Add a Personal Message</h2>
              <p class="cfg-step-sub">This will be printed on the dedication page — a moment they'll treasure forever.</p>

              <!-- Quick templates -->
              <div class="cfg-group">
                <div class="cfg-group-label">Quick templates</div>
                <div class="cfg-templates">
                  ${dedicationTemplates.map(t => `
                    <button class="cfg-template-btn" data-template="${t.id}" type="button">${t.label}</button>
                  `).join('')}
                  <button class="cfg-template-btn surprise-btn" id="cfgSurpriseBtn" type="button">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Surprise me
                  </button>
                </div>
              </div>

              <!-- Textarea -->
              <div class="cfg-group">
                <div class="cfg-group-label">Your message <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:0.65rem;color:#bbb;">(optional)</span></div>
                <textarea
                  id="cfgDedicationInput"
                  class="cfg-textarea"
                  placeholder="Write a heartfelt message for your child…"
                  maxlength="400"
                  aria-label="Dedication message"
                  rows="5"
                ></textarea>
                <div class="cfg-char-counter" id="cfgCharCounter">400 characters remaining</div>
              </div>
            </div>

            <!-- ─── STEP 3: PREVIEW + CART ─── -->
            <div class="cfg-step-panel" id="cfgPanel3">
              <h2 class="cfg-step-title">See Your Story Come to Life</h2>
              <p class="cfg-step-sub">Flip through the pages and make any final choices.</p>

              <!-- Order summary -->
              <div class="cfg-order-summary">
                <img src="assets/book_1.png" alt="Book" class="cfg-order-book-thumb" id="cfgOrderThumb">
                <div class="cfg-order-details">
                  <div class="cfg-order-title">My First Easter Egg Hunt</div>
                  <div class="cfg-order-meta">
                    Starring <strong id="cfgOrderName">your child</strong>
                    <span id="cfgOrderGenderTag">Girl</span>
                  </div>
                  <div class="cfg-order-meta" id="cfgOrderDedicationNote" style="margin-top:4px;display:none;">
                    ✉️ Personal message included
                  </div>
                </div>
              </div>

              <!-- Hardcover upsell -->
              <div class="cfg-upsell-card" id="cfgUpsellCard">
                <div class="cfg-upsell-header">
                  <div class="cfg-upsell-info">
                    <h4>🏆 Upgrade to Hardcover</h4>
                    <p>Premium boards, lay-flat binding — made to last a lifetime.</p>
                  </div>
                  <label class="cfg-toggle" aria-label="Upgrade to hardcover">
                    <input type="checkbox" id="cfgHardcoverToggle">
                    <span class="cfg-toggle-track"></span>
                  </label>
                </div>
                <div class="cfg-upsell-price" id="cfgUpsellPrice">+ €${PRICE_HC_ADD.toFixed(2)}</div>
              </div>

              <!-- Price summary -->
              <div class="cfg-price-summary" id="cfgPriceSummary">
                <div class="cfg-price-row">
                  <span>Personalised Book</span>
                  <span>€${PRICE_BASE.toFixed(2)}</span>
                </div>
                <div class="cfg-price-row" id="cfgHardcoverPriceRow" style="display:none;">
                  <span>Hardcover Upgrade</span>
                  <span>€${PRICE_HC_ADD.toFixed(2)}</span>
                </div>
                <div class="cfg-price-row" style="display:none;" id="cfgShippingRow">
                  <span>Shipping</span>
                  <span style="color:#22c55e;">Free</span>
                </div>
                <div class="cfg-price-row total">
                  <span>Total</span>
                  <span class="cfg-price-total-val" id="cfgTotalPrice">€${PRICE_BASE.toFixed(2)}</span>
                </div>
              </div>

              <!-- Emotional message -->
              <div class="cfg-emotional-msg" id="cfgEmotionalMsg">
                ✨ Made just for <strong id="cfgEmotionalName">your child</strong>
              </div>
            </div>

          </div><!-- / cfg-steps -->

          <!-- Footer CTA -->
          <div class="cfg-step-footer" id="cfgStepFooter">
            <!-- Step 1 footer -->
            <div id="cfgFooter1">
              <button class="cfg-btn-primary" id="cfgNextBtn1" disabled aria-label="Continue to dedication step">
                Continue
                <svg class="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <!-- Step 2 footer -->
            <div id="cfgFooter2" style="display:none;">
              <button class="cfg-btn-primary" id="cfgNextBtn2" aria-label="Preview your book">
                Preview My Book
                <svg class="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="cfg-btn-secondary" id="cfgBackBtn2" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                Back to character
              </button>
            </div>
            <!-- Step 3 footer -->
            <div id="cfgFooter3" style="display:none;">
              <button class="cfg-btn-primary cfg-btn-cart" id="cfgAddToCart" aria-label="Add to cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                Add to Cart · <span id="cfgCartPrice">€${PRICE_BASE.toFixed(2)}</span>
              </button>
              <button class="cfg-btn-secondary" id="cfgBackBtn3" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                Edit details
              </button>
            </div>
          </div>

        </div><!-- / cfg-controls -->

        <!-- Close button -->
        <button class="cfg-close" id="cfgClose" aria-label="Close configurator" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

      </div><!-- / cfg-shell -->
    `;

    document.body.appendChild(overlay);
  }

  /* ── OPEN / CLOSE ── */
  function openConfigurator() {
    const overlay = qs('#cfgOverlay');
    overlay.classList.add('cfg-open');
    document.body.style.overflow = 'hidden';
    qs('#cfgNameInput').focus();
  }

  function closeConfigurator() {
    const overlay = qs('#cfgOverlay');
    overlay.classList.remove('cfg-open');
    document.body.style.overflow = '';
  }

  /* ── STEP NAVIGATION ── */
  function goToStep(step) {
    const current = state.step;
    state.step = step;

    // Animate panels
    const panels = qsa('.cfg-step-panel');
    panels.forEach(p => {
      const pid = parseInt(p.id.replace('cfgPanel', ''));
      p.classList.remove('panel-active', 'panel-exit');
      if (pid === step) {
        // Small RAF to ensure paint before class add
        requestAnimationFrame(() => {
          p.style.transform = step > current ? 'translateX(24px)' : 'translateX(-24px)';
          p.style.opacity = '0';
          p.style.position = 'relative';
          p.style.pointerEvents = 'all';
          requestAnimationFrame(() => {
            p.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            p.style.transform = 'translateX(0)';
            p.style.opacity = '1';
          });
        });
      } else {
        p.style.position = 'absolute';
        p.style.pointerEvents = 'none';
        p.style.opacity = '0';
      }
    });

    // Update progress
    updateProgress(step);

    // Update preview
    updatePreviewForStep(step);

    // Update footers
    updateFooters(step);

    // Step-specific actions
    if (step === 3) {
      updateStep3Summary();
      setTimeout(() => fireConfetti(), 400);
    }
  }

  function updateProgress(step) {
    qsa('.cfg-step-pip').forEach(pip => {
      const s = parseInt(pip.dataset.step);
      pip.classList.remove('step-active', 'step-done');
      if (s === step) pip.classList.add('step-active');
      else if (s < step) pip.classList.add('step-done');
    });

    // Pip bubbles — done = checkmark
    [1,2,3].forEach(i => {
      const bubble = qs(`#pip${i}`);
      if (i < step) {
        bubble.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else {
        bubble.textContent = i;
      }
    });

    // Lines
    [1,2].forEach(i => {
      const line = qs(`#pipLine${i}`);
      if (line) {
        line.style.background = step > i ? 'var(--color-green-dark)' : '#DDD';
        line.style.transition = 'background 0.4s ease';
      }
    });
  }

  function updateFooters(step) {
    [1,2,3].forEach(i => {
      const f = qs(`#cfgFooter${i}`);
      if (f) f.style.display = i === step ? 'block' : 'none';
    });
  }

  /* ── PREVIEW SWITCHING ── */
  function updatePreviewForStep(step) {
    const bookStage       = qs('#cfgBookStage');
    const dedicationPrev  = qs('#cfgDedicationPreview');
    const flipbook        = qs('#cfgFlipbook');

    if (step === 1 || step === 3) {
      bookStage.style.display = step === 3 ? 'none' : '';
      dedicationPrev.classList.remove('visible');
      flipbook.classList.toggle('visible', step === 3);
      if (step === 3) {
        state.currentPage = 0;
        updateFlipbook();
      }
    }
    if (step === 2) {
      bookStage.style.display = 'none';
      dedicationPrev.classList.add('visible');
      flipbook.classList.remove('visible');
    }
  }

  /* ── LIVE BOOK PREVIEW UPDATE ── */
  function updateBookPreview() {
    // Name on cover
    const nameEl = qs('#cfgCoverName');
    const name = state.name.trim();
    if (name) {
      nameEl.textContent = name;
      nameEl.classList.remove('name-empty');
    } else {
      nameEl.textContent = "child's name";
      nameEl.classList.add('name-empty');
    }

    // Avatar emoji
    const avatar = qs('#cfgCharAvatar');
    avatar.textContent = genderEmojis[state.gender];
    avatar.classList.remove('avatar-animate');
    requestAnimationFrame(() => avatar.classList.add('avatar-animate'));

    // "Made for" label
    const nameLabel = name || 'your child';
    qs('#cfgMadeForName').textContent = nameLabel;
  }

  /* ── NAME INPUT ── */
  function setupNameInput() {
    const input = qs('#cfgNameInput');
    const clearBtn = qs('#cfgNameClear');
    const nextBtn  = qs('#cfgNextBtn1');
    const errorMsg = qs('#cfgNameError');

    const validate = () => {
      const val = input.value.trim();
      state.name = val;
      const valid = val.length >= 1;
      nextBtn.disabled = !valid;
      input.classList.toggle('has-error', !valid && input.value.length > 0);
      errorMsg.classList.toggle('show', !valid && document.activeElement !== input && input.value.length === 0);
      updateBookPreview();

      // Shimmer feedback
      if (valid) {
        const shimmer = qs('#cfgShimmer');
        shimmer.classList.add('active');
        clearTimeout(input._shimTimer);
        input._shimTimer = setTimeout(() => shimmer.classList.remove('active'), 600);
      }
    };

    input.addEventListener('input', validate);
    input.addEventListener('blur', () => {
      if (!state.name) errorMsg.classList.add('show');
    });
    input.addEventListener('focus', () => errorMsg.classList.remove('show'));

    clearBtn.addEventListener('click', () => {
      input.value = '';
      state.name = '';
      validate();
      input.focus();
    });

    // Prevent numbers
    input.addEventListener('keypress', (e) => {
      if (/[0-9]/.test(e.key)) e.preventDefault();
    });
  }

  /* ── GENDER BUTTONS ── */
  function setupGenderBtns() {
    qsa('.cfg-gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.gender = btn.dataset.gender;
        qsa('.cfg-gender-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        updateBookPreview();
      });
    });
  }

  /* ── HAIR TILES ── */
  function setupHairTiles() {
    qsa('.cfg-hair-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        state.hairStyle = tile.dataset.hair;
        qsa('.cfg-hair-tile').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        tile.classList.add('active');
        tile.setAttribute('aria-pressed', 'true');
      });
    });
  }

  /* ── COLOUR SWATCHES ── */
  function setupSwatches() {
    const groups = {
      hairColor: qsa('[data-type="hairColor"]'),
      eyeColor:  qsa('[data-type="eyeColor"]'),
      skinTone:  qsa('[data-type="skinTone"]'),
    };

    Object.entries(groups).forEach(([type, btns]) => {
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          state[type] = btn.dataset.hex;
          btns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        });
      });
    });
  }

  /* ── ACCESSORIES ── */
  function setupAccessories() {
    qsa('.cfg-acc-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const acc = btn.dataset.acc;
        const idx = state.accessories.indexOf(acc);
        if (idx > -1) {
          state.accessories.splice(idx, 1);
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        } else {
          state.accessories.push(acc);
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        }
      });
    });
  }

  /* ── DEDICATION INPUT ── */
  function setupDedicationInput() {
    const input      = qs('#cfgDedicationInput');
    const counter    = qs('#cfgCharCounter');
    const LIMIT      = 400;

    input.addEventListener('input', () => {
      state.dedication = input.value;
      const remaining = LIMIT - input.value.length;
      counter.textContent = `${remaining} ${remaining === 1 ? 'character' : 'characters'} remaining`;
      counter.classList.toggle('nearly-full', remaining < 50);
      updateDedicationPreview();
    });

    // Templates
    qsa('.cfg-template-btn:not(.surprise-btn)').forEach(btn => {
      btn.addEventListener('click', () => {
        const tmpl = dedicationTemplates.find(t => t.id === btn.dataset.template);
        if (tmpl) {
          const text = tmpl.text.replace(/\[NAME\]/g, state.name || 'your child');
          input.value = text.substring(0, LIMIT);
          state.dedication = input.value;
          const remaining = LIMIT - input.value.length;
          counter.textContent = `${remaining} characters remaining`;
          counter.classList.toggle('nearly-full', remaining < 50);
          updateDedicationPreview();
          input.focus();
        }
      });
    });

    // Surprise
    qs('#cfgSurpriseBtn').addEventListener('click', () => {
      const tmpl = surpriseTemplates[Math.floor(Math.random() * surpriseTemplates.length)];
      const text = tmpl.replace(/\[NAME\]/g, state.name || 'your child');
      input.value = text.substring(0, LIMIT);
      state.dedication = input.value;
      const remaining = LIMIT - input.value.length;
      counter.textContent = `${remaining} characters remaining`;
      counter.classList.toggle('nearly-full', remaining < 50);
      updateDedicationPreview();
      input.focus();

      // Sparkle button feedback
      const btn = qs('#cfgSurpriseBtn');
      btn.textContent = '✨ Ta-da!';
      setTimeout(() => {
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Surprise me`;
      }, 1500);
    });
  }

  /* ── DEDICATION PREVIEW ── */
  function updateDedicationPreview() {
    const textEl = qs('#cfgDedicationText');
    const text = state.dedication.trim();
    if (text) {
      textEl.textContent = text;
      textEl.classList.remove('empty');
    } else {
      textEl.textContent = 'Your personal message will appear here…';
      textEl.classList.add('empty');
    }
  }

  /* ── FLIPBOOK ── */
  function updateFlipbook() {
    const pages = qsa('.cfg-flip-page');
    pages.forEach((page, i) => {
      page.classList.remove('page-active', 'page-hidden', 'page-past', 'page-enter', 'page-exit');
      if (i === state.currentPage) page.classList.add('page-active');
      else if (i < state.currentPage) page.classList.add('page-past');
      else page.classList.add('page-hidden');
    });

    qs('#cfgFlipPrev').disabled = state.currentPage === 0;
    qs('#cfgFlipNext').disabled = state.currentPage === bookPages.length - 1;
    qs('#cfgPageIndicator').textContent = `${state.currentPage + 1} / ${bookPages.length}`;
  }

  function setupFlipbook() {
    qs('#cfgFlipPrev').addEventListener('click', () => {
      if (state.currentPage > 0) {
        animatePageTurn(-1);
      }
    });
    qs('#cfgFlipNext').addEventListener('click', () => {
      if (state.currentPage < bookPages.length - 1) {
        animatePageTurn(1);
      }
    });
  }

  function animatePageTurn(dir) {
    const pages = qsa('.cfg-flip-page');
    const current  = pages[state.currentPage];
    const newIndex = state.currentPage + dir;
    const next     = pages[newIndex];

    current.classList.add('page-exit');
    next.classList.remove('page-hidden', 'page-past');
    next.classList.add('page-enter');

    setTimeout(() => {
      current.classList.remove('page-active', 'page-exit');
      current.classList.add(dir > 0 ? 'page-past' : 'page-hidden');
      next.classList.remove('page-enter');
      next.classList.add('page-active');
      state.currentPage = newIndex;
      qs('#cfgFlipPrev').disabled = state.currentPage === 0;
      qs('#cfgFlipNext').disabled = state.currentPage === bookPages.length - 1;
      qs('#cfgPageIndicator').textContent = `${state.currentPage + 1} / ${bookPages.length}`;
    }, 500);
  }

  /* ── HARDCOVER TOGGLE ── */
  function setupHardcoverToggle() {
    const toggle = qs('#cfgHardcoverToggle');
    toggle.addEventListener('change', () => {
      state.hardcover = toggle.checked;
      const card = qs('#cfgUpsellCard');
      card.classList.toggle('active', state.hardcover);

      // Update HC badge on book
      qs('#cfgHcBadge').classList.toggle('visible', state.hardcover);

      // Show/hide HC price row
      qs('#cfgHardcoverPriceRow').style.display = state.hardcover ? 'flex' : 'none';

      // Show shipping if over threshold
      const total = state.hardcover ? PRICE_BASE + PRICE_HC_ADD : PRICE_BASE;
      qs('#cfgShippingRow').style.display = total >= 40 ? 'flex' : 'none';

      updateTotalPrice();
    });
  }

  function updateTotalPrice() {
    const total = state.hardcover ? PRICE_BASE + PRICE_HC_ADD : PRICE_BASE;
    qs('#cfgTotalPrice').textContent = `€${total.toFixed(2)}`;
    qs('#cfgCartPrice').textContent  = `€${total.toFixed(2)}`;
  }

  /* ── STEP 3 SUMMARY ── */
  function updateStep3Summary() {
    const name = state.name.trim() || 'your child';
    qs('#cfgOrderName').textContent = name;
    qs('#cfgOrderGenderTag').textContent = state.gender.charAt(0).toUpperCase() + state.gender.slice(1);
    qs('#cfgEmotionalName').textContent  = name;

    const dedNote = qs('#cfgOrderDedicationNote');
    dedNote.style.display = state.dedication.trim() ? 'block' : 'none';

    updateTotalPrice();
  }

  /* ── CONFETTI ── */
  function fireConfetti() {
    const colors = ['#0F4C3A','#D9F99D','#F9A825','#E8B996','#C5E8D5','#fff'];
    const container = qs('#cfgConfetti');
    container.innerHTML = '';

    for (let i = 0; i < 40; i++) {
      const piece = ce('div', 'cfg-confetti-piece');
      const size  = Math.random() * 8 + 5;
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${1.5 + Math.random() * 1.5}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      container.appendChild(piece);
    }

    setTimeout(() => { container.innerHTML = ''; }, 3000);
  }

  /* ── ADD TO CART ── */
  function setupAddToCart() {
    qs('#cfgAddToCart').addEventListener('click', () => {
      const btn = qs('#cfgAddToCart');

      // Success state
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Added to Cart!
      `;
      btn.style.background = '#22c55e';
      btn.disabled = true;

      // Update cart count in header immediately for visual feedback
      const cartCount = qs('.cart-count');
      if (cartCount) {
        cartCount.textContent = '1';
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => { cartCount.style.transform = ''; }, 300);
      }

      fireConfetti();

      // Trigger cart opening logic via event
      setTimeout(() => {
        closeConfigurator();
        
        // Reset button for next time
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          Add to Cart · <span id="cfgCartPrice">€${state.hardcover ? (PRICE_BASE+PRICE_HC_ADD).toFixed(2) : PRICE_BASE.toFixed(2)}</span>
        `;
        btn.style.background = '';
        btn.disabled = false;

        // Dispatch state to Cart System
        document.dispatchEvent(new CustomEvent('lymetales:cart:add', { detail: Object.assign({}, state) }));
      }, 1000);
    });
  }

  /* ── NAVIGATION BUTTONS ── */
  function setupNavBtns() {
    qs('#cfgNextBtn1').addEventListener('click', () => {
      if (state.name.trim()) goToStep(2);
      else {
        const inp = qs('#cfgNameInput');
        const err = qs('#cfgNameError');
        inp.classList.add('has-error');
        err.classList.add('show');
        inp.focus();
        // Shake
        inp.style.animation = 'none';
        inp.offsetHeight;
        inp.style.animation = 'shake 0.3s ease';
      }
    });

    qs('#cfgNextBtn2').addEventListener('click', () => goToStep(3));
    qs('#cfgBackBtn2').addEventListener('click', () => goToStep(1));
    qs('#cfgBackBtn3').addEventListener('click', () => goToStep(2));
  }

  /* ── CLOSE HANDLERS ── */
  function setupClose() {
    qs('#cfgClose').addEventListener('click', closeConfigurator);
    qs('#cfgBackdrop').addEventListener('click', closeConfigurator);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeConfigurator();
    });
  }

  /* ── TRIGGER BUTTONS ── */
  function setupTriggers() {
    // Replace existing CTA with premium trigger
    const existingCta = qs('#ctaMain');
    if (existingCta) {
      const trigger = ce('button', 'cfg-trigger-btn');
      trigger.type = 'button';
      trigger.id = 'cfgTrigger';
      trigger.innerHTML = `
        <svg class="sparkle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Personalise This Book
        <svg class="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      `;
      existingCta.replaceWith(trigger);
      trigger.addEventListener('click', openConfigurator);
    }

    // Any other .cfg-open-* elements
    qsa('[data-cfg-open], #cfgTrigger').forEach(btn => {
      btn.addEventListener('click', openConfigurator);
    });

    // Replace inline configurator-card "Create Your Book" links too
    qsa('a[href="#configurator"], a[href="#"]').forEach(a => {
      if (a.textContent.trim().includes('Personalise') || a.textContent.trim().includes('Create')) {
        a.addEventListener('click', (e) => { e.preventDefault(); openConfigurator(); });
      }
    });
  }

  /* ── SHAKE ANIMATION ── */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    .cfg-name-input { animation: none; }
  `;
  document.head.appendChild(shakeStyle);

  /* ── INIT ── */
  function init() {
    buildConfigurator();
    setupClose();
    setupNameInput();
    setupGenderBtns();
    setupHairTiles();
    setupSwatches();
    setupAccessories();
    setupDedicationInput();
    setupFlipbook();
    setupHardcoverToggle();
    setupAddToCart();
    setupNavBtns();
    setupTriggers();

    // Init preview
    updateBookPreview();
    updatePreviewForStep(1);
    updateFooters(1);
    updateProgress(1);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
