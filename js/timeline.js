/**
 * Timeline Module
 * Renders Chapter 02 (Life Journey) & Milestone Timeline Cards
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const TimelineManager = (() => {
  const chaptersList = [
    { id: 'all', title: 'All Chapters (1–12)' },
    { id: '1', title: '1. Childhood (1976)' },
    { id: '2', title: '2. Schooling (1979–1993)' },
    { id: '3', title: '3. College & Education' },
    { id: '4', title: '4. Sacred Marriage (1997)' },
    { id: '5', title: '5. Early Family Life' },
    { id: '6', title: '6. Motherhood (1998 & 2002)' },
    { id: '7', title: '7. First Home (3rd Main Rd)' },
    { id: '8', title: '8. Career & MBA (2006 & 2012)' },
    { id: '9', title: '9. Children\'s Milestones' },
    { id: '10', title: '10. Family Achievements' },
    { id: '11', title: '11. Recent Celebrations' },
    { id: '12', title: '12. Turning 50 Golden Jubilee' }
  ];

  let activeChapterFilter = 'all';

  function init() {
    renderChapterNav();
    renderTimelineCards();
  }

  function renderChapterNav() {
    const navContainer = document.getElementById('journey-chapters-nav');
    if (!navContainer) return;

    navContainer.innerHTML = chaptersList.map(ch => `
      <button class="journey-chip ${ch.id === activeChapterFilter ? 'active' : ''}" data-chapter="${ch.id}">
        ${ch.title}
      </button>
    `).join('');

    navContainer.querySelectorAll('.journey-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeChapterFilter = btn.dataset.chapter;
        renderChapterNav();
        renderTimelineCards();
      });
    });
  }

  function renderTimelineCards() {
    const gridContainer = document.getElementById('journey-timeline-grid');
    if (!gridContainer) return;

    const milestones = ContentStore.getTimeline();
    if (!milestones || milestones.length === 0) {
      gridContainer.innerHTML = `<p class="text-muted">Loading journey milestones...</p>`;
      return;
    }

    const filtered = activeChapterFilter === 'all'
      ? milestones
      : milestones.filter(m => String(m.chapter) === activeChapterFilter);

    gridContainer.innerHTML = filtered.map(item => {
      const mainImg = (item.images && item.images.length > 0) ? item.images[0] : 'assets/photos/lj_1970s.webp';
      const isClarify = !item.confirmed;
      const statusText = isClarify ? 'Marked for confirmation' : 'Verified milestone';
      const statusClass = isClarify ? 'status-clarify' : '';

      return `
        <article class="journey-card reveal-on-scroll">
          <div class="journey-card-media" onclick="GalleryManager.openLightboxCustom('${mainImg}', '${item.title}', '${item.year} — ${item.description.replace(/'/g, "\\'")}')">
            <img src="${mainImg}" alt="${item.title}" class="journey-card-img" loading="lazy">
            <span class="journey-card-badge">${item.year}</span>
          </div>
          <div class="journey-card-body">
            <span class="journey-card-year">${item.category || 'Life Journey'}</span>
            <h3 class="journey-card-title">${item.title}</h3>
            <p class="journey-card-desc">${item.description}</p>
            ${item.notes ? `<p class="journey-card-desc" style="font-size:0.8rem;color:#E6D3A2;margin-top:4px;">✦ Note: ${item.notes}</p>` : ''}
            <div class="journey-card-footer">
              <span class="journey-card-status ${statusClass}">
                <span>●</span> ${statusText}
              </span>
              <button class="btn-icon" style="width:32px;height:32px;font-size:0.85rem;" title="View Image" onclick="GalleryManager.openLightboxCustom('${mainImg}', '${item.title}', '${item.year} — ${item.description.replace(/'/g, "\\'")}')">
                🔍
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Trigger scroll reveals
    setTimeout(() => {
      document.querySelectorAll('.journey-card.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
    }, 100);
  }

  return {
    init,
    renderTimelineCards
  };
})();

window.TimelineManager = TimelineManager;
