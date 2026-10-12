/**
 * Navigation Module
 * Chapter switching, URL hashing, progress bar, presentation mode, and keyboard shortcuts
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const NavigationManager = (() => {
  const chapters = [
    'welcome',
    'journey',
    'reasons',
    'memories',
    'wishes',
    'age-transition',
    'finale'
  ];

  let currentChapterIndex = 0;
  let isPresentationMode = false;

  function init() {
    setupNavLinks();
    setupMobileMenu();
    setupPresentationMode();
    setupProgressBar();
    setupKeyboardShortcuts();
    handleInitialHash();
    setupScrollSpy();
  }

  function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link, .chapter-jump-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          navigateToChapter(targetId);
          closeMobileMenu();
        }
      });
    });
  }

  function navigateToChapter(chapterId) {
    const targetEl = document.getElementById(`chapter-${chapterId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${chapterId}`);
      updateActiveNav(chapterId);
      const idx = chapters.indexOf(chapterId);
      if (idx !== -1) currentChapterIndex = idx;
    }
  }

  function updateActiveNav(activeId) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && chapters.includes(hash)) {
      setTimeout(() => {
        navigateToChapter(hash);
      }, 200);
    }
  }

  function setupMobileMenu() {
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const menu = document.getElementById('nav-menu');
    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('open');
      const isOpen = menu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  function closeMobileMenu() {
    const menu = document.getElementById('nav-menu');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  }

  function setupPresentationMode() {
    const toggleBtn = document.getElementById('presentation-toggle-btn');
    const exitBtn = document.getElementById('exit-presentation-btn');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', togglePresentationMode);
    }
    if (exitBtn) {
      exitBtn.addEventListener('click', togglePresentationMode);
    }
  }

  function togglePresentationMode() {
    isPresentationMode = !isPresentationMode;
    document.body.classList.toggle('presentation-mode', isPresentationMode);

    if (isPresentationMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  function setupProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    });
  }

  function setupScrollSpy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('chapter-', '');
          updateActiveNav(id);
          const idx = chapters.indexOf(id);
          if (idx !== -1) currentChapterIndex = idx;
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px'
    });

    chapters.forEach(ch => {
      const el = document.getElementById(`chapter-${ch}`);
      if (el) observer.observe(el);
    });
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // If user is inside an input or textarea, ignore
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentChapterIndex < chapters.length - 1) {
          navigateToChapter(chapters[currentChapterIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentChapterIndex > 0) {
          navigateToChapter(chapters[currentChapterIndex - 1]);
        }
      } else if (e.key === 'p' || e.key === 'P') {
        togglePresentationMode();
      } else if (e.key === 'Escape') {
        closeMobileMenu();
        if (isPresentationMode) togglePresentationMode();
      }
    });
  }

  return {
    init,
    navigateToChapter,
    togglePresentationMode
  };
})();

window.NavigationManager = NavigationManager;
