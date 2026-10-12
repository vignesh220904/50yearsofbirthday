/**
 * Visual & Audio Effects Module
 * Particles, butterflies, ambient sound, card tilt, and confetti
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const EffectsManager = (() => {
  let particleCanvas = null;
  let particleCtx = null;
  let particles = [];
  let animFrameId = null;
  let isPageVisible = true;
  let audioContext = null;
  let bgAudioEl = null;
  let isAudioPlaying = false;

  // --------------------------------------------------------------------------
  // PARTICLE FIELD CANVAS
  // --------------------------------------------------------------------------
  function initParticles() {
    particleCanvas = document.getElementById('canvas-particles');
    if (!particleCanvas) return;
    particleCtx = particleCanvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create 45 subtle ambient particles
    const particleCount = window.innerWidth < 768 ? 20 : 45;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    animateParticles();
  }

  function resizeCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticle() {
    const isGold = Math.random() > 0.65;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2, // gently floats upward
      alpha: Math.random() * 0.6 + 0.2,
      fadeDir: Math.random() > 0.5 ? 0.005 : -0.005,
      color: isGold ? '230, 211, 162' : '139, 203, 250' // Champagne or Sky Blue
    };
  }

  function animateParticles() {
    if (!particleCtx || !particleCanvas || !isPageVisible) {
      animFrameId = requestAnimationFrame(animateParticles);
      return;
    }

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += p.fadeDir;

      if (p.alpha > 0.75) { p.alpha = 0.75; p.fadeDir = -0.005; }
      if (p.alpha < 0.15) { p.alpha = 0.15; p.fadeDir = 0.005; }

      // Wrap around edges
      if (p.y < -10) { p.y = particleCanvas.height + 10; p.x = Math.random() * particleCanvas.width; }
      if (p.x < -10) p.x = particleCanvas.width + 10;
      if (p.x > particleCanvas.width + 10) p.x = -10;

      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      particleCtx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      particleCtx.shadowBlur = p.radius * 3;
      particleCtx.shadowColor = `rgba(${p.color}, 0.5)`;
      particleCtx.fill();
    }

    animFrameId = requestAnimationFrame(animateParticles);
  }

  // --------------------------------------------------------------------------
  // ANIMATED BUTTERFLIES
  // --------------------------------------------------------------------------
  function initButterflies() {
    const container = document.getElementById('butterfly-container');
    if (!container) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const count = window.innerWidth < 768 ? 2 : 4;
    for (let i = 0; i < count; i++) {
      createButterfly(container, i);
    }
  }

  function createButterfly(container, index) {
    const el = document.createElement('div');
    el.className = 'animated-butterfly';
    el.innerHTML = `
      <svg width="42" height="34" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="butterfly-wing-left" d="M25 20 C18 6 4 2 2 12 C0 22 14 28 25 20 Z" fill="url(#bfGold)" opacity="0.88"/>
        <path class="butterfly-wing-right" d="M25 20 C32 6 46 2 48 12 C50 22 36 28 25 20 Z" fill="url(#bfBlue)" opacity="0.88"/>
        <ellipse cx="25" cy="20" rx="1.5" ry="8" fill="#F7FAFF"/>
        <defs>
          <linearGradient id="bfGold" x1="0" y1="0" x2="25" y2="20">
            <stop offset="0%" stop-color="#E6D3A2"/>
            <stop offset="100%" stop-color="#174EA6"/>
          </linearGradient>
          <linearGradient id="bfBlue" x1="50" y1="0" x2="25" y2="20">
            <stop offset="0%" stop-color="#8BCBFA"/>
            <stop offset="100%" stop-color="#2457A7"/>
          </linearGradient>
        </defs>
      </svg>
    `;

    container.appendChild(el);

    // Initial position
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let targetX = Math.random() * window.innerWidth;
    let targetY = Math.random() * window.innerHeight;
    let speed = 0.008 + Math.random() * 0.006;

    function move() {
      if (!isPageVisible) {
        requestAnimationFrame(move);
        return;
      }
      x += (targetX - x) * speed;
      y += (targetY - y) * speed;

      const angle = Math.atan2(targetY - y, targetX - x) * (180 / Math.PI) + 90;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;

      if (Math.abs(targetX - x) < 30 && Math.abs(targetY - y) < 30) {
        targetX = Math.random() * (window.innerWidth - 60);
        targetY = Math.random() * (window.innerHeight - 60);
      }

      requestAnimationFrame(move);
    }
    requestAnimationFrame(move);
  }

  // --------------------------------------------------------------------------
  // AMBIENT CELEBRATION AUDIO
  // --------------------------------------------------------------------------
  function initAudio() {
    bgAudioEl = document.getElementById('bg-audio');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    if (!audioToggleBtn) return;

    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  function toggleAudio() {
    const audioController = document.querySelector('.audio-controller');
    const label = document.querySelector('.audio-label');

    if (!isAudioPlaying) {
      startAmbientAudio();
      isAudioPlaying = true;
      if (audioController) audioController.classList.add('audio-playing');
      if (label) label.textContent = 'MUSIC: ON';
    } else {
      pauseAmbientAudio();
      isAudioPlaying = false;
      if (audioController) audioController.classList.remove('audio-playing');
      if (label) label.textContent = 'MUSIC: OFF';
    }
  }

  function startAmbientAudio() {
    if (bgAudioEl && bgAudioEl.src) {
      bgAudioEl.play().catch(e => {
        console.log('[Audio] File play blocked or unavailable, using Web Audio synthesizer');
        playHarmonicTones();
      });
    } else {
      playHarmonicTones();
    }
  }

  function pauseAmbientAudio() {
    if (bgAudioEl) bgAudioEl.pause();
    if (audioContext && audioContext.state === 'running') {
      audioContext.suspend();
    }
  }

  // Gentle synthesized Indian ambient raga tones (Ramar Blue serene mood)
  let synthInterval = null;
  function playHarmonicTones() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      // Pentatonic warm frequencies in C Major / Kalyani scale: C4, E4, G4, A4, C5
      const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
      let noteIndex = 0;

      function playNote() {
        if (!isAudioPlaying || !audioContext) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2));

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);

        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.8);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 4.0);
      }

      playNote();
      if (synthInterval) clearInterval(synthInterval);
      synthInterval = setInterval(playNote, 2800);
    } catch (err) {
      console.warn('[EffectsManager] Web Audio error:', err);
    }
  }

  // --------------------------------------------------------------------------
  // CONFETTI CELEBRATION CANNON (For Grand Finale)
  // --------------------------------------------------------------------------
  function triggerCelebrationConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-confetti';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999;';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const confetti = [];
    const colors = ['#E6D3A2', '#8BCBFA', '#2457A7', '#F7FAFF', '#F3E5BE'];

    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 300,
        y: window.innerHeight * 0.6,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 8,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.38,
        opacity: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let p of confetti) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
          ctx.restore();
        }
      }

      frame++;
      if (alive && frame < 280) {
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(render);
  }

  // Handle tab visibility changes to pause animations
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (document.hidden && isAudioPlaying) {
      if (bgAudioEl) bgAudioEl.pause();
    } else if (!document.hidden && isAudioPlaying) {
      if (bgAudioEl) bgAudioEl.play().catch(() => {});
    }
  });

  return {
    init: () => {
      initParticles();
      initButterflies();
      initAudio();
    },
    triggerCelebrationConfetti,
    toggleAudio
  };
})();

window.EffectsManager = EffectsManager;
