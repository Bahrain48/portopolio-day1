/**
 * ==============================================================================
 * PORTFOLIO M. BAHRAIN ARRAFI - JAVASCRIPT LOGIC
 * Kelas: XI RPL 1 · SMK Telkom Lampung
 * Fitur: Typing Effect, 3D Tilt, ScrollSpy, Web Audio Synth, Cyberpunk Snake Game
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Fitur UI Utama
  initCustomCursor();
  initTypingEffect();
  initNavbarScroll();
  initMobileMenu();
  initCardTilt();
  initContactForm();
  initEmailCopy();
  initScrollTop();

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Inisialisasi Game Arcade Cyberpunk Snake
  initCyberSnakeGame();
});

/* --------------------------------------------------------------------------
   1. CUSTOM GLOWING CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (!cursorGlow || !cursorDot) return;

  // Jangan aktifkan jika layar sentuh / mobile
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorGlow.style.display = 'none';
    cursorDot.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.opacity = '1';
    cursorGlow.style.opacity = '1';

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Animasi lag halus pada glow ring
  function renderCursor() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;

    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Efek hover membesar pada link & button
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, canvas');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorGlow.style.opacity = '0';
  });
}

/* --------------------------------------------------------------------------
   2. TYPING EFFECT (HERO SECTION)
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'Frontend Architecture & Interactive UI',
    'Fullstack Web & Laravel Development',
    'Database Engineering & Clean Query (MySQL)',
    'Siswa XI RPL 1 @ SMK Telkom Lampung',
    'Creative Technologist & Fast Learner'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 65;
  const deleteSpeed = 35;
  const holdTime = 2000;

  function type() {
    const currentText = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typingElement.textContent = currentText.substring(0, charIndex);
    } else {
      charIndex++;
      typingElement.textContent = currentText.substring(0, charIndex);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      delay = holdTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. NAVBAR SCROLL & ACTIVE SCROLL-SPY
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header glass effect saat scroll
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Tutup jika klik di luar
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

/* --------------------------------------------------------------------------
   5. 3D TILT EFFECT ON CARDS
   -------------------------------------------------------------------------- */
function initCardTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt], #heroCard');

  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = deltaY * -8;
      const rotateY = deltaX * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/* --------------------------------------------------------------------------
   6. PROJECT DETAILS MODAL
   -------------------------------------------------------------------------- */
const projectData = {
  'smart-presensi': {
    title: 'Telkom Smart Academic & Presensi Digital',
    tags: ['PHP Laravel', 'MySQL', 'Tailwind CSS', 'QR Code API'],
    description: 'Sistem aplikasi manajemen kehadiran siswa harian dengan integrasi kode QR acak yang diperbarui setiap 60 detik untuk mencegah kecurangan. Dilengkapi fitur rekap nilai otomatis kurikulum merdeka dan cetak rapor.',
    features: [
      'Generate QR Code dinamis berbasis time-sync',
      'Dashboard statistik kehadiran harian, mingguan, & bulanan',
      'Role akun multi-tingkat: Admin TU, Wali Kelas, Guru Pengampu, Siswa',
      'Laporan ekspor Excel dan PDF siap cetak',
      'Arsitektur basis data MySQL ternormalisasi hingga 3NF'
    ]
  },
  'aura-pos': {
    title: 'Aura POS - Kasir Pintar & Inventaris Toko',
    tags: ['JavaScript ES6+', 'IndexedDB', 'PWA Ready', 'Web Print API'],
    description: 'Aplikasi kasir titik penjualan (Point of Sale) modern untuk mempermudah transaksi kantin sekolah dan toko ritel. Tetap berjalan cepat bahkan saat koneksi internet terputus berkat penyimpanan lokal IndexedDB.',
    features: [
      'Pencarian produk instan dan pemindaian barcode kamera',
      'Pencetakan struk thermal via Bluetooth / Web Print API',
      'Kalkulasi diskon, pajak, dan kembalian otomatis bebas human error',
      'Laporan ringkasan laba kotor & omzet harian',
      'Desain antarmuka responsif ramah layar sentuh (tablet/smartphone)'
    ]
  },
  'library-digital': {
    title: 'Perpustakaan Digital SMK Telkom Lampung',
    tags: ['REST API', 'JavaScript', 'Modern CSS', 'MySQL Database'],
    description: 'Platform katalog buku digital perpustakaan sekolah yang menyajikan pencarian cepat buku referensi RPL, novel, dan modul praktikum. Dilengkapi sistem notifikasi tenggat waktu peminjaman buku.',
    features: [
      'Pencarian buku dengan filter kategori (Teknologi, Fiksi, Sains, dll)',
      'Sistem booking peminjaman mandiri menggunakan nomor induk siswa (NIS)',
      'Peringatan denda dan batas tanggal kembali otomatis',
      'Integrasi REST API terstruktur untuk kemudahan pengembangan mobile app',
      'Review dan rating buku dari sesama siswa'
    ]
  }
};

