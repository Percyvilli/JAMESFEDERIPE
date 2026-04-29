/* ===================================================
   JAMES FEDERIPE — PORTFOLIO JS
=================================================== */

// ===== THEME TOGGLE =====
const toggle   = document.getElementById('theme-toggle');
const sunIcon  = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
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

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}

if (toggle) {
  toggle.addEventListener('click', toggleTheme);
  toggle.addEventListener('touchend', (e) => { e.preventDefault(); toggleTheme(); });
}

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
}

// ===== CAROUSEL =====
const carousel = document.getElementById('toolsCarousel');
const prevBtn  = document.querySelector('.carousel-arrow.prev');
const nextBtn  = document.querySelector('.carousel-arrow.next');

function getScrollAmount() {
  return window.innerWidth < 600 ? 140 : 200;
}

if (carousel) {
  if (prevBtn) {
    const scrollPrev = () => carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    prevBtn.addEventListener('click', scrollPrev);
    prevBtn.addEventListener('touchend', (e) => { e.preventDefault(); scrollPrev(); });
  }
  if (nextBtn) {
    const scrollNext = () => carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    nextBtn.addEventListener('click', scrollNext);
    nextBtn.addEventListener('touchend', (e) => { e.preventDefault(); scrollNext(); });
  }
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
          const index = siblings.indexOf(entry.target);
          const delay = index * 80;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
}

// ===== ACTIVE NAV LINK =====
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links li a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.style.color = '');
          const active = document.querySelector(`.nav-links li a[href="#${entry.target.id}"]`);
          if (active) active.style.color = 'var(--accent)';
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => observer.observe(s));
}

// ===== VIDEO PLACEHOLDER CLICK =====
function initVideoPlaceholders() {
  document.querySelectorAll('.video-placeholder').forEach(vp => {
    const video = vp.querySelector('video');
    if (video) {
      const inner = vp.querySelector('.video-placeholder-inner');
      if (inner) inner.style.display = 'none';
      vp.addEventListener('click', () => {
        if (video.paused) video.play();
        else video.pause();
      });
    }
  });
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initScrollReveal();
  initNavbarScroll();
  initActiveNav();
  initVideoPlaceholders();
  console.log('✅ James Federipe portfolio ready');
});
