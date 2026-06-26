/* ===================================================
   JAMES FEDERIPE — PORTFOLIO JS v3
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

/* ===== CUSTOM CURSOR ===== */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, rafId = null;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
    if (!rafId) rafId = requestAnimationFrame(animateRing);
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }

  const hoverEls = 'a, button, .vid-card, .tc, .svc-card, .edu-card, .work-block, .va-item, .dev-item, .social-pill, .contact-link-item, .gloss-item, .resume-section-card, .tl-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ===== SPA NAVIGATION ===== */
const pages    = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link, .mob-link');

function showPage(id) {
  const target = id.replace('#', '');

  pages.forEach(p => {
    if (p.id === target) {
      p.classList.add('active-page');
    } else {
      p.classList.remove('active-page');
    }
  });

  navLinks.forEach(a => {
    const nav = a.getAttribute('data-nav');
    a.classList.toggle('active', nav === target);
  });

  closeMenu();
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

document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (!link.classList.contains('nav-link') && !link.classList.contains('mob-link')) {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const targetPage = document.getElementById(href.replace('#', ''));
      if (targetPage && targetPage.classList.contains('page')) {
        e.preventDefault();
        showPage(href);
      }
    });
  }
});

/* ===== MOBILE NAV ===== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
});

/* ===== VIDEO: MUTUAL EXCLUSION ===== */
function initVideos() {
  const cards = document.querySelectorAll('.vid-card');

  cards.forEach((card) => {
    const video   = card.querySelector('video');
    const playBtn = card.querySelector('.vid-play-btn');
    const index   = parseInt(card.getAttribute('data-index'));
    const durEl   = document.getElementById('dur' + index);
    if (!video) return;

    function formatDur(secs) {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return m + ':' + String(s).padStart(2, '0');
    }

    video.addEventListener('loadedmetadata', () => {
      if (durEl && video.duration && isFinite(video.duration)) {
        durEl.textContent = formatDur(video.duration);
      }
    });

    function stopAll() {
      cards.forEach(c => {
        const v = c.querySelector('video');
        if (v && !v.paused) { v.pause(); v.currentTime = 0; }
        c.classList.remove('is-playing');
      });
    }

    function playThis() {
      stopAll();
      video.play().then(() => card.classList.add('is-playing')).catch(() => {});
    }

    function pauseThis() {
      video.pause();
      card.classList.remove('is-playing');
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.paused ? playThis() : pauseThis();
    });

    card.addEventListener('click', (e) => {
      if (e.target === playBtn || playBtn.contains(e.target)) return;
      card.classList.contains('is-playing') ? pauseThis() : playThis();
    });

    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
      video.currentTime = 0;
    });

    video.addEventListener('pause', () => card.classList.remove('is-playing'));
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

/* ===== NAVBAR SCROLL SHADOW ===== */
function initNavShadow() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 40px rgba(0,0,0,0.35)'
      : 'none';
  }, { passive: true });
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  showPage('#home');
  initScrollReveal();
  initCounters();
  initNavShadow();
  initVideos();
  console.log('✅ James Federipe portfolio v3 ready');
});