function openProjectModal(projectId) {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const project = projectData[projectId];

  if (!modal || !modalBody || !project) return;

  const tagsHTML = project.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
  const featuresHTML = project.features.map(f => `<li>${f}</li>`).join('');

  modalBody.innerHTML = `
    <div class="modal-header-meta">${tagsHTML}</div>
    <h3 class="modal-title">${project.title}</h3>
    <p class="modal-desc">${project.description}</p>
    <div class="modal-features-list">
      <h4>Fitur Utama yang Diimplementasikan:</h4>
      <ul>${featuresHTML}</ul>
    </div>
    <div class="modal-cta-group">
      <button class="btn btn-primary" onclick="closeProjectModal()">
        <span>Tutup Detail</span>
      </button>
      <a href="#contact" class="btn btn-arcade" onclick="closeProjectModal()">
        <span>Diskusi Proyek Ini</span>
      </a>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}

// Modal event listeners
const modalCloseBtn = document.getElementById('modalCloseBtn');
const projectModal = document.getElementById('projectModal');

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
    closeProjectModal();
  }
});

/* --------------------------------------------------------------------------
   7. CONTACT FORM SIMULATION & FEEDBACK
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');
  const submitBtn = document.getElementById('btnSubmitForm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !subject || !message) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Mengirim Pesan...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Kirim Pesan Sekarang</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      `;

      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `Terima kasih <strong>${name}</strong>! Pesan Anda telah diterima oleh M. Bahrain Arrafi. Saya akan segera membalas ke <em>${email}</em>.`;

      form.reset();

      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 7000);
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   8. COPY EMAIL TO CLIPBOARD
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('btnCopyEmail');
  const emailText = document.getElementById('emailText');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText.textContent.trim()).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Tersalin! ✓';
      copyBtn.style.background = '#10b981';
      copyBtn.style.color = '#ffffff';

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2500);
    }).catch(() => {
      alert('Email: ' + emailText.textContent);
    });
  });
}

/* --------------------------------------------------------------------------
   9. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   10. WEB AUDIO API SYNTHESIZER (SOUND EFFECTS)
   -------------------------------------------------------------------------- */
class CyberSoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playEat() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playBonus() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playGameOver() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  playStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }
}

/* --------------------------------------------------------------------------
   11. CYBERPUNK NEON SNAKE ARCADE GAME ENGINE
   -------------------------------------------------------------------------- */
