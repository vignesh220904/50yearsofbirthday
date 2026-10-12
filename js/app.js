/**
 * Master Application Entrypoint
 * Coordinates all chapters, data loading, animations, and interactions
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✦ Initializing Buvana 50th Birthday Celebration Website ✦');

  try {
    // 1. Initialize data store
    await ContentStore.init();

    // 2. Initialize visual & audio effects
    EffectsManager.init();

    // 3. Initialize navigation and routing
    NavigationManager.init();

    // 4. Initialize Life Journey & Timeline
    TimelineManager.init();

    // 5. Initialize Photo Gallery
    GalleryManager.init();

    // 6. Initialize Video Wishes
    VideoWishesManager.init();

    // 7. Initialize Age 1 to 50 Transition
    AgeTransitionManager.init();

    // 8. Initialize 50 Gifts Reveal & 50 Reasons
    GiftRevealManager.init();
    ReasonsManager.init();

    // 9. Setup Scroll Reveal Animations
    setupScrollReveals();

    console.log('✓ All 7 Chapters & Systems Loaded Successfully!');
  } catch (error) {
    console.error('Fatal initialization error:', error);
  }
});

function setupScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
