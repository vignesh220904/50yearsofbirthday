/**
 * Family Video Wishes Module
 * HTML5 video player management, single playback enforcement, and fallback handling
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const VideoWishesManager = (() => {
  let activeVideo = null;

  function init() {
    renderVideoWishes();
  }

  function renderVideoWishes() {
    const grid = document.getElementById('wishes-grid');
    if (!grid) return;

    const wishes = ContentStore.getWishes();
    if (!wishes || wishes.length === 0) {
      grid.innerHTML = `<p class="text-muted">Loading family video messages...</p>`;
      return;
    }

    grid.innerHTML = wishes.map((item, index) => {
      return `
        <article class="wish-video-card" id="card-${item.id}">
          <div class="wish-video-player-wrap">
            <video class="wish-video-player" id="video-${item.id}" controls preload="none">
              <source src="${item.videoSrc}" type="video/mp4">
              Your browser does not support HTML5 video.
            </video>
            <div class="wish-poster-wrap" id="poster-${item.id}" style="background-image: url('${item.thumbnail}');" onclick="VideoWishesManager.playVideo('${item.id}')">
              <div class="wish-play-btn-circle">▶</div>
              <span class="wish-duration-badge">${item.duration}</span>
            </div>
          </div>
          <div class="wish-card-info">
            <div class="wish-card-meta">
              <h3 class="wish-speaker-name">${item.speakerName}</h3>
              <span class="wish-relationship-tag">${item.relationship}</span>
            </div>
            <p class="wish-quote-text">“${item.quote}”</p>
            <div style="margin-top:auto; padding-top: 12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; color:#8BCBFA;">✦ ${item.caption}</span>
              ${item.status === 'pending_upload' ? `<span style="font-size:0.7rem; color:#E6D3A2; background:rgba(230,211,162,0.12); padding:2px 8px; border-radius:10px;">Ready for Video</span>` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach listeners to pause others when one plays
    document.querySelectorAll('.wish-video-player').forEach(vid => {
      vid.addEventListener('play', () => {
        if (activeVideo && activeVideo !== vid) {
          activeVideo.pause();
        }
        activeVideo = vid;
      });

      vid.addEventListener('error', (e) => {
        // Missing video fallback
        const cardId = vid.id.replace('video-', '');
        const poster = document.getElementById(`poster-${cardId}`);
        if (poster) {
          poster.classList.remove('hidden');
          poster.innerHTML = `
            <div style="background:rgba(7,22,46,0.92); border:1px solid #E6D3A2; padding:16px; border-radius:12px; text-align:center; max-width:85%;">
              <div style="font-size:1.8rem; margin-bottom:6px;">📹</div>
              <h4 style="font-size:1rem; color:#E6D3A2; margin-bottom:4px;">Video Message Slot Ready</h4>
              <p style="font-size:0.75rem; color:#C8D6E8; margin:0;">Family member can add their video to assets/videos/</p>
            </div>
          `;
        }
      });
    });
  }

  function playVideo(id) {
    const video = document.getElementById(`video-${id}`);
    const poster = document.getElementById(`poster-${id}`);

    if (video) {
      if (activeVideo && activeVideo !== video) {
        activeVideo.pause();
      }
      activeVideo = video;

      if (poster) poster.classList.add('hidden');

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log(`[Video] Video file not yet uploaded or play blocked: ${error.message}`);
          if (poster) {
            poster.classList.remove('hidden');
            poster.innerHTML = `
              <div style="background:rgba(7,22,46,0.92); border:1px solid #E6D3A2; padding:16px; border-radius:12px; text-align:center; max-width:85%;">
                <div style="font-size:1.8rem; margin-bottom:6px;">📹</div>
                <h4 style="font-size:1rem; color:#E6D3A2; margin-bottom:4px;">Video Wish Slot Ready</h4>
                <p style="font-size:0.75rem; color:#C8D6E8; margin:0;">Family can upload their MP4 video anytime to data/wishes.json</p>
              </div>
            `;
          }
        });
      }
    }
  }

  return {
    init,
    playVideo
  };
})();

window.VideoWishesManager = VideoWishesManager;
