/* ==========================================================================
   STAR WARS MODERN PORTFOLIO INTERACTIVITY & CANVAS ENGINE
   Developer: Mikael Kevin Siahaan (Siswa SMK Telkom Purwokerto)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STARFIELD & NEBULA CANVAS ENGINE
  // ==========================================
  const canvas = document.getElementById('starfield-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const STAR_COUNT = 300;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = (Math.random() - 0.5) * width * 2;
      this.y = (Math.random() - 0.5) * height * 2;
      this.z = Math.random() * width;
      this.size = Math.random() * 1.5 + 0.5;
      this.color = ['#ffffff', '#70d6ff', '#ffe81f', '#ff0055'][Math.floor(Math.random() * 4)];
      this.alpha = Math.random();
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.z -= 0.8;
      if (this.z <= 0) {
        this.reset();
        this.z = width;
      }
      this.alpha += this.twinkleSpeed;
      if (this.alpha > 1 || this.alpha < 0.2) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }
    }

    draw() {
      const k = 256 / this.z;
      const px = this.x * k + width / 2 + mouse.x * 0.05;
      const py = this.y * k + height / 2 + mouse.y * 0.05;
      const sz = Math.max(0.5, (1 - this.z / width) * this.size * 2);

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        ctx.save();
        ctx.globalAlpha = Math.abs(this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  function initStarfield() {
    resizeCanvas();
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
  }

  function animateStarfield() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    requestAnimationFrame(animateStarfield);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX - window.innerWidth / 2;
    mouse.targetY = e.clientY - window.innerHeight / 2;
  });

  initStarfield();
  animateStarfield();

  // ==========================================
  // 2. WEB AUDIO API SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Sci-fi Button Beep
  function playBeep(freq = 800, type = 'sine', duration = 0.08) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Lightsaber Ignite SFX
  function playSaberIgniteSound() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  // Blaster Laser Transmission SFX
  function playBlasterSound() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Synthesized Fanfare Intro Notes (Web Audio API)
  let crawlAudioTimer = null;
  function playSynthesizedTheme() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      const notes = [
        { freq: 293.66, dur: 0.5, delay: 0 },    // D4
        { freq: 440.00, dur: 0.8, delay: 0.6 },  // A4
        { freq: 392.00, dur: 0.2, delay: 1.5 },  // G4
        { freq: 369.99, dur: 0.2, delay: 1.8 },  // F#4
        { freq: 329.63, dur: 0.2, delay: 2.1 },  // E4
        { freq: 587.33, dur: 0.8, delay: 2.4 },  // D5
        { freq: 440.00, dur: 0.5, delay: 3.3 }   // A4
      ];

      notes.forEach(n => {
        setTimeout(() => {
          if (!isSoundEnabled) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + n.dur);
        }, n.delay * 1000);
      });
    } catch (e) {}
  }

  // Sound Toggle Controls
  const soundToggleBtn = document.getElementById('sound-toggle');
  const btnAudioIntro = document.getElementById('btn-audio-intro');

  function updateSoundUI() {
    const iconClass = isSoundEnabled ? 'fa-volume-high' : 'fa-volume-xmark';
    if (soundToggleBtn) {
      soundToggleBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    }
    if (btnAudioIntro) {
      btnAudioIntro.innerHTML = `<i class="fa-solid ${iconClass}"></i> AUDIO: ${isSoundEnabled ? 'ON' : 'OFF'}`;
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      updateSoundUI();
      if (isSoundEnabled) playBeep(900);
    });
  }

  if (btnAudioIntro) {
    btnAudioIntro.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      updateSoundUI();
    });
  }

  // ==========================================
  // 3. INTRO SCREEN & OPENING CRAWL CONTROLLER
  // ==========================================
  const introScreen = document.getElementById('intro-screen');
  const introQuote = document.getElementById('intro-quote');
  const introLogoContainer = document.getElementById('intro-logo-container');
  const crawlWrapper = document.getElementById('crawl-wrapper');
  const btnSkipIntro = document.getElementById('btn-skip-intro');
  const btnReplayCrawl = document.getElementById('btn-replay-crawl');

  let introStep1Timer, introStep2Timer, introEndTimer;

  function startOpeningCrawl() {
    if (!introScreen) return;
    introScreen.classList.remove('fade-out');
    introQuote.style.display = 'block';
    introLogoContainer.classList.remove('active');
    crawlWrapper.classList.remove('active');

    // Play fanfare melody
    playSynthesizedTheme();

    // Step 2: Logo after 5s
    introStep1Timer = setTimeout(() => {
      introQuote.style.display = 'none';
      introLogoContainer.classList.add('active');
    }, 5000);

    // Step 3: Crawl text after 11s
    introStep2Timer = setTimeout(() => {
      introLogoContainer.classList.remove('active');
      crawlWrapper.classList.add('active');
    }, 11000);

    // Auto-close intro after 55s
    introEndTimer = setTimeout(() => {
      closeIntro();
    }, 55000);
  }

  function closeIntro() {
    clearTimeout(introStep1Timer);
    clearTimeout(introStep2Timer);
    clearTimeout(introEndTimer);
    if (introScreen) {
      introScreen.classList.add('fade-out');
    }
    playSaberIgniteSound();
  }

  if (btnSkipIntro) {
    btnSkipIntro.addEventListener('click', () => {
      playBeep(600);
      closeIntro();
    });
  }

  if (btnReplayCrawl) {
    btnReplayCrawl.addEventListener('click', () => {
      playBeep(700);
      startOpeningCrawl();
    });
  }

  // Auto Start Crawl on Page Load
  startOpeningCrawl();

  // ==========================================
  // 4. LIGHTSABER COLOR & THEME SWITCHER
  // ==========================================
  const colorDots = document.querySelectorAll('.color-dot');
  const alignmentToggle = document.getElementById('alignment-toggle');

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      setSaberTheme(color);
      playSaberIgniteSound();
    });
  });

  function setSaberTheme(color) {
    document.body.className = `theme-${color}`;
    colorDots.forEach(d => d.classList.remove('active'));
    const activeDot = document.querySelector(`.color-dot[data-color="${color}"]`);
    if (activeDot) activeDot.classList.add('active');

    // Update alignment label
    if (alignmentToggle) {
      const label = alignmentToggle.querySelector('.align-label');
      if (color === 'red') {
        label.textContent = 'DARK SIDE';
      } else {
        label.textContent = 'LIGHT SIDE';
      }
    }
  }

  if (alignmentToggle) {
    alignmentToggle.addEventListener('click', () => {
      if (document.body.classList.contains('theme-sith')) {
        setSaberTheme('blue');
      } else {
        setSaberTheme('red');
      }
      playSaberIgniteSound();
    });
  }

  // ==========================================
  // 5. SKILL & PROJECT CATEGORY FILTERS
  // ==========================================
  // Skill Filters
  const skillBtns = document.querySelectorAll('[data-skill-cat]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(850);
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-skill-cat');
      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Filters
  const projFilterBtns = document.querySelectorAll('[data-proj-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(850);
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-proj-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-proj-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 6. PROJECT MODAL POPUP & INTERACTIVE DEMOS
  // ==========================================
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTags = document.getElementById('modal-project-tags');
  const modalScreen = document.getElementById('modal-project-screen');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-close-trigger');

  const projectDetailsMap = {
    'modal-tt': {
      title: 'DESAIN UI/UX TOCO-TACO',
      desc: 'Rancangan antarmuka pengguna (UI/UX) untuk aplikasi pemesanan makanan Toco Taco. Mengusung tema hijau segar dengan alur splash screen, autentikasi login/daftar, katalog menu produk makanan Meksiko, dan sistem informasi gerai toko.',
      tags: ['Figma', 'UI/UX Design', 'Mobile App UI', 'Wireframing', 'Prototyping'],
      svg: `<svg viewBox="0 0 500 280" style="width:100%;height:100%;">
              <rect width="500" height="280" fill="#4caf50" rx="6"/>
              <rect x="30" y="30" width="120" height="220" fill="#ffffff" rx="8" stroke="#2e7d32" stroke-width="2"/>
              <circle cx="90" cy="110" r="30" fill="#fff9c4"/>
              <path d="M 65 120 Q 90 85 115 120 Z" fill="#ffe81f" stroke="#e65100" stroke-width="2"/>
              <text x="90" y="160" fill="#1b5e20" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">TOCO TACO</text>
              
              <rect x="190" y="30" width="130" height="220" fill="#ffffff" rx="8" stroke="#2e7d32" stroke-width="2"/>
              <circle cx="255" cy="70" r="18" fill="#fff9c4"/>
              <text x="255" y="100" fill="#1b5e20" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">Masuk Akun</text>
              <rect x="205" y="115" width="100" height="18" rx="4" fill="#fffde7" stroke="#ffd54f"/>
              <text x="212" y="127" fill="#9e9d24" font-size="8" font-family="sans-serif">Email: user@mail.com</text>
              <rect x="205" y="142" width="100" height="18" rx="4" fill="#fffde7" stroke="#ffd54f"/>
              <text x="212" y="154" fill="#9e9d24" font-size="8" font-family="sans-serif">Password: ••••••••</text>
              <rect x="205" y="170" width="100" height="22" rx="11" fill="#2e7d32"/>
              <text x="255" y="184" fill="#ffffff" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">Masuk</text>

              <rect x="350" y="30" width="120" height="220" fill="#ffffff" rx="8" stroke="#2e7d32" stroke-width="2"/>
              <rect x="362" y="50" width="96" height="70" rx="6" fill="#fff9c4"/>
              <text x="410" y="80" fill="#2e7d32" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">Our Store</text>
              <text x="410" y="95" fill="#558b2f" font-size="7" font-family="sans-serif" text-anchor="middle">• Mexico • NYC • Semarang</text>
              <rect x="362" y="170" width="96" height="22" rx="11" fill="#2e7d32"/>
              <text x="410" y="184" fill="#ffffff" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">Daftar</text>
            </svg>`
    },
    'modal-tl': {
      title: 'WEBSITE TRADELAB.ID',
      desc: 'Platform edukasi web interaktif untuk belajar trading dari nol. Menyediakan modul materi kelas trading terstruktur, fitur latihan simulasi praktek, dan sistem pelacakan progress akun pengguna dalam satu dashboard.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Trading Platform', 'Web Application', 'Interactive UI'],
      svg: `<svg viewBox="0 0 500 280" style="width:100%;height:100%;">
              <rect width="500" height="280" fill="#0d1117" rx="6"/>
              <circle cx="70" cy="40" r="80" fill="rgba(0, 230, 118, 0.12)"/>
              <circle cx="430" cy="240" r="90" fill="rgba(0, 230, 118, 0.08)"/>
              <text x="40" y="55" fill="#00e676" font-size="20" font-weight="bold" font-family="sans-serif">Tradelab.id</text>
              <text x="250" y="105" fill="#ffffff" font-size="22" font-weight="900" font-family="sans-serif" text-anchor="middle">Start Learning Journey</text>
              <text x="250" y="130" fill="#9e9e9e" font-size="11" font-family="sans-serif" text-anchor="middle">Access trading lessons, practice, and progress tracking in one dashboard.</text>
              
              <rect x="125" y="148" width="250" height="115" fill="#161b22" rx="10" stroke="rgba(0, 230, 118, 0.3)" stroke-width="1.5"/>
              <text x="145" y="168" fill="#757575" font-size="8" font-family="sans-serif">EMAIL</text>
              <rect x="145" y="174" width="210" height="20" rx="4" fill="#21262d"/>
              <text x="155" y="187" fill="#9e9e9e" font-size="9" font-family="sans-serif">name@firm.com</text>
              
              <text x="145" y="208" fill="#757575" font-size="8" font-family="sans-serif">PASSWORD</text>
              <rect x="145" y="214" width="210" height="20" rx="4" fill="#21262d"/>
              <text x="155" y="227" fill="#9e9e9e" font-size="9" font-family="sans-serif">••••••••••••</text>
              
              <rect x="145" y="242" width="210" height="18" rx="9" fill="#00e676"/>
              <text x="250" y="254" fill="#0d1117" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">Sign In to Dashboard</text>
            </svg>`
    }
  };

  document.querySelectorAll('.btn-open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(900);
      const modalKey = btn.getAttribute('data-modal');
      const details = projectDetailsMap[modalKey];

      if (details && modal) {
        modalTitle.textContent = details.title;
        modalDesc.textContent = details.desc;
        modalScreen.innerHTML = details.svg;
        modalTags.innerHTML = details.tags.map(t => `<span class="tag">${t}</span>`).join('');
        modal.classList.add('active');
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(500);
      if (modal) modal.classList.remove('active');
    });
  });

  // ==========================================
  // 7. SERVICE ESTIMATOR CALCULATOR
  // ==========================================
  const estServiceType = document.getElementById('est-service-type');
  const estScale = document.getElementById('est-scale');
  const estPriceVal = document.getElementById('est-price-val');
  const btnUseEstimate = document.getElementById('btn-use-estimate');

  function calculateEstimate() {
    if (!estServiceType || !estScale || !estPriceVal) return;

    let base = 5000000;
    if (estServiceType.value === 'scifi-ui') base = 6000000;
    if (estServiceType.value === 'canvas3d') base = 8000000;
    if (estServiceType.value === 'optimization') base = 4000000;

    let multiplier = 1;
    if (estScale.value === 'medium') multiplier = 1.5;
    if (estScale.value === 'large') multiplier = 2.5;

    const minPrice = Math.round(base * multiplier);
    const maxPrice = Math.round(minPrice * 1.4);

    estPriceVal.textContent = `RP ${minPrice.toLocaleString('id-ID')} - ${maxPrice.toLocaleString('id-ID')}`;
  }

  if (estServiceType) estServiceType.addEventListener('change', () => { playBeep(800); calculateEstimate(); });
  if (estScale) estScale.addEventListener('change', () => { playBeep(800); calculateEstimate(); });

  if (btnUseEstimate) {
    btnUseEstimate.addEventListener('click', () => {
      playBeep(900);
      const subjectInput = document.getElementById('comm-subject');
      if (subjectInput) {
        subjectInput.value = `Permintaan Layanan ${estServiceType.options[estServiceType.selectedIndex].text} (${estPriceVal.textContent})`;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 8. TRANSMISSION FORM HANDLER & MODAL
  // ==========================================
  const transmissionForm = document.getElementById('transmission-form');
  const transConfirmModal = document.getElementById('trans-confirm-modal');
  const transModalCloseBtns = document.querySelectorAll('.trans-modal-close');

  if (transmissionForm) {
    transmissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playBlasterSound();

      // Show success modal
      if (transConfirmModal) {
        transConfirmModal.classList.add('active');
      }

      // Reset form
      transmissionForm.reset();
    });
  }

  transModalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(500);
      if (transConfirmModal) transConfirmModal.classList.remove('active');
    });
  });

  // ==========================================
  // 9. VISITOR COMMENTS
  // ==========================================
  const commentForm = document.getElementById('comment-form');
  const commentsList = document.getElementById('comments-list');
  const commentCount = document.getElementById('comment-count');
  const commentsStorageKey = 'mikael-portfolio-comments';

  function getComments() {
    try {
      return JSON.parse(localStorage.getItem(commentsStorageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function renderComments() {
    if (!commentsList || !commentCount) return;

    const comments = getComments();
    commentCount.textContent = `${comments.length} PESAN`;
    commentsList.innerHTML = '';

    if (comments.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'comments-empty';
      emptyState.textContent = 'Belum ada transmisi. Jadilah yang pertama mengirim komentar.';
      commentsList.appendChild(emptyState);
      return;
    }

    comments.forEach(comment => {
      const entry = document.createElement('article');
      entry.className = 'comment-entry';

      const header = document.createElement('div');
      header.className = 'comment-entry-header';

      const author = document.createElement('strong');
      author.className = 'comment-author';
      author.textContent = comment.name;

      const date = document.createElement('time');
      date.className = 'comment-date';
      date.dateTime = comment.date;
      date.textContent = new Date(comment.date).toLocaleDateString('id-ID');

      const message = document.createElement('p');
      message.className = 'comment-text';
      message.textContent = comment.message;

      header.append(author, date);
      entry.append(header, message);
      commentsList.appendChild(entry);
    });
  }

  if (commentForm) {
    commentForm.addEventListener('submit', event => {
      event.preventDefault();

      const nameInput = document.getElementById('comment-name');
      const messageInput = document.getElementById('comment-message');
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !message) return;

      const comments = getComments();
      comments.unshift({ name, message, date: new Date().toISOString() });
      localStorage.setItem(commentsStorageKey, JSON.stringify(comments.slice(0, 50)));
      commentForm.reset();
      renderComments();
      playBeep(900);
    });
  }

  renderComments();

  // ==========================================
  // 10. STICKY NAVBAR MOBILE TOGGLE & SCROLL OBSERVER
  // ==========================================
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const lightsaberNav = document.querySelector('.lightsaber-nav');

  if (mobileToggleBtn && lightsaberNav) {
    mobileToggleBtn.addEventListener('click', () => {
      playBeep(700);
      lightsaberNav.classList.toggle('mobile-active');
    });
  }

  // Close mobile nav when clicking item
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', () => {
      playBeep(750);
      if (lightsaberNav) lightsaberNav.classList.remove('mobile-active');
    });
  });

  // Scroll Active Link Highlighting
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-item a[href*=${sectionId}]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
          navItem.parentElement.classList.add('active');
        }
      }
    });
  });

});
