/**
 * Age 1 to 50 Transition Module
 * Interactive chronological photo journey from childhood to golden jubilee
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const AgeTransitionManager = (() => {
  let agePhotos = [];
  let currentIndex = 0;
  let isPlaying = false;
  let timerId = null;
  const slideDuration = 3600; // ms per slide

  function init() {
    loadAgeSequence();
    setupControls();
  }

  function loadAgeSequence() {
    const rawPhotos = ContentStore.getAgePhotos();
    if (!rawPhotos || rawPhotos.length === 0) return;

    // Filter and sort photos to create a curated progressive life timeline
    agePhotos = rawPhotos.map((photo, i) => {
      let approximateAge = 1 + Math.floor((i / Math.max(1, rawPhotos.length - 1)) * 49);
      if (photo.year && photo.year >= 1976 && photo.year <= 2026) {
        approximateAge = photo.year - 1976;
      }
      if (approximateAge < 1) approximateAge = 1;
      if (approximateAge > 50) approximateAge = 50;

      let stageLabel = 'Childhood';
      if (approximateAge >= 5 && approximateAge < 17) stageLabel = 'School Years';
      else if (approximateAge >= 17 && approximateAge < 21) stageLabel = 'College Years';
      else if (approximateAge === 21) stageLabel = 'Marriage';
      else if (approximateAge >= 22 && approximateAge < 30) stageLabel = 'Young Motherhood';
      else if (approximateAge >= 30 && approximateAge < 45) stageLabel = 'Family Growth & Career';
      else if (approximateAge >= 45 && approximateAge < 50) stageLabel = 'Children\'s Milestones';
      else if (approximateAge === 50) stageLabel = '50th Golden Birthday';

      return {
        ...photo,
        calculatedAge: approximateAge,
        stageLabel: stageLabel
      };
    });

    // Update scrubber bounds
    const scrubber = document.getElementById('age-scrubber');
    if (scrubber) {
      scrubber.min = 0;
      scrubber.max = agePhotos.length - 1;
      scrubber.value = 0;
    }

    renderCurrentPhoto();
  }

  function setupControls() {
    const playBtn = document.getElementById('age-play-btn');
    const prevBtn = document.getElementById('age-prev-btn');
    const nextBtn = document.getElementById('age-next-btn');
    const replayBtn = document.getElementById('age-replay-btn');
    const skipBtn = document.getElementById('age-skip-btn');
    const scrubber = document.getElementById('age-scrubber');

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);
    if (replayBtn) replayBtn.addEventListener('click', replay);
    if (skipBtn) skipBtn.addEventListener('click', skipToFinale);

    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        pause();
        currentIndex = parseInt(e.target.value, 10);
        renderCurrentPhoto();
      });
    }
  }

  function renderCurrentPhoto() {
    if (!agePhotos || agePhotos.length === 0) return;
    const item = agePhotos[currentIndex];
    if (!item) return;

    const imgEl = document.getElementById('age-main-img');
    const ageNumEl = document.getElementById('age-number-text');
    const stageEl = document.getElementById('age-stage-title');
    const captionTitleEl = document.getElementById('age-caption-title');
    const captionDescEl = document.getElementById('age-caption-desc');
    const scrubber = document.getElementById('age-scrubber');

    if (imgEl) {
      imgEl.style.opacity = '0.3';
      setTimeout(() => {
        imgEl.src = item.optimizedPath;
        imgEl.style.opacity = '1';
      }, 150);
    }

    if (ageNumEl) ageNumEl.textContent = `Age ${item.calculatedAge}`;
    if (stageEl) stageEl.textContent = `${item.stageLabel} • ${item.dateString || item.year || 'Memories'}`;
    if (captionTitleEl) captionTitleEl.textContent = item.caption || `Moments at Age ${item.calculatedAge}`;
    if (captionDescEl) captionDescEl.textContent = `Five decades of love and strength — Step ${currentIndex + 1} of ${agePhotos.length}`;

    if (scrubber) scrubber.value = currentIndex;
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function play() {
    isPlaying = true;
    const playBtn = document.getElementById('age-play-btn');
    if (playBtn) playBtn.innerHTML = '⏸ Pause';

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      if (currentIndex < agePhotos.length - 1) {
        currentIndex++;
        renderCurrentPhoto();
      } else {
        pause();
      }
    }, slideDuration);
  }

  function pause() {
    isPlaying = false;
    const playBtn = document.getElementById('age-play-btn');
    if (playBtn) playBtn.innerHTML = '▶ Play Journey';
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function prevPhoto() {
    pause();
    if (currentIndex > 0) {
      currentIndex--;
      renderCurrentPhoto();
    }
  }

  function nextPhoto() {
    pause();
    if (currentIndex < agePhotos.length - 1) {
      currentIndex++;
      renderCurrentPhoto();
    }
  }

  function replay() {
    currentIndex = 0;
    renderCurrentPhoto();
    play();
  }

  function skipToFinale() {
    pause();
    NavigationManager.navigateToChapter('finale');
  }

  return {
    init,
    togglePlay,
    prevPhoto,
    nextPhoto
  };
})();

window.AgeTransitionManager = AgeTransitionManager;
