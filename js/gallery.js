/**
 * Photo Gallery & Lightbox Module
 * Filterable memory gallery with responsive grid and full-screen lightbox
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const GalleryManager = (() => {
  const categories = [
    { id: 'all', label: 'All Memories' },
    { id: 'Childhood', label: 'Childhood' },
    { id: 'Education', label: 'Education' },
    { id: 'Marriage', label: 'Marriage' },
    { id: 'Family', label: 'Family' },
    { id: 'Travel', label: 'Travel' },
    { id: 'Celebrations', label: 'Celebrations' },
    { id: 'Recent memories', label: 'Recent Memories' },
    { id: 'Candid moments', label: 'Candid Moments' }
  ];

  let currentCategory = 'all';
  let filteredPhotos = [];
  let currentLightboxIndex = 0;
  let displayLimit = 48; // Initial display limit for optimal rendering performance

  function init() {
    renderCategoryFilters();
    renderGallery();
    setupLightbox();
  }

  function renderCategoryFilters() {
    const container = document.getElementById('gallery-filter-bar');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <button class="filter-pill ${cat.id === currentCategory ? 'active' : ''}" data-cat="${cat.id}">
        ${cat.label}
      </button>
    `).join('');

    container.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.cat;
        displayLimit = 48;
        renderCategoryFilters();
        renderGallery();
      });
    });
  }

  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const allInventory = ContentStore.getInventory();
    if (!allInventory || allInventory.length === 0) {
      grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align:center;">Loading memory photographs...</p>`;
      return;
    }

    if (currentCategory === 'all') {
      filteredPhotos = allInventory;
    } else {
      filteredPhotos = allInventory.filter(item => item.category && item.category.toLowerCase() === currentCategory.toLowerCase());
    }

    const visiblePhotos = filteredPhotos.slice(0, displayLimit);

    grid.innerHTML = visiblePhotos.map((photo, index) => {
      const thumb = photo.thumbnailPath || photo.optimizedPath;
      const title = photo.caption || 'Family Memory';
      const year = photo.dateString || photo.year || 'Cherished Moment';

      return `
        <div class="gallery-item" data-index="${index}" onclick="GalleryManager.openLightboxByIndex(${index})">
          <img src="${thumb}" alt="${title}" class="gallery-item-img" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-overlay-year">${year}</span>
            <span class="gallery-overlay-title">${title}</span>
          </div>
        </div>
      `;
    }).join('');

    // Load More Button if more photos exist
    const loadMoreContainer = document.getElementById('gallery-load-more');
    if (loadMoreContainer) {
      if (filteredPhotos.length > displayLimit) {
        loadMoreContainer.innerHTML = `
          <button class="btn btn-secondary" onclick="GalleryManager.loadMorePhotos()">
            Load More Photographs (${filteredPhotos.length - displayLimit} remaining)
          </button>
        `;
        loadMoreContainer.style.display = 'block';
      } else {
        loadMoreContainer.innerHTML = '';
        loadMoreContainer.style.display = 'none';
      }
    }
  }

  function loadMorePhotos() {
    displayLimit += 48;
    renderGallery();
  }

  // --------------------------------------------------------------------------
  // LIGHTBOX CONTROLS
  // --------------------------------------------------------------------------
  function setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    });
  }

  function openLightboxByIndex(index) {
    if (!filteredPhotos || filteredPhotos.length === 0) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openLightboxCustom(imgSrc, title, desc) {
    const modal = document.getElementById('lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const counterEl = document.getElementById('lightbox-counter');

    if (imgEl) imgEl.src = imgSrc;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (counterEl) counterEl.textContent = 'Milestone View';

    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxContent() {
    const photo = filteredPhotos[currentLightboxIndex];
    if (!photo) return;

    const imgEl = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const counterEl = document.getElementById('lightbox-counter');

    if (imgEl) imgEl.src = photo.optimizedPath;
    if (titleEl) titleEl.textContent = photo.caption || 'Cherished Memory';
    if (descEl) descEl.textContent = `${photo.dateString || photo.year || 'Family Photograph'} • From ${photo.sourceFolder}`;
    if (counterEl) counterEl.textContent = `PHOTO ${currentLightboxIndex + 1} OF ${filteredPhotos.length}`;
  }

  function prevPhoto() {
    if (filteredPhotos.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxContent();
  }

  function nextPhoto() {
    if (filteredPhotos.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    updateLightboxContent();
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  return {
    init,
    openLightboxByIndex,
    openLightboxCustom,
    loadMorePhotos
  };
})();

window.GalleryManager = GalleryManager;
