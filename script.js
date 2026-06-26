/* ===================================================
   JAMES FEDERIPE — PORTFOLIO JS v4
=================================================== */

/* ===== THEME ===== */
const toggle   = document.getElementById('theme-toggle');
const sunIcon  = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'light') {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  } else {
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}

function loadTheme() {
  let saved = localStorage.getItem('theme');
  if (!saved) {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(saved);
}

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ===== SIDEBAR / MOBILE DRAWER ===== */
const sidebar         = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const hamburger       = document.getElementById('hamburger');

function openDrawer() {
  sidebar.classList.add('open');
  sidebarBackdrop.classList.add('open');
  hamburger.classList.add('active');
}

function closeDrawer() {
  sidebar.classList.remove('open');
  sidebarBackdrop.classList.remove('open');
  hamburger.classList.remove('active');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeDrawer() : openDrawer();
  });
}
if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener('click', closeDrawer);
}

/* ===== SPA NAVIGATION ===== */
const pages    = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.side-link');

function showPage(id) {
  const target = id.replace('#', '');

  pages.forEach(p => {
    p.classList.toggle('active-page', p.id === target);
  });

  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-nav') === target);
  });

  closeDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(initScrollReveal, 80);

  if (target === 'home') setTimeout(initCounters, 200);
  if (target === 'resume') setTimeout(animateSkillBars, 300);
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href') || ('#' + link.getAttribute('data-nav'));
    showPage(href);
  });
});

/* Any other in-page anchor that points at a page id (hero buttons, etc.) */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.classList.contains('side-link')) return;
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const targetPage = document.getElementById(href.replace('#', ''));
    if (targetPage && targetPage.classList.contains('page')) {
      e.preventDefault();
      showPage(href);
    }
  });
});

/* ===== VIDEO: STRICT MUTUAL EXCLUSION =====
   Fix: previous version relied on a play().then() callback to flag the
   "is-playing" state, which could resolve AFTER another video had already
   been told to take over — letting two cards appear active at once.
   This version drives all state off the video element's own play/pause
   events, and always pauses every other video before starting a new one. */
function initVideos() {
  const cards = Array.from(document.querySelectorAll('.vid-card'));

  function formatDur(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function pauseAllExcept(exceptVideo) {
    cards.forEach(c => {
      const v = c.querySelector('video');
      if (v && v !== exceptVideo && !v.paused) {
        v.pause();
        v.currentTime = 0;
      }
    });
  }

  cards.forEach((card) => {
    const video   = card.querySelector('video');
    const playBtn = card.querySelector('.vid-play-btn');
    const index   = parseInt(card.getAttribute('data-index'), 10);
    const durEl   = document.getElementById('dur' + index);
    if (!video) return;

    video.addEventListener('loadedmetadata', () => {
      if (durEl && video.duration && isFinite(video.duration)) {
        durEl.textContent = formatDur(video.duration);
      }
    });

    video.addEventListener('play', () => {
      pauseAllExcept(video);
      card.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
      card.classList.remove('is-playing');
    });

    video.addEventListener('ended', () => {
      video.currentTime = 0;
      card.classList.remove('is-playing');
    });

    function toggle() {
      if (video.paused) {
        pauseAllExcept(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    card.addEventListener('click', (e) => {
      if (e.target === playBtn || playBtn.contains(e.target)) return;
      toggle();
    });
  });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.page.active-page .reveal:not(.visible)');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const idx   = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const nums = document.querySelectorAll('.s-num');
  nums.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    let current = 0;
    const duration = 1200;
    const step = target / (duration / 16);
    function tick() {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current < target) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ===== SKILL BAR ANIMATION ===== */
function animateSkillBars() {
  const fills = document.querySelectorAll('#resume .sk-fill');
  fills.forEach((fill, i) => {
    const targetWidth = fill.style.width;
    fill.style.width = '0';
    setTimeout(() => {
      fill.style.width = targetWidth;
    }, 100 + i * 80);
  });
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  showPage('#home');
  initScrollReveal();
  initCounters();
  initVideos();
  console.log('✅ James Federipe portfolio v4 ready');
});
