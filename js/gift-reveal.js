/**
 * Gift Reveal & 50 Reasons Interactive Module
 * Operator-controlled 50 gifts reveal and 50 reasons presenter
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const GiftRevealManager = (() => {
  let gifts = [];
  let currentGiftIndex = 0;
  let isBoxOpen = false;

  function init() {
    gifts = ContentStore.getGifts();
    setupGiftControls();
    renderGift();
  }

  function setupGiftControls() {
    const nextBtn = document.getElementById('gift-next-btn');
    const prevBtn = document.getElementById('gift-prev-btn');
    const replayBtn = document.getElementById('gift-replay-btn');
    const skipBtn = document.getElementById('gift-skip-btn');
    const resetBtn = document.getElementById('gift-reset-btn');
    const boxWrap = document.getElementById('gift-box-wrap');

    if (nextBtn) nextBtn.addEventListener('click', revealNextGift);
    if (prevBtn) prevBtn.addEventListener('click', prevGift);
    if (replayBtn) replayBtn.addEventListener('click', replayAnimation);
    if (skipBtn) skipBtn.addEventListener('click', skipAnimation);
    if (resetBtn) resetBtn.addEventListener('click', resetGifts);
    if (boxWrap) boxWrap.addEventListener('click', revealNextGift);
  }

  function renderGift(animate = true) {
    if (!gifts || gifts.length === 0) return;
    const item = gifts[currentGiftIndex];
    if (!item) return;

    const boxWrap = document.getElementById('gift-box-wrap');
    const counterEl = document.getElementById('gift-counter-tag');
    const titleEl = document.getElementById('gift-title-text');
    const giverEl = document.getElementById('gift-giver-text');
    const messageEl = document.getElementById('gift-message-text');

    if (counterEl) counterEl.textContent = `GIFT ${item.giftNumber} OF 50`;
    if (titleEl) titleEl.textContent = item.title;
    if (giverEl) giverEl.textContent = `From: ${item.giver} • ${item.category}`;
    if (messageEl) messageEl.textContent = `“${item.message}”`;

    if (boxWrap) {
      if (animate) {
        boxWrap.classList.remove('box-opened');
        void boxWrap.offsetWidth; // Trigger reflow
        setTimeout(() => {
          boxWrap.classList.add('box-opened');
        }, 100);
      } else {
        boxWrap.classList.add('box-opened');
      }
    }

    // Check if this is the final 50th gift
    if (currentGiftIndex === gifts.length - 1) {
      EffectsManager.triggerCelebrationConfetti();
      const grandFinale = document.getElementById('grand-celebration-section');
      if (grandFinale) {
        grandFinale.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  function revealNextGift() {
    if (currentGiftIndex < gifts.length - 1) {
      currentGiftIndex++;
      renderGift(true);
    } else {
      EffectsManager.triggerCelebrationConfetti();
    }
  }

  function prevGift() {
    if (currentGiftIndex > 0) {
      currentGiftIndex--;
      renderGift(false);
    }
  }

  function replayAnimation() {
    renderGift(true);
  }

  function skipAnimation() {
    renderGift(false);
  }

  function resetGifts() {
    currentGiftIndex = 0;
    renderGift(true);
  }

  return {
    init,
    revealNextGift,
    prevGift,
    resetGifts
  };
})();

// ----------------------------------------------------------------------------
// 50 REASONS PRESENTER MODULE
// ----------------------------------------------------------------------------
const ReasonsManager = (() => {
  let reasons = [];
  let currentReasonIndex = 0;
  let isGridMode = false;

  function init() {
    reasons = ContentStore.getReasons();
    setupReasonsControls();
    renderReason();
  }

  function setupReasonsControls() {
    const nextBtn = document.getElementById('reason-next-btn');
    const prevBtn = document.getElementById('reason-prev-btn');
    const revealAllBtn = document.getElementById('reason-reveal-all-btn');
    const resetBtn = document.getElementById('reason-reset-btn');

    if (nextBtn) nextBtn.addEventListener('click', nextReason);
    if (prevBtn) prevBtn.addEventListener('click', prevReason);
    if (revealAllBtn) revealAllBtn.addEventListener('click', toggleRevealAll);
    if (resetBtn) resetBtn.addEventListener('click', resetReasons);
  }

  function renderReason() {
    if (!reasons || reasons.length === 0) return;
    const item = reasons[currentReasonIndex];
    if (!item) return;

    const counterEl = document.getElementById('reasons-counter-badge');
    const watermarkEl = document.getElementById('reason-number-watermark');
    const categoryEl = document.getElementById('reason-category-tag');
    const titleEl = document.getElementById('reason-card-title');
    const textEl = document.getElementById('reason-card-text');
    const contributorEl = document.getElementById('reason-contributor-tag');

    const formattedNum = String(item.id).padStart(2, '0');

    if (counterEl) counterEl.textContent = `REASON ${formattedNum} OF 50`;
    if (watermarkEl) watermarkEl.textContent = formattedNum;
    if (categoryEl) categoryEl.textContent = item.category;
    if (titleEl) titleEl.textContent = item.title;
    if (textEl) textEl.textContent = `“${item.reason}”`;
    if (contributorEl) contributorEl.textContent = `✦ Contributed by: ${item.contributor}`;
  }

  function nextReason() {
    if (currentReasonIndex < reasons.length - 1) {
      currentReasonIndex++;
      renderReason();
    }
  }

  function prevReason() {
    if (currentReasonIndex > 0) {
      currentReasonIndex--;
      renderReason();
    }
  }

  function toggleRevealAll() {
    const singleStage = document.getElementById('reason-card-single-stage');
    const gridStage = document.getElementById('reasons-full-grid');
    const btn = document.getElementById('reason-reveal-all-btn');

    isGridMode = !isGridMode;

    if (isGridMode) {
      if (singleStage) singleStage.style.display = 'none';
      if (gridStage) {
        gridStage.style.display = 'grid';
        gridStage.innerHTML = reasons.map(r => `
          <div class="reason-grid-card">
            <span style="font-size:0.75rem; color:#8BCBFA; font-weight:700;">REASON ${String(r.id).padStart(2, '0')}</span>
            <h4 style="font-size:1.15rem; color:#E6D3A2; margin:6px 0;">${r.title}</h4>
            <p style="font-size:0.925rem; color:#F7FAFF; font-style:italic;">“${r.reason}”</p>
            <span style="font-size:0.75rem; color:#C8D6E8;">— ${r.contributor}</span>
          </div>
        `).join('');
      }
      if (btn) btn.textContent = 'Single Card View';
    } else {
      if (singleStage) singleStage.style.display = 'block';
      if (gridStage) gridStage.style.display = 'none';
      if (btn) btn.textContent = 'Reveal All 50';
      renderReason();
    }
  }

  function resetReasons() {
    currentReasonIndex = 0;
    isGridMode = false;
    const singleStage = document.getElementById('reason-card-single-stage');
    const gridStage = document.getElementById('reasons-full-grid');
    const btn = document.getElementById('reason-reveal-all-btn');

    if (singleStage) singleStage.style.display = 'block';
    if (gridStage) gridStage.style.display = 'none';
    if (btn) btn.textContent = 'Reveal All 50';

    renderReason();
  }

  return {
    init,
    nextReason,
    prevReason,
    resetReasons
  };
})();

window.GiftRevealManager = GiftRevealManager;
window.ReasonsManager = ReasonsManager;