function initCyberSnakeGame() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // DOM Elements
  const currentScoreEl = document.getElementById('currentScore');
  const highScoreEl = document.getElementById('highScore');
  const gameOverlay = document.getElementById('gameOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const overlayIcon = document.getElementById('overlayIcon');
  const overlayStats = document.getElementById('overlayStats');
  const finalScoreVal = document.getElementById('finalScoreVal');
  const overlayHighScoreVal = document.getElementById('overlayHighScoreVal');
  const btnStartGame = document.getElementById('btnStartGame');
  const startBtnText = document.getElementById('startBtnText');
  const btnPauseGame = document.getElementById('btnPauseGame');
  const btnResetHigh = document.getElementById('btnResetHigh');
  const btnToggleAudio = document.getElementById('btnToggleAudio');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');
  const diffButtons = document.querySelectorAll('.btn-diff');

  // Audio Synth Instance
  const soundFX = new CyberSoundFX();

  // Grid Config
  const GRID_SIZE = 20; // 24 x 24 grid for 480x480
  const TILE_COUNT = canvas.width / GRID_SIZE;

  // Game State
  let snake = [];
  let velocity = { x: 0, y: 0 };
  let nextVelocity = { x: 0, y: 0 };
  let food = { x: 5, y: 5, isBonus: false };
  let score = 0;
  let highScore = parseInt(localStorage.getItem('cyber_snake_highscore')) || 0;
  let gameInterval = null;
  let gameSpeed = 110; // milliseconds
  let isRunning = false;
  let isPaused = false;
  let particles = [];
  let pulseRadius = 0;

  highScoreEl.textContent = highScore;

  // 11.1 Spawn Food
  function spawnFood() {
    let valid = false;
    let newFood = {};

    while (!valid) {
      newFood.x = Math.floor(Math.random() * TILE_COUNT);
      newFood.y = Math.floor(Math.random() * TILE_COUNT);

      // Pastikan makanan tidak muncul di tubuh ular
      const onSnake = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) {
        valid = true;
      }
    }

    // 20% kemungkinan muncul Golden Bonus Orb
    newFood.isBonus = Math.random() < 0.2;
    food = newFood;
  }

  // 11.2 Partikel Ledakan saat makan
  function createBurstParticles(x, y, color) {
    const pixelX = x * GRID_SIZE + GRID_SIZE / 2;
    const pixelY = y * GRID_SIZE + GRID_SIZE / 2;

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 / 14) * i + Math.random() * 0.5;
      const speed = Math.random() * 3 + 1.5;
      particles.push({
        x: pixelX,
        y: pixelY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color: color,
        alpha: 1,
        life: 0.94
      });
    }
  }

  // 11.3 Reset Game State
  function resetGame() {
    snake = [
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 }
    ];
    velocity = { x: 1, y: 0 };
    nextVelocity = { x: 1, y: 0 };
    score = 0;
    particles = [];
    currentScoreEl.textContent = '0';
    spawnFood();
  }

  // 11.4 Start Game
  function startGame() {
    resetGame();
    isRunning = true;
    isPaused = false;
    gameOverlay.style.display = 'none';
    soundFX.playStart();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
  }

  // 11.5 Game Over
  function triggerGameOver() {
    isRunning = false;
    clearInterval(gameInterval);
    soundFX.playGameOver();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('cyber_snake_highscore', highScore);
      highScoreEl.textContent = highScore;
    }

    // Render Overlay Game Over
    overlayIcon.textContent = '💥';
    overlayTitle.textContent = 'FIREWALL DETECTED - GAME OVER';
    overlayTitle.style.color = '#ef4444';
    overlayDesc.textContent = 'Protokol transmisi terputus akibat tabrakan. Jangan menyerah, coba lagi!';
    finalScoreVal.textContent = score;
    overlayHighScoreVal.textContent = highScore;
    overlayStats.style.display = 'flex';
    startBtnText.textContent = 'MAIN LAGI (RESTART)';
    gameOverlay.style.display = 'flex';
  }

  // 11.6 Game Loop
  function gameLoop() {
    if (isPaused) return;

    // Terapkan arah yang telah divalidasi
    velocity = { ...nextVelocity };

    // Posisi kepala baru
    const head = {
      x: snake[0].x + velocity.x,
      y: snake[0].y + velocity.y
    };

    // Deteksi tabrakan dinding
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      triggerGameOver();
      return;
    }

    // Deteksi tabrakan tubuh sendiri
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        triggerGameOver();
        return;
      }
    }

    snake.unshift(head);

    // Cek jika memakan food
    if (head.x === food.x && head.y === food.y) {
      if (food.isBonus) {
        score += 35;
        soundFX.playBonus();
        createBurstParticles(food.x, food.y, '#f59e0b');
      } else {
        score += 10;
        soundFX.playEat();
        createBurstParticles(food.x, food.y, '#00f0ff');
      }

      currentScoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
      }
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  // 11.7 Render Grafis Canvas
  function draw() {
    // 1. Bersihkan canvas dengan latar belakang grid samar
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar grid cyber
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 2. Gambar Makanan (Food Orb)
    pulseRadius += 0.08;
    const pulseOffset = Math.sin(pulseRadius) * 2;
    const foodPixelX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const foodPixelY = food.y * GRID_SIZE + GRID_SIZE / 2;

    if (food.isBonus) {
      // Golden Bonus Orb
      ctx.save();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(foodPixelX, foodPixelY, (GRID_SIZE / 2 - 2) + pulseOffset, 0, Math.PI * 2);
      ctx.fill();

      // Core putih berkilau
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(foodPixelX, foodPixelY, (GRID_SIZE / 4), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Neon Cyan Regular Food
      ctx.save();
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(foodPixelX, foodPixelY, (GRID_SIZE / 2 - 3) + pulseOffset, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(foodPixelX, foodPixelY, (GRID_SIZE / 5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Gambar Ular Neon
    for (let i = 0; i < snake.length; i++) {
      const seg = snake[i];
      const segX = seg.x * GRID_SIZE;
      const segY = seg.y * GRID_SIZE;

      ctx.save();
      if (i === 0) {
        // Kepala Ular
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#a855f7';
        roundRect(ctx, segX + 2, segY + 2, GRID_SIZE - 4, GRID_SIZE - 4, 6);
        ctx.fill();

        // Mata Ular
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        const eyeOffset = 5;
        if (velocity.x === 1) { // Kanan
          ctx.arc(segX + GRID_SIZE - 5, segY + eyeOffset, 2, 0, Math.PI * 2);
          ctx.arc(segX + GRID_SIZE - 5, segY + GRID_SIZE - eyeOffset, 2, 0, Math.PI * 2);
        } else if (velocity.x === -1) { // Kiri
          ctx.arc(segX + 5, segY + eyeOffset, 2, 0, Math.PI * 2);
          ctx.arc(segX + 5, segY + GRID_SIZE - eyeOffset, 2, 0, Math.PI * 2);
        } else if (velocity.y === 1) { // Bawah
          ctx.arc(segX + eyeOffset, segY + GRID_SIZE - 5, 2, 0, Math.PI * 2);
          ctx.arc(segX + GRID_SIZE - eyeOffset, segY + GRID_SIZE - 5, 2, 0, Math.PI * 2);
        } else { // Atas
          ctx.arc(segX + eyeOffset, segY + 5, 2, 0, Math.PI * 2);
          ctx.arc(segX + GRID_SIZE - eyeOffset, segY + 5, 2, 0, Math.PI * 2);
        }
        ctx.fill();
      } else {
        // Tubuh Ular Gradient Transisi
        const gradRatio = 1 - (i / snake.length) * 0.5;
        ctx.fillStyle = `rgba(139, 92, 246, ${gradRatio})`;
        roundRect(ctx, segX + 2, segY + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Update & Gambar Partikel Ledakan
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha *= p.life;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.alpha <= 0.05) {
        particles.splice(i, 1);
      }
    }
  }

  // Helper menggambar rounded rect di Canvas
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // 11.8 Kontrol Arah
  function changeDirection(newDir) {
    if (!isRunning || isPaused) return;

    // Cegah berbalik arah 180 derajat langsung
    if (newDir.x !== 0 && velocity.x === -newDir.x) return;
    if (newDir.y !== 0 && velocity.y === -newDir.y) return;

    nextVelocity = newDir;
  }

  // Keyboard Event Listener
  window.addEventListener('keydown', (e) => {
    // Abaikan jika user sedang mengetik di input form
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
        break;
      case ' ':
        // Space to Pause/Resume
        if (isRunning) {
          e.preventDefault();
          togglePause();
        }
        break;
    }
  });

  // Mobile Touch D-Pad Listeners
  document.getElementById('dpadUp')?.addEventListener('click', () => changeDirection({ x: 0, y: -1 }));
  document.getElementById('dpadDown')?.addEventListener('click', () => changeDirection({ x: 0, y: 1 }));
  document.getElementById('dpadLeft')?.addEventListener('click', () => changeDirection({ x: -1, y: 0 }));
  document.getElementById('dpadRight')?.addEventListener('click', () => changeDirection({ x: 1, y: 0 }));

  // Pause / Resume Functionality
  function togglePause() {
    if (!isRunning) return;
    isPaused = !isPaused;
    btnPauseGame.querySelector('.tool-label').textContent = isPaused ? 'Lanjut' : 'Jeda';
    btnPauseGame.querySelector('.tool-icon').textContent = isPaused ? '▶️' : '⏸️';
  }
  btnPauseGame?.addEventListener('click', togglePause);

  // Start Button Listener
  btnStartGame?.addEventListener('click', startGame);

  // Reset Highscore Button
  btnResetHigh?.addEventListener('click', () => {
    if (confirm('Reset rekor nilai game tertinggi?')) {
      highScore = 0;
      localStorage.removeItem('cyber_snake_highscore');
      highScoreEl.textContent = '0';
    }
  });

  // Toggle Audio Synthesizer
  btnToggleAudio?.addEventListener('click', () => {
    soundFX.isMuted = !soundFX.isMuted;
    if (soundFX.isMuted) {
      audioIcon.textContent = '🔇';
      audioText.textContent = 'Sound OFF';
      btnToggleAudio.style.opacity = '0.6';
    } else {
      audioIcon.textContent = '🔊';
      audioText.textContent = 'Sound ON';
      btnToggleAudio.style.opacity = '1';
      soundFX.playStart();
    }
  });

  // Difficulty / Speed Selection
  diffButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      diffButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameSpeed = parseInt(btn.getAttribute('data-speed'));

      if (isRunning && !isPaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
      }
    });
  });

  // Initial single frame render
  draw();
}
